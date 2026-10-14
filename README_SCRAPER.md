# Property Listing Web Scraper

A robust, production-grade Python web scraper designed to extract property listing data from real estate portals like Magicbricks and produce structured, validated JSON for downstream web backends (such as Next.js, Django, FastAPI, Express).

---

## Table of Contents
1. [Architecture & Strategy](#architecture--strategy)
2. [Target URL Analysis & robots.txt / Anti-Bot Compliance](#target-url-analysis--robotstxt--anti-bot-compliance)
3. [Installation & Requirements](#installation--requirements)
4. [Usage & CLI Options](#usage--cli-options)
5. [JSON Schema & Sample Output](#json-schema--sample-output)
6. [Data Normalization & Cleaning](#data-normalization--cleaning)
7. [Adapting to Source Website Layout Changes](#adapting-to-source-website-layout-changes)
8. [Authorized APIs & Alternative Data Sources](#authorized-apis--alternative-data-sources)

---

## Architecture & Strategy

Real estate listing websites typically utilize a combination of server-side rendered HTML, search indexing microdata, dynamic client-side hydration, and bot-mitigation firewalls (WAFs).

The scraper implements a **Hybrid Dual-Source Extraction Pipeline**:
```
                           [Source URL]
                                 │
                   [URL Resolver & Canonicalizer]
                 (Detects disallowed query params;
                  maps to robots.txt-safe SRP)
                                 │
                   [Polite HTTP Request Session]
                 (Realistic headers, retry/backoff)
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
            [Schema.org JSON-LD]    [DOM Listing Cards]
             (<script ld+json>)      (.mb-srp__card)
             - Bed / Bath counts     - Display & numeric prices
             - Geo coordinates       - Floor & total floors
             - RERA numbers          - Parking & furnishing
             - Canonical URLs        - Descriptions & photos
                     └───────────┬───────────┘
                                 │
                       [Data Normalizer]
                     - Indian price scale (Cr, Lac, K)
                     - Floor number translation
                     - Deduplication by Property ID
                                 │
                        [Structured JSON]
                   (Printed to stdout & saved)
```

---

## Target URL Analysis & robots.txt / Anti-Bot Compliance

### 1. The Example URL Limitation
When requesting the raw parameterized query URL:
```
https://www.magicbricks.com/property-for-sale/residential-real-estate?proptype=Multistorey-Apartment...&cityName=Mumbai
```
Magicbricks inspects incoming requests and returns an HTTP 200 interstitial maintenance response:
```html
<title>We'll be back soon!</title>
<div>Sorry, we're down for maintenance.</div>
```
Furthermore, the official `robots.txt` (`https://www.magicbricks.com/robots.txt`) contains:
```
User-agent: *
Disallow: /*proptype=
```
This demonstrates that Magicbricks explicitly disallows standard crawlers from accessing URLs containing `proptype=` query strings, and shields them with anti-bot WAF challenges.

### 2. The Permitted Canonical SRP Solution
Magicbricks exposes public canonical Search Result Pages (SRP) for indexing:
- Sale in Mumbai: `https://www.magicbricks.com/flats-in-mumbai-for-sale-pppfs`
- Rent in Mumbai: `https://www.magicbricks.com/flats-for-rent-in-mumbai-pppfr`
- Locality-specific: `https://www.magicbricks.com/flats-in-andheri-west-mumbai-for-sale-pppfs`

The built-in `URLResolver` detects parameterized search URLs, checks compliance, and automatically resolves them to their corresponding public canonical URLs.

---

## Installation & Requirements

Ensure **Python 3.8+** is installed on your system.

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   Or install directly:
   ```bash
   pip install requests beautifulsoup4
   ```

2. *(Optional)* If you wish to use headless browser execution:
   ```bash
   pip install playwright
   playwright install chromium
   ```

---

## Usage & CLI Options

### Basic Run (Scrapes Mumbai properties and outputs to `properties.json`):
```bash
python scraper.py
```

### Scrape Specific Count:
```bash
python scraper.py --max-listings 20 --output properties.json
```

### Scrape a Specific Locality or City:
```bash
# Locality search in Mumbai
python scraper.py --city Mumbai --locality "Andheri West" --max-listings 15

# Rental listings in Bangalore
python scraper.py --city Bangalore --type rent --max-listings 10
```

### Custom URL Input:
```bash
python scraper.py --url "https://www.magicbricks.com/flats-in-pune-for-sale-pppfs" --max-listings 10
```

### Full CLI Flags:
| Argument | Type | Default | Description |
|---|---|---|---|
| `--url` | str | Mumbai SRP | Target URL to scrape |
| `--city` | str | `None` (auto) | City filter (e.g., Mumbai, Bangalore, Pune) |
| `--locality` | str | `None` | Locality filter (e.g., 'Andheri West') |
| `--type` | str | `sale` | Listing type: `sale` or `rent` |
| `--max-listings` | int | `10` | Maximum number of listings to collect |
| `--max-pages` | int | `3` | Maximum pagination pages to crawl |
| `--delay` | float | `1.5` | Delay in seconds between requests (polite rate limit) |
| `--output` | str | `properties.json` | Path to output JSON file |
| `--verbose` | flag | `False` | Enable DEBUG level logging |

---

## JSON Schema & Sample Output

The output adheres strictly to the required schema:

```json
{
  "source": "Magicbricks",
  "source_url": "https://www.magicbricks.com/flats-in-mumbai-for-sale-pppfs",
  "city": "Mumbai",
  "total_scraped": 2,
  "properties": [
    {
      "property_id": "86917029",
      "title": "1 BHK Flat  for Sale in  Mulund West, Mumbai",
      "property_type": "Multistorey Apartment",
      "listing_type": "sale",
      "price": 8900000,
      "price_per_sqft": 21655,
      "location": "Mulund West, Mumbai",
      "city": "Mumbai",
      "locality": "Mulund West",
      "address": "Mulund West, Mumbai, India",
      "bedrooms": 1,
      "bathrooms": 2,
      "balconies": null,
      "built_up_area": null,
      "carpet_area": 389,
      "area_unit": "sqft",
      "furnishing_status": "Semi-Furnished",
      "floor_number": 22,
      "total_floors": 23,
      "parking": "Reserved Parking",
      "property_age": "Ready to Move",
      "description": "Situated in the prime location of Mulund West, the 1 BHK flat is currently available on sale...",
      "amenities": [
        "Kids Play Area",
        "Lift",
        "Park",
        "Power Back Up",
        "Rain Water Harvesting",
        "Reserved Parking",
        "Security",
        "Visitor Parking"
      ],
      "image_urls": [
        "https://img.staticmb.com/mbphoto/property/cropped_images/ver2/XIwvQlc61t8ZIpanz4mAnTVP9dY9dc5n3RNLlfncNvnLXMlsy_DJ/Photo_h300_w450/6160_1791919649124.2088_300_450.jpg"
      ],
      "property_url": "https://www.magicbricks.com/om-ashoka-heights-mulund-west-mumbai-pdpid-4d4235303932323335",
      "posted_by": "Ani",
      "seller_type": "owner",
      "posted_date": null
    }
  ]
}
```

---

## Data Normalization & Cleaning

1. **Prices**:
   - `₹ 89 Lac` → `8900000`
   - `₹ 1.85 Cr` → `18500000`
   - `₹ 45,000` → `45000`
2. **Floor Representation**:
   - `"22 out of 23"` → `floor_number: 22`, `total_floors: 23`
   - `"Ground out of 4"` → `floor_number: 0`, `total_floors: 4`
3. **Seller Types**:
   - Standardized to `"owner"`, `"agent"`, or `"builder"`.
4. **Property Types**:
   - Categorized into `"Multistorey Apartment"`, `"Penthouse"`, `"Studio Apartment"`, `"Villa"`, `"Residential House"`, or `"Builder Floor Apartment"`.
5. **Deduplication**:
   - Tracks unique decoded property IDs and canonical URLs across all pagination steps.

---

## Adapting to Source Website Layout Changes

Website layouts evolve over time. All CSS and DOM selectors are centralized in the `DEFAULT_CONFIG` dictionary at the top of [scraper.py](file:///c:/Users/dheer/OneDrive/Desktop/suraj/the-propertist/scraper.py):

```python
DEFAULT_CONFIG = {
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
    }
}
```
If the portal updates its class names:
1. Inspect the new element classes in your browser Developer Tools (F12).
2. Update the corresponding key in `DEFAULT_CONFIG["selectors"]`.
3. Because the scraper extracts Schema.org JSON-LD in parallel, core fields (title, bedrooms, bathrooms, URLs, locality) continue to function even if CSS classes change.

---

## Authorized APIs & Alternative Data Sources

For enterprise property applications requiring ongoing feeds without the maintenance overhead of HTML scraping:
1. **Magicbricks Developer / Partner Portal**:
   - Official B2B syndication APIs provide authorized, authenticated JSON feeds for brokers, aggregators, and financial institutions.
2. **PropTiger / Housing.com Partner APIs**:
   - Offer structured programmatic feeds with real-time inventory updates and pricing tiers.
3. **MLS & RESO Web API Standards**:
   - For multi-portal synchronization, utilizing RESO-compliant real estate feeds provides standardized JSON payloads across regional property databases.
