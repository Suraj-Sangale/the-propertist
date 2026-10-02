"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/utilities/wishlist";
import {
  Building2,
  Home,
  KeyRound,
  Sparkles,
  MapPin,
  ChevronDown,
  X,
  Plus,
  Compass,
  ArrowRight,
  CheckCircle2,
  Layers,
  Menu,
  Heart,
} from "lucide-react";

interface SubItem {
  title: string;
  desc: string;
  href: string;
  icon: any;
  badge?: string;
}

interface NavCategory {
  label: string;
  href: string;
  badge?: string;
  badgeType?: "new" | "hot" | "pro";
  icon: any;
  subItems: SubItem[];
}

// ─── Minimalist Options Matching ListingsPage Filter Logic ───────────────────
const NAV_LINKS: NavCategory[] = [
  {
    label: "Buy",
    href: "/listings?mode=buy",
    icon: Building2,
    subItems: [
      {
        title: "All Buy Properties",
        desc: "Explore all verified luxury residences for sale",
        href: "/listings?mode=buy",
        icon: Building2,
      },
      {
        title: "Ready to Move In",
        desc: "Completed towers with OC received",
        href: "/listings?mode=buy&status=ready_to_move",
        icon: CheckCircle2,
      },
      {
        title: "New Launches",
        desc: "Exclusive pre-launch pricing & early bird offers",
        href: "/listings?mode=buy&status=new_launch",
        icon: Sparkles,
        badge: "New",
      },
      {
        title: "Under Construction",
        desc: "Upcoming high-rise developments by top builders",
        href: "/listings?mode=buy&status=under_construction",
        icon: Layers,
      },
      {
        title: "2 & 3 BHK Homes",
        desc: "Spacious configurations for modern families",
        href: "/listings?mode=buy&config=2_bhk,3_bhk",
        icon: Home,
      },
      {
        title: "4 & 5 BHK Luxury",
        desc: "High-end penthouses & expansive sky villas",
        href: "/listings?mode=buy&config=4_bhk,5_bhk",
        icon: Sparkles,
        badge: "Luxury",
      },
    ],
  },
  {
    label: "Rent",
    href: "/listings?mode=rent",
    icon: KeyRound,
    subItems: [
      {
        title: "All Rental Homes",
        desc: "Premium verified residences available for rent",
        href: "/listings?mode=rent",
        icon: KeyRound,
      },
      {
        title: "1 & 2 BHK Flats",
        desc: "Prime compact living for professionals & couples",
        href: "/listings?mode=rent&config=1_bhk,2_bhk",
        icon: Building2,
      },
      {
        title: "3+ BHK Family Residences",
        desc: "Gated society apartments with modern amenities",
        href: "/listings?mode=rent&config=3_bhk,4_bhk",
        icon: Home,
      },
      {
        title: "Ready to Move Rentals",
        desc: "Immediate move-in homes with zero waiting",
        href: "/listings?mode=rent&status=ready_to_move",
        icon: CheckCircle2,
      },
    ],
  },
  {
    label: "Developers",
    href: "/listings?mode=buy",
    badge: "Top",
    badgeType: "hot",
    icon: Compass,
    subItems: [
      {
        title: "Godrej Properties",
        desc: "Sustainable luxury & award-winning high rises",
        href: "/listings?developer=godrej",
        icon: Building2,
      },
      {
        title: "Lodha Group",
        desc: "Iconic branded residences & grand developments",
        href: "/listings?developer=lodha",
        icon: Sparkles,
        badge: "Hot",
      },
      {
        title: "Oberoi Realty",
        desc: "Contemporary architectural masterpieces",
        href: "/listings?developer=oberoi",
        icon: Building2,
      },
      {
        title: "Kalpataru",
        desc: "Decades of trusted engineering & prime communities",
        href: "/listings?developer=kalpataru",
        icon: Home,
      },
      {
        title: "Rustomjee",
        desc: "Gated spaces designed for elevated lifestyles",
        href: "/listings?developer=rustomjee",
        icon: Layers,
      },
    ],
  },
  {
    label: "Localities",
    href: "/listings",
    icon: MapPin,
    subItems: [
      {
        title: "Bandra West",
        desc: "Premier coastal enclave & celebrity lifestyle hub",
        href: "/listings?locality=bandra_west",
        icon: MapPin,
        badge: "Prime",
      },
      {
        title: "Andheri West",
        desc: "Major cultural, entertainment & business center",
        href: "/listings?locality=andheri_west",
        icon: MapPin,
      },
      {
        title: "Powai",
        desc: "Scenic lakeside living meets corporate tech hub",
        href: "/listings?locality=powai",
        icon: MapPin,
      },
      {
        title: "Jokhandwala",
        desc: "Prestigious residences with elite dining & shopping",
        href: "/listings?locality=jokhandwala",
        icon: MapPin,
      },
      {
        title: "Kandivali East",
        desc: "Peaceful gated residential communities",
        href: "/listings?locality=kandivali_east",
        icon: MapPin,
      },
      {
        title: "Goregaon West",
        desc: "Seamless connectivity & modern high-rise towers",
        href: "/listings?locality=goregaon_west",
        icon: MapPin,
      },
    ],
  },
];

