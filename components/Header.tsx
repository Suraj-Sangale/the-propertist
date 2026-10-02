"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlist } from "@/utilities/wishlist";
import {
  Building2,
  Home,
  KeyRound,
  Sparkles,
  Calculator,
  ShieldCheck,
  Heart,
  CalendarDays,
  User,
  MapPin,
  ChevronRight,
  ChevronDown,
  X,
  Phone,
  MessageCircle,
  Plus,
  ArrowUpRight,
  Search,
  Briefcase,
  Layers,
  TrendingUp,
  HelpCircle,
  FileText,
  BadgePercent,
  Clock,
  Compass,
  ArrowRight,
  CheckCircle2,
  Scale,
  Menu,
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

const NAV_LINKS: NavCategory[] = [
  {
    label: "Buy",
    href: "/buy",
    icon: Building2,
    subItems: [
      {
        title: "Apartments & Flats",
        desc: "1, 2, 3+ BHK premium high-rise homes",
        href: "/buy?type=apartments",
        icon: Building2,
      },
      {
        title: "Luxury Villas",
        desc: "Independent bungalows & private estates",
        href: "/buy?type=villas",
        icon: Home,
        badge: "Luxury",
      },
      {
        title: "Penthouses & Duplex",
        desc: "Sky-villas with panoramic skyline views",
        href: "/buy?type=penthouses",
        icon: Sparkles,
      },
      {
        title: "Commercial Spaces",
        desc: "Grade-A offices & retail storefronts",
        href: "/buy?type=commercial",
        icon: Briefcase,
      },
      {
        title: "Residential Plots",
        desc: "Gated layouts & RERA-cleared land",
        href: "/buy?type=plots",
        icon: Layers,
      },
    ],
  },
  {
    label: "Rent",
    href: "/rent",
    icon: KeyRound,
    subItems: [
      {
        title: "Furnished Apartments",
        desc: "Move-in ready homes with zero setup time",
        href: "/rent?type=furnished",
        icon: Home,
      },
      {
        title: "Studio & Co-Living",
        desc: "Modern compact living for professionals",
        href: "/rent?type=studio",
        icon: Building2,
      },
      {
        title: "Family Residences",
        desc: "Spacious gated society villas & flats",
        href: "/rent?type=family",
        icon: Sparkles,
      },
      {
        title: "Office & Retail Leases",
        desc: "Plug-and-play spaces for high growth teams",
        href: "/rent?type=commercial-rent",
        icon: Briefcase,
      },
    ],
  },
  {
    label: "Projects",
    href: "/projects",
    badge: "Hot",
    badgeType: "hot",
    icon: Compass,
    subItems: [
      {
        title: "New Launches 2026",
        desc: "Exclusive pre-launch pricing & early bird offers",
        href: "/projects?filter=new-launches",
        icon: Sparkles,
        badge: "New",
      },
      {
        title: "Ready to Move In",
        desc: "Completed towers with OC received",
        href: "/projects?filter=ready",
        icon: CheckCircle2,
      },
      {
        title: "Eco-Smart & Green Homes",
        desc: "IGBC Platinum certified sustainable living",
        href: "/projects?filter=eco",
        icon: Layers,
      },
      {
        title: "High-ROI Investments",
        desc: "High rental yield & capital appreciation",
        href: "/projects?filter=investments",
        icon: TrendingUp,
        badge: "Top ROI",
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    badge: "Pro",
    badgeType: "pro",
    icon: ShieldCheck,
    subItems: [
      {
        title: "Home Loan Advisory",
        desc: "Lowest interest rates starting at 8.25% p.a.",
        href: "/services#loans",
        icon: Calculator,
      },
      {
        title: "Legal & RERA Verification",
        desc: "40+ checklist legal audit by expert lawyers",
        href: "/services#legal",
        icon: Scale,
      },
      {
        title: "Interior Design & Fitouts",
        desc: "End-to-end bespoke home interiors",
        href: "/services#interiors",
        icon: Sparkles,
      },
      {
        title: "Free Property Valuation",
        desc: "AI-driven market accurate price estimator",
        href: "/services#valuation",
        icon: BadgePercent,
      },
    ],
  },
];

const CITIES = [
  { name: "Mumbai", count: "12.4k+" },
  { name: "Pune", count: "8.1k+" },
  { name: "Bangalore", count: "15.2k+" },
  { name: "Delhi NCR", count: "18.6k+" },
  { name: "Hyderabad", count: "9.8k+" },
  { name: "Goa", count: "3.2k+" },
];

const QUICK_TOOLS = [
  { label: "EMI Calc", icon: Calculator, href: "/calculator", desc: "Plan budgets" },
  { label: "Valuation", icon: BadgePercent, href: "/valuation", desc: "Instant AI estimate" },
  { label: "Legal Check", icon: ShieldCheck, href: "/legal", desc: "RERA verification" },
  { label: "Insights", icon: TrendingUp, href: "/trends", desc: "Price heatmaps" },
];

export default function Header() {
  const { count: wishlistCount, isLoaded: isWishlistLoaded } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveAccordion, setMobileActiveAccordion] = useState<string | null>("Buy");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Handle scroll detection for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    console.log('window.scrollY', window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open & handle Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setCityDropdownOpen(false);
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
          transition: background-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          background: rgba(255, 255, 255, 0);
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          border-bottom: 1px solid rgba(255, 255, 255, 0);
          box-shadow: none;
        }

        .hs-header-sticky.scrolled {
          background: rgba(255, 255, 255, 0);
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
          color: #0f172a;
          letter-spacing: -0.03em;
          flex-shrink: 0;
        }
        .hs-hdr-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e1b4b 100%);
          display: grid;
          place-items: center;
          color: #fff;
          box-shadow: 0 8px 18px -4px rgba(37, 99, 235, 0.45);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hs-hdr-logo:hover .hs-hdr-logo-icon {
          transform: scale(1.08) rotate(-3deg);
        }
        .hs-hdr-logo-text {
          display: flex;
          flex-direction: column;
        }
        .hs-hdr-logo-title {
          font-weight: 800;
          font-size: 20px;
          line-height: 1.15;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hs-hdr-logo-sub {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #2563eb;
        }

        /* ─── City Selector ──────────────────────────── */
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
          background: rgba(241, 245, 249, 0.9);
          border: 1px solid rgba(203, 213, 225, 0.7);
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(8px);
        }
        .hs-city-btn:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
          transform: translateY(-1px);
        }
        .hs-city-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 200px;
          background: #ffffff;
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(226, 232, 240, 0.8);
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
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .hs-city-item:hover, .hs-city-item.active {
          background: #eff6ff;
          color: #2563eb;
          font-weight: 600;
        }
        .hs-city-item-count {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }
        .hs-city-item.active .hs-city-item-count {
          color: #3b82f6;
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
          color: #334155;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs-nav-link:hover, .hs-nav-item-wrap:hover .hs-nav-link {
          color: #2563eb;
          background: rgba(37, 99, 235, 0.08);
        }
        .hs-nav-badge {
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 7px;
          border-radius: 999px;
          background: #2563eb;
          color: #fff;
        }
        .hs-nav-badge.hot {
          background: linear-gradient(135deg, #ef4444, #f97316);
        }
        .hs-nav-badge.new {
          background: #10b981;
        }
        .hs-nav-badge.pro {
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
        }

        /* Desktop Mega Dropdown */
        .hs-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          width: 360px;
          background: #ffffff;
          border-radius: 20px;
          padding: 12px;
          box-shadow: 0 24px 50px -12px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(226, 232, 240, 0.9);
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
          background: #f8faff;
          transform: translateX(3px);
        }
        .hs-dropdown-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .hs-dropdown-item:hover .hs-dropdown-icon-box {
          background: #2563eb;
          color: #ffffff;
          transform: scale(1.05);
        }
        .hs-dropdown-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hs-dropdown-desc {
          font-size: 11.5px;
          color: #64748b;
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
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #1e1b4b 100%);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 999px;
          text-decoration: none;
          box-shadow: 0 6px 20px -4px rgba(37, 99, 235, 0.4);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .hs-btn-list-prop:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -4px rgba(37, 99, 235, 0.55);
        }
        .hs-btn-free-badge {
          background: #10b981;
          color: #fff;
          font-size: 9.5px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
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
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs-wishlist-btn:hover {
          background: #ffffff;
          border-color: #fca5a5;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(244, 63, 94, 0.16);
          color: #e11d48;
        }
        .hs-wishlist-badge {
          position: absolute;
          top: -1px;
          right: -1px;
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
          box-shadow: 0 2px 6px rgba(244, 63, 94, 0.5);
          border: 2px solid #ffffff;
          line-height: 1;
        }

        /* ─── Mobile / Sidebar Menu Trigger ─────────── */
        .hs-mobile-toggle {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: rgba(241, 245, 249, 0.9);
          border: 1px solid rgba(203, 213, 225, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #0f172a;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .hs-mobile-toggle:hover {
          background: #ffffff;
          border-color: #2563eb;
          color: #2563eb;
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.15);
          transform: scale(1.04);
        }

        /* ─── ADVANCED SIDEBAR DRAWER ───────────────── */
        .hs-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
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
          max-width: 430px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          z-index: 2010;
          display: flex;
          flex-direction: column;
          box-shadow: -15px 0 50px rgba(15, 23, 42, 0.18);
          transform: translateX(100%);
          transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
          border-left: 1px solid rgba(226, 232, 240, 0.8);
          overflow: hidden;
        }
        @media (min-width: 520px) {
          .hs-adv-drawer {
            border-top-left-radius: 28px;
            border-bottom-left-radius: 28px;
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
          padding: 20px 24px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .hs-d-close-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: #f1f5f9;
          display: grid;
          place-items: center;
          cursor: pointer;
          color: #475569;
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
          padding: 20px 20px 100px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .hs-d-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .hs-d-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        /* Drawer User / Guest Card */
        .hs-user-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 2  0px;
          padding: 18px;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .hs-user-card::before {
          content: "";
          position: absolute;
          top: -40px;
          right: -40px;
          width: 130px;
          height: 130px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .hs-user-info {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }
        .hs-user-avatar-wrap {
          position: relative;
        }
        .hs-user-avatar-large {
          width: 46px;
          height: 46px;
          border-radius: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          display: grid;
          place-items: center;
          color: #ffffff;
          font-weight: 700;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        .hs-user-status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid #0f172a;
        }
        .hs-user-text-main {
          display: flex;
          flex-direction: column;
        }
        .hs-user-name {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
        }
        .hs-user-tag {
          font-size: 11.5px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 2px;
        }

        .hs-user-quick-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .hs-quick-stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 8px 4px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          text-decoration: none;
          color: #ffffff;
          transition: all 0.2s;
        }
        .hs-quick-stat-item:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
        }
        .hs-stat-num {
          font-size: 13px;
          font-weight: 700;
          color: #60a5fa;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .hs-stat-lbl {
          font-size: 10.5px;
          color: #cbd5e1;
          margin-top: 2px;
        }

        /* Drawer City Quick Switcher */
        .hs-d-section-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }
        .hs-city-chips-container {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .hs-city-chips-container::-webkit-scrollbar {
          display: none;
        }
        .hs-city-chip {
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
        }
        .hs-city-chip:hover {
          border-color: #93c5fd;
          color: #2563eb;
          background: #eff6ff;
        }
        .hs-city-chip.active {
          background: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }

        /* Drawer Navigation Accordions */
        .hs-d-nav-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .hs-d-nav-card {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #ffffff;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .hs-d-nav-card.active {
          border-color: #bfdbfe;
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.06);
        }
        .hs-d-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }
        .hs-d-nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .hs-d-nav-icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #f1f5f9;
          color: #475569;
          display: grid;
          place-items: center;
          transition: all 0.2s;
        }
        .hs-d-nav-card.active .hs-d-nav-icon-wrap {
          background: #eff6ff;
          color: #2563eb;
        }
        .hs-d-nav-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
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
          color: #2563eb;
        }

        .hs-d-sublist {
          padding: 6px 12px 14px;
          border-top: 1px solid #f1f5f9;
          background: #fafcff;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .hs-d-sublink {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 10px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.18s ease;
        }
        .hs-d-sublink:hover {
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
          transform: translateX(3px);
        }
        .hs-d-sublink-info {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .hs-d-subicon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #eff6ff;
          color: #2563eb;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .hs-d-subtitle {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hs-d-subdesc {
          font-size: 11px;
          color: #64748b;
          line-height: 1.3;
        }

        /* Quick Tools Grid */
        .hs-tools-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .hs-tool-card {
          padding: 12px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .hs-tool-card:hover {
          border-color: #2563eb;
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.08);
          transform: translateY(-2px);
        }
        .hs-tool-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #eff6ff;
          color: #2563eb;
          display: grid;
          place-items: center;
        }
        .hs-tool-label {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
        }
        .hs-tool-desc {
          font-size: 10.5px;
          color: #64748b;
        }

        /* High Impact List Property CTA Card */
        .hs-cta-box {
          border-radius: 20px;
          background: linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #1e293b 100%);
          padding: 18px;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px -5px rgba(46, 16, 101, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .hs-cta-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .hs-cta-title {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 4px;
        }
        .hs-cta-sub {
          font-size: 12px;
          color: #cbd5e1;
          line-height: 1.4;
          margin-bottom: 14px;
        }
        .hs-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          padding: 10px 16px;
          border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
          transition: all 0.2s;
        }
        .hs-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
        }

        /* Concierge & Support Card */
        .hs-support-card {
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .hs-support-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hs-support-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #dcfce7;
          color: #16a34a;
          display: grid;
          place-items: center;
        }
        .hs-support-text {
          display: flex;
          flex-direction: column;
        }
        .hs-support-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
        }
        .hs-support-status {
          font-size: 11px;
          color: #16a34a;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }
        .hs-support-btn {
          padding: 6px 12px;
          border-radius: 8px;
          background: #22c55e;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s;
        }
        .hs-support-btn:hover {
          background: #16a34a;
        }

        /* Sticky Drawer Bottom Footer */
        .hs-d-fixed-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 14px 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(226, 232, 240, 0.9);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
        }
        .hs-footer-social-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hs-footer-social-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #64748b;
          display: grid;
          place-items: center;
          text-decoration: none;
          font-size: 12px;
          transition: all 0.15s;
        }
        .hs-footer-social-btn:hover {
          background: #eff6ff;
          color: #2563eb;
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

      {/* ─── DESKTOP & TOP HEADER ──────────────────────────── */}
      <header className={`hs-header-sticky ${scrolled ? "scrolled" : ""}`}>
        <div className="hs-header-container">
          {/* LEFT: Logo & City */}
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

            {/* City Selector */}
            <div className="hs-city-picker">
              <button
                type="button"
                className="hs-city-btn"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                aria-expanded={cityDropdownOpen}
              >
                <MapPin size={15} color="#2563eb" strokeWidth={2.2} />
                <span>{selectedCity}</span>
                <ChevronDown size={13} color="#64748b" />
              </button>

              {cityDropdownOpen && (
                <div className="hs-city-dropdown">
                  <div style={{ padding: "4px 8px 8px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                    Select Metropolitan Area
                  </div>
                  {CITIES.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      className={`hs-city-item ${selectedCity === c.name ? "active" : ""}`}
                      onClick={() => {
                        setSelectedCity(c.name);
                        setCityDropdownOpen(false);
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={13} />
                        {c.name}
                      </span>
                      <span className="hs-city-item-count">{c.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Desktop Navigation Menu */}
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
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Explore {nav.label}
                        </span>
                        <Link href={nav.href} style={{ fontSize: 11.5, color: "#2563eb", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                          View all <ArrowRight size={11} />
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
              <span className="hs-btn-free-badge">Free</span>
            </Link>

            {/* Mobile / Sidebar Menu Trigger Button */}
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

      {/* ─── ADVANCED FULL-FEATURED MOBILE/SIDEBAR DRAWER ───── */}
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
              <span className="hs-hdr-logo-sub">Premium Real Estate</span>
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
          {/* User Profile / Quick Actions Card */}
          <div className="hs-user-card">
            <div className="hs-user-info">
              <div className="hs-user-avatar-wrap">
                <div className="hs-user-avatar-large">
                  <User size={22} />
                </div>
                <div className="hs-user-status-dot" />
              </div>
              <div className="hs-user-text-main">
                <div className="hs-user-name">Welcome Explorer</div>
                <div className="hs-user-tag">
                  <Sparkles size={12} color="#60a5fa" />
                  <span>VIP Property Seeker</span>
                </div>
              </div>
            </div>

            {/* Quick Stat Actions */}
            <div className="hs-user-quick-stats">
              <Link href="/saved" className="hs-quick-stat-item" onClick={() => setMobileMenuOpen(false)}>
                <span className="hs-stat-num">
                  <Heart 
                    size={14} 
                    color="#f43f5e" 
                    fill={isWishlistLoaded && wishlistCount > 0 ? "#f43f5e" : "none"} 
                  />{" "}
                  {isWishlistLoaded ? wishlistCount : 0}
                </span>
                <span className="hs-stat-lbl">Saved Homes</span>
              </Link>
              <Link href="/visits" className="hs-quick-stat-item" onClick={() => setMobileMenuOpen(false)}>
                <span className="hs-stat-num">
                  <CalendarDays size={14} color="#38bdf8" /> 2
                </span>
                <span className="hs-stat-lbl">Site Visits</span>
              </Link>
              <Link href="/recent-searches" className="hs-quick-stat-item" onClick={() => setMobileMenuOpen(false)}>
                <span className="hs-stat-num">
                  <Clock size={14} color="#a78bfa" /> 5
                </span>
                <span className="hs-stat-lbl">Searches</span>
              </Link>
            </div>
          </div>

          {/* Quick City Switcher */}
          <div>
            <div className="hs-d-section-title">
              <MapPin size={13} color="#2563eb" />
              <span>Current Metro Location</span>
            </div>
            <div className="hs-city-chips-container">
              {CITIES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className={`hs-city-chip ${selectedCity === c.name ? "active" : ""}`}
                  onClick={() => setSelectedCity(c.name)}
                >
                  <MapPin size={12} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Accordions */}
          <div>
            <div className="hs-d-section-title">
              <Layers size={13} color="#2563eb" />
              <span>Explore Categories</span>
            </div>

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
                          <NavIcon size={18} strokeWidth={2} />
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
                                  <SubIcon size={15} strokeWidth={2} />
                                </div>
                                <div>
                                  <div className="hs-d-subtitle">
                                    {sub.title}
                                    {sub.badge && (
                                      <span className="hs-nav-badge hot" style={{ fontSize: 8.5, padding: "1px 5px" }}>
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="hs-d-subdesc">{sub.desc}</div>
                                </div>
                              </div>
                              <ArrowRight size={13} color="#94a3b8" />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tools & Utilities */}
          <div>
            <div className="hs-d-section-title">
              <Calculator size={13} color="#2563eb" />
              <span>Smart Tools & Calculators</span>
            </div>

            <div className="hs-tools-grid">
              {QUICK_TOOLS.map((tool) => {
                const ToolIcon = tool.icon;
                return (
                  <Link
                    key={tool.label}
                    href={tool.href}
                    className="hs-tool-card"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="hs-tool-icon-wrap">
                      <ToolIcon size={16} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div className="hs-tool-label">{tool.label}</div>
                      <div className="hs-tool-desc">{tool.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* High-Converting List Property Banner */}
          <div className="hs-cta-box">
            <div className="hs-cta-tag">
              <Sparkles size={11} />
              <span>Zero Brokerage</span>
            </div>
            <div className="hs-cta-title">Sell or Rent 3x Faster</div>
            <div className="hs-cta-sub">
              Reach over 50,000+ verified buyers and premium tenants every month.
            </div>
            <Link
              href="/list-property"
              className="hs-cta-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>+ Post Property For Free</span>
            </Link>
          </div>

          {/* 24/7 Concierge Support */}
          <div className="hs-support-card">
            <div className="hs-support-left">
              <div className="hs-support-icon-wrap">
                <MessageCircle size={18} />
              </div>
              <div className="hs-support-text">
                <span className="hs-support-title">Property Concierge</span>
                <span className="hs-support-status">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
                  Online • Avg reply 2m
                </span>
              </div>
            </div>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="hs-support-btn"
            >
              <Phone size={12} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Drawer Sticky Footer */}
        <div className="hs-d-fixed-footer">
          <div className="hs-footer-social-wrap">
            <a href="#" className="hs-footer-social-btn" aria-label="Website info">
              <HelpCircle size={15} />
            </a>
            <a href="#" className="hs-footer-social-btn" aria-label="Legal terms">
              <FileText size={15} />
            </a>
          </div>
          <div className="hs-footer-terms">
            © 2026 HomeSpace • Premium Living
          </div>
        </div>
      </aside>
    </>
  );
}
