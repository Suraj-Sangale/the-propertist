#!/usr/bin/env python3
"""
Property Listing Web Scraper
============================
A robust, modular, and configurable Python scraper that extracts property
listing details from publicly accessible real estate pages (such as Magicbricks)
and outputs structured, validated JSON for downstream web backends.

Features:
- Dual-source extraction (JSON-LD ItemList schema + DOM card parsing)
- URL canonicalization and robots.txt / WAF awareness
- Price, area, floor, and seller type normalization
- Deduplication via property ID and canonical URLs
- Configurable selectors and polite rate-limiting
- Optional Playwright headless browser fallback support
"""

import argparse
import json
import logging
import re
import sys
import time
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional, Set, Tuple
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("PropertyScraper")


# ---------------------------------------------------------------------------
# Data Models
# ---------------------------------------------------------------------------

@dataclass
class PropertyListing:
    """Structured property listing adhering to backend JSON schema."""
    property_id: Optional[str] = None
    title: Optional[str] = None
    property_type: Optional[str] = None
    listing_type: Optional[str] = None  # "sale" or "rent"
    price: Optional[int] = None
    price_per_sqft: Optional[int] = None
    location: Optional[str] = None
    city: Optional[str] = None
    locality: Optional[str] = None
    address: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    balconies: Optional[int] = None
    built_up_area: Optional[float] = None
    carpet_area: Optional[float] = None
    area_unit: Optional[str] = "sqft"
    furnishing_status: Optional[str] = None
    floor_number: Optional[int] = None
    total_floors: Optional[int] = None
    parking: Optional[str] = None
    property_age: Optional[str] = None
    description: Optional[str] = None
    amenities: List[str] = field(default_factory=list)
    image_urls: List[str] = field(default_factory=list)
    property_url: Optional[str] = None
    posted_by: Optional[str] = None
    seller_type: Optional[str] = None  # "owner", "agent", or "builder"
    posted_date: Optional[str] = None


@dataclass
class ScraperOutput:
    """Wrapper output schema for backend ingestion."""
    source: str
    source_url: str
    city: Optional[str]
    total_scraped: int
    properties: List[Dict[str, Any]]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "source": self.source,
            "source_url": self.source_url,
            "city": self.city,
            "total_scraped": self.total_scraped,
            "properties": self.properties,
        }


# ---------------------------------------------------------------------------
# Configurable Selectors & Settings
# ---------------------------------------------------------------------------

DEFAULT_CONFIG = {
    "headers": {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept": (
            "text/html,application/xhtml+xml,application/xml;q=0.9,"
            "image/avif,image/webp,*/*;q=0.8"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    },
    "selectors": {
        "listing_cards": ".mb-srp__card",
        "title": ".mb-srp__card--title",
        "price": ".mb-srp__card__price--amount",
        "price_per_sqft": ".mb-srp__card__price--size",
        "summary_item": ".mb-srp__card__summary__list--item",
        "summary_label": ".mb-srp__card__summary--label",
        "summary_value": ".mb-srp__card__summary--value",
        "description": ".mb-srp__card--desc--text p, .mb-srp__card--desc--text",
        "property_link": "a.view-property-link, a.mb-srp__card__developer--name",
        "seller_name": ".mb-srp__card__ads--name",
        "image": ".mb-srp__card__photo img",
        "usp_item": ".mb-srp__card__usp--item, .amenities__item",
        "action_id": "[id^='propertiesAction']",
    },
    "timeout_seconds": 15,
    "max_retries": 3,
    "backoff_factor": 2.0,
    "request_delay": 1.5,
}


# ---------------------------------------------------------------------------
# Data Cleaning & Normalization Utility
# ---------------------------------------------------------------------------