// ─── Localities Matching ListingsPage LOCALITIES ──────────────────────────────
const LOCALITIES_LIST = [
  { name: "All Localities", key: "", count: "All Mumbai" },
  { name: "Bandra West", key: "bandra_west", count: "Prime" },
  { name: "Andheri West", key: "andheri_west", count: "Popular" },
  { name: "Powai", key: "powai", count: "Lakeside" },
  { name: "Jokhandwala", key: "jokhandwala", count: "Luxury" },
  { name: "Kandivali East", key: "kandivali_east", count: "Family" },
  { name: "Malad West", key: "malad_west", count: "Trending" },
  { name: "Borivali West", key: "borivali_west", count: "Suburbs" },
  { name: "Goregaon West", key: "goregaon_west", count: "Hub" },
];

export default function Header() {
  const router = useRouter();
  const { count: wishlistCount, isLoaded: isWishlistLoaded } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveAccordion, setMobileActiveAccordion] = useState<string | null>("Buy");
  const [selectedLocality, setSelectedLocality] = useState("Mumbai");
  const [localityDropdownOpen, setLocalityDropdownOpen] = useState(false);

  // Handle scroll detection for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open & handle Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setLocalityDropdownOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleSelectLocality = (item: { name: string; key: string }) => {
    setSelectedLocality(item.key ? item.name : "Mumbai");
    setLocalityDropdownOpen(false);
    if (item.key) {
      router.push(`/listings?locality=${item.key}`);
    } else {
      router.push("/listings");
    }
  };

  return (
    <>
      <style>{`
        /* ─── Header Root ───────────────────────────── */
        .hs-header-sticky {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: background-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, margin 0.3s ease, border-radius 0.3s ease;
          background: rgba(10, 14, 30, 0.50);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(200, 168, 75, 0.22);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
        }

        .hs-header-sticky.scrolled {
          background: rgb(22 24 33 / 62%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08);
          border-radius: 50px;
          margin: 20px 20px 0px 20px;
        }

        .hs-header-container {
          max-width: 1380px;
          margin: 0 auto;
          padding: 0 24px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        /* ─── Logo ───────────────────────────────────── */
        .hs-hdr-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          font-weight: 800;
          font-size: 21px;
          color: #ffffff;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .hs-hdr-logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #c8a84b 0%, #b8963c 50%, #8a6a24 100%);
          display: grid;
          place-items: center;
          color: #0a0e1e;
          box-shadow: 0 6px 18px rgba(200, 168, 75, 0.35);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }
        .hs-hdr-logo:hover .hs-hdr-logo-icon {
          transform: scale(1.08) rotate(-3deg);
          box-shadow: 0 8px 24px rgba(200, 168, 75, 0.5);
        }
        .hs-hdr-logo-text {
          display: flex;
          flex-direction: column;
        }
        .hs-hdr-logo-title {
          font-weight: 800;
          font-size: 20px;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #ffffff;
        }
        .hs-hdr-logo-sub {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c8a84b;
        }

        /* ─── Locality / City Selector ──────────────── */
        .hs-city-picker {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .hs-city-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(200, 168, 75, 0.3);
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(8px);
        }
        .hs-city-btn:hover {
          background: rgba(200, 168, 75, 0.15);
          border-color: #c8a84b;
          color: #ebd9a2;
          box-shadow: 0 4px 14px rgba(200, 168, 75, 0.2);
          transform: translateY(-1px);
        }
        .hs-city-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 230px;
          background: #0f1428;
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(200, 168, 75, 0.3);
          z-index: 1050;
          animation: hs-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hs-city-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          border-radius: 10px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 500;
          color: #cbd5e1;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .hs-city-item:hover, .hs-city-item.active {
          background: rgba(200, 168, 75, 0.15);
          color: #ebd9a2;
          font-weight: 600;
        }
        .hs-city-item-count {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }
        .hs-city-item.active .hs-city-item-count {
          color: #c8a84b;
          font-weight: 600;
        }

        /* ─── Desktop Nav Menu ───────────────────────── */
        .hs-hdr-nav {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hs-nav-item-wrap {
          position: relative;
        }
        .hs-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 15px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.88);
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs-nav-link:hover, .hs-nav-item-wrap:hover .hs-nav-link {
          color: #c8a84b;
          background: rgba(200, 168, 75, 0.12);
        }
        .hs-nav-badge {
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 7px;
          border-radius: 999px;
        }
        .hs-nav-badge.hot {
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: #ffffff;
        }
        .hs-nav-badge.new {
          background: #c8a84b;
          color: #0a0e1e;
          font-weight: 800;
        }
        .hs-nav-badge.pro {
          background: rgba(200, 168, 75, 0.2);
          color: #ebd9a2;
          border: 1px solid rgba(200, 168, 75, 0.35);
        }

        /* Desktop Mega Dropdown */
        .hs-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          width: 360px;
          background: #0f1428;
          border-radius: 20px;
          padding: 12px;
          border: 1px solid rgba(200, 168, 75, 0.28);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
          opacity: 0;
          visibility: hidden;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: top center;
          z-index: 1020;
        }
        .hs-nav-item-wrap:hover .hs-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(4px);
        }
        .hs-dropdown-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.16s ease;
        }
        .hs-dropdown-item:hover {
          background: rgba(200, 168, 75, 0.1);
          transform: translateX(3px);
        }
        .hs-dropdown-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(200, 168, 75, 0.14);
          border: 1px solid rgba(200, 168, 75, 0.25);
          color: #c8a84b;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .hs-dropdown-item:hover .hs-dropdown-icon-box {
          background: #c8a84b;
          color: #0a0e1e;
          transform: scale(1.05);
        }
        .hs-dropdown-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.15s ease;
        }
        .hs-dropdown-item:hover .hs-dropdown-title {
          color: #c8a84b;
        }
        .hs-dropdown-desc {
          font-size: 11.5px;
          color: #94a3b8;
          line-height: 1.35;
        }

        /* ─── Right Actions ──────────────────────────── */
        .hs-hdr-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .hs-btn-list-prop {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #c8a84b 0%, #b8963c 60%, #927228 100%);
          color: #0a0e1e;
          font-size: 13.5px;
          font-weight: 800;
          padding: 10px 20px;
          border-radius: 999px;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(200, 168, 75, 0.35);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }
        .hs-btn-list-prop:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(200, 168, 75, 0.55);
          background: linear-gradient(135deg, #d4b55b 0%, #c8a84b 60%, #a38234 100%);
        }
        .hs-btn-free-badge {
          background: #0a0e1e;
          color: #c8a84b;
          font-size: 9.5px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border: 1px solid rgba(200, 168, 75, 0.3);
        }

        /* ─── Wishlist Header Button ────────────────── */
        .hs-wishlist-btn {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #f43f5e;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(200, 168, 75, 0.3);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs-wishlist-btn:hover {
          background: rgba(244, 63, 94, 0.15);
          border-color: rgba(244, 63, 94, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(244, 63, 94, 0.25);
        }
        .hs-wishlist-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #f43f5e;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          min-width: 18px;
          height: 18px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 6px rgba(244, 63, 94, 0.6);
          line-height: 1;
        }

        /* ─── Mobile Menu Toggle Button (HIDDEN ON DESKTOP) ── */
        .hs-mobile-toggle {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(200, 168, 75, 0.3);
          display: none; /* HIDDEN ON DESKTOP */
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffffff;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs-mobile-toggle:hover {
          background: rgba(200, 168, 75, 0.15);
          border-color: #c8a84b;
          color: #c8a84b;
          box-shadow: 0 6px 16px rgba(200, 168, 75, 0.2);
          transform: scale(1.04);
        }

        /* ─── MINIMALIST SIDEBAR DRAWER ─────────────────────── */
        .hs-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 8, 18, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 2000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s ease;
        }
        .hs-drawer-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .hs-adv-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 400px;
          background: linear-gradient(180deg, #0a0e1e 0%, #10162f 100%);
          z-index: 2010;
          display: flex;
          flex-direction: column;
          box-shadow: -15px 0 50px rgba(0, 0, 0, 0.6);
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          border-left: 1px solid rgba(200, 168, 75, 0.25);
          overflow: hidden;
        }
        @media (min-width: 520px) {
          .hs-adv-drawer {
            border-top-left-radius: 24px;
            border-bottom-left-radius: 24px;
          }
        }
        .hs-adv-drawer.open {
          transform: translateX(0);
        }

        /* Drawer Header */
        .hs-d-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(200, 168, 75, 0.2);
          background: rgba(10, 14, 30, 0.96);
          backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .hs-d-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(200, 168, 75, 0.25);
          background: rgba(255, 255, 255, 0.08);
          display: grid;
          place-items: center;
          cursor: pointer;
          color: #cbd5e1;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs-d-close-btn:hover {
          background: #ef4444;
          border-color: #ef4444;
          color: #ffffff;
          transform: rotate(90deg);
        }

        /* Drawer Scroll Area */
        .hs-d-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 18px 18px 80px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: thin;
          scrollbar-color: rgba(200, 168, 75, 0.3) transparent;
        }
        .hs-d-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .hs-d-scroll::-webkit-scrollbar-thumb {
          background: rgba(200, 168, 75, 0.3);
          border-radius: 10px;
        }

        /* Quick Mode Switcher in Drawer */
        .hs-drawer-modes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .hs-drawer-mode-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(200, 168, 75, 0.25);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .hs-drawer-mode-btn:hover {
          background: rgba(200, 168, 75, 0.15);
          border-color: #c8a84b;
          color: #ebd9a2;
        }

        /* Saved shortcut in drawer */
        .hs-drawer-saved-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 14px;
          background: rgba(244, 63, 94, 0.08);
          border: 1px solid rgba(244, 63, 94, 0.25);
          text-decoration: none;
          color: #ffffff;
          transition: all 0.2s;
        }
        .hs-drawer-saved-card:hover {
          background: rgba(244, 63, 94, 0.14);
          border-color: rgba(244, 63, 94, 0.45);
        }

        /* Drawer Navigation Accordions */
        .hs-d-nav-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .hs-d-nav-card {
          border: 1px solid rgba(200, 168, 75, 0.18);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .hs-d-nav-card.active {
          border-color: #c8a84b;
          box-shadow: 0 4px 16px rgba(200, 168, 75, 0.12);
        }
        .hs-d-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 15px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }
        .hs-d-nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hs-d-nav-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(200, 168, 75, 0.12);
          border: 1px solid rgba(200, 168, 75, 0.2);
          color: #c8a84b;
          display: grid;
          place-items: center;
          transition: all 0.2s;
        }
        .hs-d-nav-card.active .hs-d-nav-icon-wrap {
          background: #c8a84b;
          color: #0a0e1e;
        }
        .hs-d-nav-title {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hs-d-chevron {
          color: #94a3b8;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hs-d-nav-card.active .hs-d-chevron {
          transform: rotate(180deg);
          color: #c8a84b;
        }

        .hs-d-sublist {
          padding: 6px 10px 12px;
          border-top: 1px solid rgba(200, 168, 75, 0.15);
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .hs-d-sublink {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.18s ease;
        }
        .hs-d-sublink:hover {
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transform: translateX(3px);
        }
        .hs-d-sublink-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hs-d-subicon {
          width: 26px;
          height: 26px;
          border-radius: 7px;
          background: rgba(200, 168, 75, 0.14);
          color: #c8a84b;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .hs-d-subtitle {
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hs-drawer-post-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: linear-gradient(135deg, #c8a84b 0%, #b8963c 60%, #927228 100%);
          color: #0a0e1e;
          font-size: 14px;
          font-weight: 800;
          padding: 12px 18px;
          border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(200, 168, 75, 0.35);
          transition: all 0.2s;
        }
        .hs-drawer-post-btn:hover {
          box-shadow: 0 6px 22px rgba(200, 168, 75, 0.55);
          background: linear-gradient(135deg, #d4b55b 0%, #c8a84b 60%, #a38234 100%);
        }

        /* Sticky Drawer Bottom Footer */
        .hs-d-fixed-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px 20px;
          background: rgba(10, 14, 30, 0.96);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(200, 168, 75, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
        }
        .hs-footer-terms {
          font-size: 11px;
          color: #94a3b8;
        }

        @keyframes hs-pop {
          0% { opacity: 0; transform: translateY(-8px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ─── Responsive Queries ────────────────────── */
        @media (max-width: 1080px) {
          .hs-hdr-nav {
            display: none;
          }
          .hs-city-picker {
            display: none;
          }
          .hs-mobile-toggle {
            display: flex; /* VISIBLE ONLY ON MOBILE / TABLET */
          }
        }

        @media (max-width: 520px) {
          .hs-header-container {
            height: 66px;
            padding: 0 16px;
          }
          .hs-hdr-logo-title {
            font-size: 18px;
          }
          .hs-hdr-logo-icon {
            width: 34px;
            height: 34px;
          }
          .hs-btn-list-prop {
            padding: 8px 14px;
            font-size: 12.5px;
          }
          .hs-btn-free-badge {
            display: none;
          }
        }
      `}</style>

      {/* ─── TOP HEADER ─────────────────────────────────────── */}
      <header className={`hs-header-sticky ${scrolled ? "scrolled" : ""}`}>
        <div className="hs-header-container">
          {/* LEFT: Logo & Locality Picker */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" className="hs-hdr-logo">
              <div className="hs-hdr-logo-icon">
                <Building2 size={20} strokeWidth={2.2} />
              </div>
              <div className="hs-hdr-logo-text">
                <span className="hs-hdr-logo-title">HomeSpace</span>
                <span className="hs-hdr-logo-sub">The Propertist</span>
              </div>
            </Link>

            {/* Locality Selector matching ListingsPage filter */}
            <div className="hs-city-picker">
              <button
                type="button"
                className="hs-city-btn"
                onClick={() => setLocalityDropdownOpen(!localityDropdownOpen)}
                aria-expanded={localityDropdownOpen}
              >
                <MapPin size={15} color="#c8a84b" strokeWidth={2.2} />
                <span>{selectedLocality}</span>
                <ChevronDown size={13} color="rgba(255,255,255,0.7)" />
              </button>

              {localityDropdownOpen && (
                <div className="hs-city-dropdown">
                  <div style={{ padding: "4px 8px 8px", fontSize: 11, fontWeight: 700, color: "#c8a84b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Select Locality
                  </div>
                  {LOCALITIES_LIST.map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      className={`hs-city-item ${selectedLocality === loc.name ? "active" : ""}`}
                      onClick={() => handleSelectLocality(loc)}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={13} color="#c8a84b" />
                        {loc.name}
                      </span>
                      <span className="hs-city-item-count">{loc.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Desktop Navigation Menu with Real Listings Filter Logic */}
          <nav className="hs-hdr-nav">
            {NAV_LINKS.map((nav) => {
              const NavIcon = nav.icon;
              return (
                <div
                  key={nav.label}
                  className="hs-nav-item-wrap"
                  onMouseEnter={() => setActiveDropdown(nav.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link href={nav.href} className="hs-nav-link">
                    <NavIcon size={16} strokeWidth={2} />
                    <span>{nav.label}</span>
                    {nav.badge && (
                      <span className={`hs-nav-badge ${nav.badgeType || "new"}`}>
                        {nav.badge}
                      </span>
                    )}
                    <ChevronDown size={13} style={{ opacity: 0.6 }} />
                  </Link>

                  {/* Mega Dropdown Menu */}
                  {nav.subItems && nav.subItems.length > 0 && (
                    <div className="hs-dropdown-menu">
                      <div style={{ padding: "4px 8px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#c8a84b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {nav.label} Filters
                        </span>
                        <Link href={nav.href} style={{ fontSize: 11.5, color: "#ebd9a2", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                          View all <ArrowRight size={11} color="#c8a84b" />
                        </Link>
                      </div>

                      {nav.subItems.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <Link key={sub.title} href={sub.href} className="hs-dropdown-item">
                            <div className="hs-dropdown-icon-box">
                              <SubIcon size={18} strokeWidth={2} />
                            </div>
                            <div>
                              <div className="hs-dropdown-title">
                                {sub.title}
                                {sub.badge && (
                                  <span className="hs-nav-badge hot" style={{ fontSize: 8.5, padding: "1px 5px" }}>
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              <div className="hs-dropdown-desc">{sub.desc}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* RIGHT: Actions */}
          <div className="hs-hdr-actions">
            {/* Wishlist Link */}
            <Link href="/saved" className="hs-wishlist-btn" title="Saved Properties">
              <Heart 
                size={18} 
                color="#f43f5e" 
                fill={isWishlistLoaded && wishlistCount > 0 ? "#f43f5e" : "none"} 
                strokeWidth={2} 
              />
              {isWishlistLoaded && wishlistCount > 0 && (
                <span className="hs-wishlist-badge">{wishlistCount}</span>
              )}
            </Link>

            <Link href="/list-property" className="hs-btn-list-prop">
              <Plus size={16} strokeWidth={2.6} />
              <span>List Property</span>
              {/* <span className="hs-btn-free-badge">Free</span> */}
            </Link>

            {/* Mobile / Tablet Menu Trigger (HIDDEN ON DESKTOP) */}
            <button
              type="button"
              className="hs-mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Drawer"
            >
              <Menu size={22} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── MINIMALIST MOBILE/TABLET SIDEBAR DRAWER ───────── */}
      <div
        className={`hs-drawer-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className={`hs-adv-drawer ${mobileMenuOpen ? "open" : ""}`} aria-hidden={!mobileMenuOpen}>
        {/* Drawer Header */}
        <div className="hs-d-header">
          <Link href="/" className="hs-hdr-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="hs-hdr-logo-icon" style={{ width: 34, height: 34 }}>
              <Building2 size={18} strokeWidth={2.2} />
            </div>
            <div className="hs-hdr-logo-text">
              <span className="hs-hdr-logo-title" style={{ fontSize: 18 }}>HomeSpace</span>
              <span className="hs-hdr-logo-sub">The Propertist</span>
            </div>
          </Link>

          <button
            type="button"
            className="hs-d-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close sidebar menu"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="hs-d-scroll">
          {/* Quick Mode Switches: Buy & Rent */}
          <div className="hs-drawer-modes">
            <Link
              href="/listings?mode=buy"
              className="hs-drawer-mode-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building2 size={16} color="#c8a84b" />
              <span>Buy Homes</span>
            </Link>
            <Link
              href="/listings?mode=rent"
              className="hs-drawer-mode-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <KeyRound size={16} color="#c8a84b" />
              <span>Rent Homes</span>
            </Link>
          </div>

          {/* Saved Homes Card */}
          <Link
            href="/saved"
            className="hs-drawer-saved-card"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Heart size={18} color="#f43f5e" fill="#f43f5e" />
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>Saved Properties</span>
            </div>
            <span style={{
              background: "#f43f5e",
              color: "#fff",
              fontSize: 11,
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: 999,
            }}>
              {isWishlistLoaded ? wishlistCount : 0}
            </span>
          </Link>

          {/* Minimalist Navigation Filter Accordions */}
          <div className="hs-d-nav-list">
            {NAV_LINKS.map((nav) => {
              const NavIcon = nav.icon;
              const isExpanded = mobileActiveAccordion === nav.label;

              return (
                <div className={`hs-d-nav-card ${isExpanded ? "active" : ""}`} key={nav.label}>
                  <button
                    type="button"
                    className="hs-d-nav-btn"
                    onClick={() =>
                      setMobileActiveAccordion(isExpanded ? null : nav.label)
                    }
                    aria-expanded={isExpanded}
                  >
                    <div className="hs-d-nav-left">
                      <div className="hs-d-nav-icon-wrap">
                        <NavIcon size={16} strokeWidth={2} />
                      </div>
                      <div className="hs-d-nav-title">
                        <span>{nav.label}</span>
                        {nav.badge && (
                          <span className={`hs-nav-badge ${nav.badgeType || "new"}`} style={{ fontSize: 9, padding: "2px 6px" }}>
                            {nav.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown size={16} className="hs-d-chevron" />
                  </button>

                  {isExpanded && nav.subItems && (
                    <div className="hs-d-sublist">
                      {nav.subItems.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            className="hs-d-sublink"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div className="hs-d-sublink-info">
                              <div className="hs-d-subicon">
                                <SubIcon size={14} strokeWidth={2} />
                              </div>
                              <div className="hs-d-subtitle">
                                <span>{sub.title}</span>
                                {sub.badge && (
                                  <span className="hs-nav-badge hot" style={{ fontSize: 8.5, padding: "1px 5px" }}>
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight size={13} color="#c8a84b" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Minimalist Post Property Button */}
          <Link
            href="/list-property"
            className="hs-drawer-post-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Plus size={16} strokeWidth={2.8} />
            <span>Post Property (Free)</span>
          </Link>
        </div>

        {/* Minimalist Drawer Sticky Footer */}
        <div className="hs-d-fixed-footer">
          <div className="hs-footer-terms">
            © 2026 HomeSpace • The Propertist
          </div>
          <Link
            href="/listings"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: 11.5, color: "#c8a84b", fontWeight: 700, textDecoration: "none" }}
          >
            All Listings →
          </Link>
        </div>
      </aside>
    </>
  );
}