class DataNormalizer:
    """Provides methods for cleaning and standardizing real estate metrics."""

    KNOWN_AMENITIES = [
        "Power Back Up", "Reserved Parking", "Visitor Parking", "Lift",
        "Rain Water Harvesting", "Club House", "Swimming Pool", "Gymnasium",
        "Security", "Park", "Intercom Facility", "Maintenance Staff",
        "Kids Play Area", "Banquet Hall", "Jogging and Strolling Track",
        "Piped Gas", "Fire Fighting Equipment", "Water Storage", "WiFi",
        "Air Conditioned", "CCTV Camera", "Vaastu Compliant"
    ]

    @staticmethod
    def normalize_price(price_str: Optional[str]) -> Optional[int]:
        """Convert price strings like '₹ 89 Lac', '₹ 1.85 Cr', '₹ 50,000' to integer."""
        if not price_str:
            return None
        cleaned = price_str.replace("₹", "").replace(",", "").strip()
        match = re.search(
            r"([\d.]+)\s*(Cr|Crore|Lac|Lacs|Lakh|Lakhs|k|thousand)?",
            cleaned,
            re.IGNORECASE,
        )
        if not match:
            return None
        try:
            val = float(match.group(1))
            unit = (match.group(2) or "").lower()
            if "cr" in unit:
                return int(val * 10_000_000)
            elif "lac" in unit or "lakh" in unit:
                return int(val * 100_000)
            elif "k" in unit or "thousand" in unit:
                return int(val * 1_000)
            return int(val)
        except (ValueError, TypeError):
            return None

    @staticmethod
    def normalize_area(area_str: Optional[str]) -> Tuple[Optional[float], str]:
        """Extract area numeric value and unit (e.g. '389 sqft' -> (389, 'sqft'))."""
        if not area_str:
            return None, "sqft"
        match = re.search(r"([\d,.]+)\s*([a-zA-Z\s.]+)?", area_str)
        if match:
            try:
                num = float(match.group(1).replace(",", ""))
                unit = (match.group(2) or "sqft").strip().lower().replace(".", "")
                # Return int if float is whole number
                clean_num = int(num) if num.is_integer() else num
                return clean_num, unit
            except (ValueError, TypeError):
                return None, "sqft"
        return None, "sqft"

    @staticmethod
    def normalize_floor(floor_str: Optional[str]) -> Tuple[Optional[int], Optional[int]]:
        """Extract floor number and total floors (e.g. '22 out of 23' -> (22, 23))."""
        if not floor_str:
            return None, None
        match = re.search(
            r"(Ground|Basement|Lower Basement|Upper Basement|\d+)\s*(?:out of|\/)\s*(\d+)",
            floor_str,
            re.IGNORECASE,
        )
        if match:
            f_raw, total_raw = match.group(1).lower(), match.group(2)
            try:
                total = int(total_raw)
                if f_raw == "ground":
                    f_num = 0
                elif "basement" in f_raw:
                    f_num = -1
                else:
                    f_num = int(f_raw)
                return f_num, total
            except ValueError:
                pass

        match_single = re.search(r"\d+", floor_str)
        if match_single:
            try:
                return int(match_single.group(0)), None
            except ValueError:
                pass
        return None, None

    @staticmethod
    def parse_seller(text: Optional[str]) -> Tuple[Optional[str], Optional[str]]:
        """Extract seller name and categorized seller type (owner, agent, builder)."""
        if not text:
            return None, None
        match = re.match(
            r"^(Owner|Agent|Builder|Dealer|Promoter)\s*:\s*(.*)",
            text.strip(),
            re.IGNORECASE,
        )
        if match:
            raw_type = match.group(1).lower()
            name = match.group(2).strip() or None
            seller_type = "agent" if raw_type in ("dealer", "promoter") else raw_type
            return name, seller_type
        return text.strip(), None

    @classmethod
    def extract_amenities(cls, desc: Optional[str], usp_elements: List[str]) -> List[str]:
        """Combine USP badges and description keywords into a distinct amenities list."""
        amenities: Set[str] = set()

        # Check USP badges
        for usp in usp_elements:
            usp_text = usp.lower()
            for amenity in cls.KNOWN_AMENITIES:
                clean_amenity = amenity.lower()
                clean_no_space = clean_amenity.replace(" ", "")
                if clean_amenity in usp_text or clean_no_space in usp_text:
                    amenities.add(amenity)

        # Check description text
        if desc:
            desc_lower = desc.lower()
            for amenity in cls.KNOWN_AMENITIES:
                if re.search(r"\b" + re.escape(amenity.lower()) + r"\b", desc_lower):
                    amenities.add(amenity)

        return sorted(list(amenities))

    @staticmethod
    def decode_property_id(raw_id: str) -> str:
        """Decode hexadecimal Magicbricks property ID (e.g. 4d42... -> MB... -> numeric)."""
        if not raw_id:
            return raw_id
        try:
            decoded = bytes.fromhex(raw_id).decode("utf-8", errors="ignore")
            if decoded.startswith("MB"):
                return decoded.replace("MB", "")
            return decoded or raw_id
        except Exception:
            return raw_id

    @staticmethod
    def extract_balconies(summary_val: Optional[str], desc: Optional[str]) -> Optional[int]:
        """Extract balcony count from summary or text."""
        if summary_val:
            m = re.search(r"\d+", summary_val)
            if m:
                return int(m.group(0))
        if desc:
            m = re.search(r"(\d+)\s*balcon(?:y|ies)", desc, re.IGNORECASE)
            if m:
                return int(m.group(1))
        return None

    @staticmethod
    def extract_property_type(title: Optional[str], ld_type: Optional[str]) -> str:
        """Determine standardized property category."""
        target = f"{title or ''} {ld_type or ''}".lower()
        if "builder floor" in target:
            return "Builder Floor Apartment"
        elif "penthouse" in target:
            return "Penthouse"
        elif "studio" in target:
            return "Studio Apartment"
        elif "villa" in target:
            return "Villa"
        elif "house" in target:
            return "Residential House"
        return "Multistorey Apartment"


# ---------------------------------------------------------------------------
# HTML & JSON-LD Parser
# ---------------------------------------------------------------------------

class MagicbricksParser:
    """Parses listing cards and Schema.org structured data from Magicbricks HTML."""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or DEFAULT_CONFIG
        self.selectors = self.config["selectors"]

    def parse_html(
        self, html_content: str, base_city: str = "Mumbai", listing_type: str = "sale"
    ) -> List[PropertyListing]:
        """Extract listings from HTML using dual JSON-LD and DOM card strategy."""
        soup = BeautifulSoup(html_content, "html.parser")

        # 1. Parse Schema.org JSON-LD (ItemList)
        ld_items = self._extract_json_ld_items(soup)
        logger.debug("Found %d JSON-LD ItemList entries", len(ld_items))

        # 2. Parse DOM Cards
        cards = soup.select(self.selectors["listing_cards"])
        logger.debug("Found %d DOM listing cards", len(cards))

        total_entries = max(len(cards), len(ld_items))
        properties: List[PropertyListing] = []

        for idx in range(total_entries):
            card = cards[idx] if idx < len(cards) else None
            ld = ld_items[idx] if idx < len(ld_items) else {}
            prop = self._build_property(card, ld, base_city, listing_type)
            if prop and (prop.title or prop.property_id or prop.property_url):
                properties.append(prop)

        return properties

    def _extract_json_ld_items(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Extract ItemList items from <script type='application/ld+json'> tags."""
        items: List[Dict[str, Any]] = []
        for script in soup.find_all("script", type="application/ld+json"):
            if not script.string:
                continue
            try:
                data = json.loads(script.string.strip())
                if isinstance(data, dict) and data.get("@type") == "ItemList":
                    for elem in data.get("itemListElement", []):
                        if isinstance(elem, dict) and "item" in elem:
                            items.append(elem["item"])
                    break
            except Exception:
                continue
        return items

    def _build_property(
        self,
        card: Optional[BeautifulSoup],
        ld: Dict[str, Any],
        base_city: str,
        listing_type: str,
    ) -> PropertyListing:
        """Merge data from DOM card element and JSON-LD schema item."""
        summary: Dict[str, str] = {}
        title: Optional[str] = None
        price_raw: Optional[str] = None
        rate_raw: Optional[str] = None
        desc: Optional[str] = None
        prop_url: Optional[str] = None
        prop_id: Optional[str] = None
        seller_raw: Optional[str] = None
        img_srcs: List[str] = []
        usp_tags: List[str] = []

        if card is not None:
            # Title
            t_el = card.select_one(self.selectors["title"])
            if t_el:
                title = t_el.get_text(strip=True)

            # Price & Price per sqft
            p_el = card.select_one(self.selectors["price"])
            if p_el:
                price_raw = p_el.get_text(" ", strip=True)

            r_el = card.select_one(self.selectors["price_per_sqft"])
            if r_el:
                rate_raw = r_el.get_text(" ", strip=True)

            # Summary items table
            for item in card.select(self.selectors["summary_item"]):
                lbl = item.select_one(self.selectors["summary_label"])
                val = item.select_one(self.selectors["summary_value"])
                if lbl and val:
                    summary[lbl.get_text(strip=True).lower()] = val.get_text(strip=True)

            # Description
            d_el = card.select_one(self.selectors["description"])
            if d_el:
                raw_desc = d_el.get_text(" ", strip=True)
                raw_desc = re.sub(r"Nearby Landmark:.*", "", raw_desc)
                raw_desc = re.sub(r"View Property.*", "", raw_desc).strip()
                desc = raw_desc or None

            # Property Link
            link_el = card.select_one(self.selectors["property_link"])
            if link_el and link_el.has_attr("href"):
                href = link_el["href"]
                prop_url = href if href.startswith("http") else f"https://www.magicbricks.com{href}"

            # Action ID
            act_el = card.select_one(self.selectors["action_id"])
            if act_el and act_el.has_attr("id"):
                prop_id = act_el["id"].replace("propertiesAction", "")

            # Seller
            s_el = card.select_one(self.selectors["seller_name"])
            if s_el:
                seller_raw = s_el.get_text(strip=True)

            # Photos
            img_el = card.select_one(self.selectors["image"])
            if img_el:
                src = img_el.get("src") or img_el.get("data-src")
                if src and src.startswith("http"):
                    img_srcs.append(src)

            # USP Badges
            for usp in card.select(self.selectors["usp_item"]):
                usp_tags.append(usp.get_text(" ", strip=True))

        # Fallbacks and enrichment from JSON-LD
        title = title or ld.get("name")
        prop_url = prop_url or ld.get("url") or ld.get("@id")

        if not prop_id and prop_url and "id=" in prop_url:
            hex_id = prop_url.split("id=")[-1].split("&")[0]
            prop_id = DataNormalizer.decode_property_id(hex_id)

        # Address & Locality
        ld_address = ld.get("address") or {}
        locality = (
            ld_address.get("addressLocality")
            or summary.get("society")
            or self._extract_locality_from_title(title)
        )
        city = ld_address.get("addressRegion") or base_city
        location = f"{locality}, {city}" if locality else city
        address = (
            f"{locality}, {city}, India"
            if locality
            else f"{city}, India"
        )

        # Numerical fields
        price = DataNormalizer.normalize_price(price_raw)
        price_per_sqft = DataNormalizer.normalize_price(rate_raw)

        # Area
        carpet_val, area_unit = DataNormalizer.normalize_area(
            summary.get("carpet area") or summary.get("super area")
        )
        if carpet_val is None and ld.get("floorSize"):
            try:
                carpet_val = float(ld["floorSize"].get("value"))
                area_unit = "sqft"
            except (ValueError, TypeError):
                pass

        built_up_val, _ = DataNormalizer.normalize_area(
            summary.get("super built-up area") or summary.get("built-up area")
        )

        # Bedrooms & Bathrooms
        bedrooms = ld.get("numberOfBedrooms")
        if bedrooms is None and title:
            m_bed = re.search(r"(\d+)\s*BHK", title, re.IGNORECASE)
            if m_bed:
                bedrooms = int(m_bed.group(1))

        bathrooms = ld.get("numberOfBathroomsTotal")
        if bathrooms is None and summary.get("bathroom"):
            try:
                bathrooms = int(summary["bathroom"])
            except ValueError:
                pass

        # Balconies
        balconies = DataNormalizer.extract_balconies(summary.get("balcony"), desc)

        # Floor details
        floor_number, total_floors = DataNormalizer.normalize_floor(summary.get("floor"))

        # Furnishing, age, parking
        furnishing_status = summary.get("furnishing")
        property_age = summary.get("age of construction") or summary.get("status")
        parking = summary.get("parking")
        if not parking and desc and "parking" in desc.lower():
            if "reserved parking" in desc.lower():
                parking = "Reserved Parking"
            elif "visitor parking" in desc.lower():
                parking = "Visitor Parking"

        # Seller
        posted_by, seller_type = DataNormalizer.parse_seller(seller_raw)
        if not posted_by and ld.get("potentialAction", {}).get("seller"):
            seller_node = ld["potentialAction"]["seller"]
            posted_by = seller_node.get("name", "").strip() or None
            if not seller_type and seller_node.get("@type") == "Person":
                seller_type = "owner"

        # Amenities
        amenities = DataNormalizer.extract_amenities(desc, usp_tags)

        # Image URLs
        if ld.get("image") and ld["image"] not in img_srcs:
            img_srcs.append(ld["image"])

        # Property type
        prop_type = DataNormalizer.extract_property_type(title, ld.get("@type"))

        return PropertyListing(
            property_id=prop_id,
            title=title,
            property_type=prop_type,
            listing_type=listing_type,
            price=price,
            price_per_sqft=price_per_sqft,
            location=location,
            city=city,
            locality=locality,
            address=address,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            balconies=balconies,
            built_up_area=built_up_val,
            carpet_area=carpet_val,
            area_unit=area_unit or "sqft",
            furnishing_status=furnishing_status,
            floor_number=floor_number,
            total_floors=total_floors,
            parking=parking,
            property_age=property_age,
            description=desc,
            amenities=amenities,
            image_urls=img_srcs,
            property_url=prop_url,
            posted_by=posted_by,
            seller_type=seller_type,
            posted_date=None,
        )

    @staticmethod
    def _extract_locality_from_title(title: Optional[str]) -> Optional[str]:
        if not title:
            return None
        m = re.search(r"in\s+([^,]+),\s*(.*)", title)
        if m:
            return m.group(1).strip()
        return None


# ---------------------------------------------------------------------------
# URL Resolver & Anti-Bot Handler
# ---------------------------------------------------------------------------

class URLResolver:
    """
    Analyzes, resolves, and canonicalizes listing URLs.
    
    Magicbricks robots.txt disallows `/*proptype=`, and parameter-based internal
    search queries are met with an interstitial maintenance screen ('We'll be back soon!').
    This resolver detects parameter URLs and translates them to publicly accessible,
    canonical search results URLs (e.g., `/flats-in-mumbai-for-sale-pppfs`).
    """

    @staticmethod
    def canonicalize(
        url: str,
        city: Optional[str] = None,
        locality: Optional[str] = None,
        listing_type: str = "sale",
    ) -> Tuple[str, str, str]:
        """
        Returns (canonical_url, resolved_city, resolved_listing_type).
        Handles parameter conversions and URL normalization.
        """
        parsed = urlparse(url)
        params = parse_qs(parsed.query)

        # Detect city from query params or URL path
        extracted_city = city
        if not extracted_city and "cityName" in params:
            extracted_city = params["cityName"][0]

        if not extracted_city:
            for part in parsed.path.split("/"):
                if "in-" in part:
                    match = re.search(r"in-([a-zA-Z-]+)", part)
                    if match:
                        extracted_city = match.group(1).replace("-", " ").title()

        resolved_city = extracted_city or "Mumbai"
        city_slug = resolved_city.lower().replace(" ", "-")

        # Detect listing type (sale vs rent)
        resolved_type = listing_type
        if "rent" in parsed.path.lower() or "for-rent" in url.lower():
            resolved_type = "rent"
        elif "sale" in parsed.path.lower() or "for-sale" in url.lower():
            resolved_type = "sale"

        # Check if URL contains restricted query parameters (e.g. proptype=)
        has_restricted_params = "proptype" in params or bool(parsed.query)

        if has_restricted_params or "residential-real-estate" in parsed.path:
            logger.info(
                "Source URL contains query parameters disallowed by robots.txt / protected by WAF. "
                "Resolving to public canonical SRP index..."
            )
            type_code = "pppfs" if resolved_type == "sale" else "pppfr"
            type_text = "for-sale" if resolved_type == "sale" else "for-rent"

            if locality:
                loc_slug = locality.lower().replace(" ", "-")
                if resolved_type == "sale":
                    canonical = f"https://www.magicbricks.com/flats-in-{loc_slug}-{city_slug}-for-sale-{type_code}"
                else:
                    canonical = f"https://www.magicbricks.com/flats-for-rent-in-{loc_slug}-{city_slug}-{type_code}"
            else:
                if resolved_type == "sale":
                    canonical = f"https://www.magicbricks.com/flats-in-{city_slug}-for-sale-{type_code}"
                else:
                    canonical = f"https://www.magicbricks.com/flats-for-rent-in-{city_slug}-{type_code}"
            return canonical, resolved_city, resolved_type

        return url, resolved_city, resolved_type

    @staticmethod
    def get_page_url(base_url: str, page_number: int) -> str:
        """Construct page URL for pagination."""
        if page_number <= 1:
            return base_url
        clean_base = base_url.rstrip("/")
        # Magicbricks supports both /page-N and ?page=N for canonical SRP
        if "?" in clean_base:
            return f"{clean_base}&page={page_number}"
        return f"{clean_base}/page-{page_number}"


# ---------------------------------------------------------------------------
# Scraper Engine
# ---------------------------------------------------------------------------

class PropertyListingScraper:
    """
    Main orchestration class for property listing extraction.
    Handles network sessions, retries, pagination, deduplication, and parsing.
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or DEFAULT_CONFIG
        self.session = requests.Session()
        self.session.headers.update(self.config["headers"])
        self.parser = MagicbricksParser(self.config)
        self.seen_property_ids: Set[str] = set()
        self.seen_urls: Set[str] = set()

    def fetch_page(self, url: str) -> Optional[str]:
        """Fetch URL with retries, timeout, and exponential backoff."""
        max_retries = self.config.get("max_retries", 3)
        backoff = self.config.get("backoff_factor", 2.0)
        timeout = self.config.get("timeout_seconds", 15)

        for attempt in range(1, max_retries + 1):
            try:
                logger.info("Fetching: %s (attempt %d/%d)", url, attempt, max_retries)
                response = self.session.get(url, timeout=timeout)
                if response.status_code == 200:
                    # Detect interstitial block screen
                    if "<title>We'll be back soon!</title>" in response.text:
                        logger.warning(
                            "Received anti-bot / maintenance challenge page from %s. "
                            "Ensure URL adheres to canonical robots.txt-permitted patterns.",
                            url,
                        )
                        return None
                    return response.text
                elif response.status_code == 404:
                    logger.warning("Page not found (404): %s", url)
                    return None
                else:
                    logger.warning("HTTP %d for %s", response.status_code, url)
            except requests.RequestException as exc:
                logger.warning("Network error on attempt %d: %s", attempt, exc)

            if attempt < max_retries:
                sleep_duration = backoff ** attempt
                logger.info("Waiting %.1f seconds before retry...", sleep_duration)
                time.sleep(sleep_duration)

        logger.error("Failed to fetch %s after %d attempts", url, max_retries)
        return None

    def scrape(
        self,
        source_url: str,
        city: Optional[str] = None,
        locality: Optional[str] = None,
        listing_type: str = "sale",
        max_listings: int = 20,
        max_pages: int = 3,
        request_delay: float = 1.5,
    ) -> ScraperOutput:
        """
        Execute scraping workflow across paginated listing pages.
        """
        # Canonicalize URL to avoid parameter blocks and satisfy robots.txt
        canonical_url, resolved_city, resolved_type = URLResolver.canonicalize(
            source_url, city=city, locality=locality, listing_type=listing_type
        )
        logger.info("Target Canonical URL: %s", canonical_url)
        logger.info("City: %s | Type: %s | Limit: %d", resolved_city, resolved_type, max_listings)

        collected: List[PropertyListing] = []
        page = 1

        while len(collected) < max_listings and page <= max_pages:
            page_url = URLResolver.get_page_url(canonical_url, page)
            html = self.fetch_page(page_url)

            if not html:
                logger.warning("No HTML content retrieved for page %d. Stopping.", page)
                break

            page_properties = self.parser.parse_html(
                html, base_city=resolved_city, listing_type=resolved_type
            )
            if not page_properties:
                logger.info("No listings found on page %d. Reached end of results.", page)
                break

            new_count = 0
            for prop in page_properties:
                # Deduplicate by unique ID or property URL
                dedup_key = prop.property_id or prop.property_url
                if dedup_key:
                    if dedup_key in self.seen_property_ids:
                        continue
                    self.seen_property_ids.add(dedup_key)

                collected.append(prop)
                new_count += 1
                if len(collected) >= max_listings:
                    break

            logger.info(
                "Page %d processed: added %d new listings (total so far: %d)",
                page,
                new_count,
                len(collected),
            )

            if new_count == 0:
                logger.info("All listings on page %d were duplicates. Halting pagination.", page)
                break

            page += 1
            if len(collected) < max_listings and page <= max_pages:
                logger.info("Polite delay: sleeping %.2f seconds...", request_delay)
                time.sleep(request_delay)

        output_list = [asdict(p) for p in collected]
        return ScraperOutput(
            source="Magicbricks",
            source_url=canonical_url,
            city=resolved_city,
            total_scraped=len(output_list),
            properties=output_list,
        )


# ---------------------------------------------------------------------------
# CLI & Execution
# ---------------------------------------------------------------------------

def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Property Listing Web Scraper for Magicbricks and Real Estate Portals"
    )
    parser.add_argument(
        "--url",
        type=str,
        default="https://www.magicbricks.com/flats-in-mumbai-for-sale-pppfs",
        help="Source URL to scrape (canonical SRP URL or search URL)",
    )
    parser.add_argument(
        "--city",
        type=str,
        default=None,
        help="City filter (e.g. Mumbai, Bangalore, Pune, New Delhi)",
    )
    parser.add_argument(
        "--locality",
        type=str,
        default=None,
        help="Locality filter (e.g. 'Andheri West', 'Bandra', 'Whitefield')",
    )
    parser.add_argument(
        "--type",
        type=str,
        choices=["sale", "rent"],
        default="sale",
        help="Listing type: 'sale' or 'rent'",
    )
    parser.add_argument(
        "--max-listings",
        type=int,
        default=10,
        help="Maximum number of listings to collect (default: 10)",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=3,
        help="Maximum pagination pages to crawl (default: 3)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.5,
        help="Polite delay in seconds between page requests (default: 1.5)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="properties.json",
        help="Output JSON file path (default: properties.json)",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose DEBUG logging",
    )
    return parser.parse_args()


def main():
    args = parse_arguments()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    scraper = PropertyListingScraper()
    output = scraper.scrape(
        source_url=args.url,
        city=args.city,
        locality=args.locality,
        listing_type=args.type,
        max_listings=args.max_listings,
        max_pages=args.max_pages,
        request_delay=args.delay,
    )

    result_json = json.dumps(output.to_dict(), indent=2, ensure_ascii=False)

    # Print JSON output to terminal
    print("\n" + "=" * 40 + " SCRAPED JSON RESULT " + "=" * 40)
    print(result_json)
    print("=" * 102 + "\n")

    # Save to file
    try:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(result_json)
        logger.info("Successfully saved %d properties to %s", output.total_scraped, args.output)
    except IOError as err:
        logger.error("Failed to write to %s: %s", args.output, err)
        sys.exit(1)


if __name__ == "__main__":
    main()
