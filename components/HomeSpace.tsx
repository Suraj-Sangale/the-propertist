"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PropertyCarousel from "./PropertyCarousel";
import type { Property } from "./PropertyCarousel";
import StatsBanner from "./StatsBanner";
import ImageMarquee from "./ImageMarquee";
import { ALL_PROPERTIES } from "@/utilities/masterData";

// ─── Data ────────────────────────────────────────────────────────────────────

const SEARCH_TABS = ["Buy", "Rent", "New Projects"];

const PROPERTY_TYPE_OPTIONS = [
  { value: "", label: "Any Type" },
  { value: "1_bhk", label: "1 BHK" },
  { value: "2_bhk", label: "2 BHK" },
  { value: "3_bhk", label: "3 BHK" },
  { value: "4_bhk", label: "4+ BHK" },
];

const BUDGET_OPTIONS = [
  { value: "", label: "Any Budget" },
  { value: "0-1.5", label: "Under ₹1.5 Cr" },
  { value: "1.5-3", label: "₹1.5 - 3 Cr" },
  { value: "3-5", label: "₹3 - 5 Cr" },
  { value: "5+", label: "₹5 Cr+" },
];

const POPULAR_SEARCHES = [
  { label: "2 BHK in Mumbai", href: "/listings?q=2+BHK+Mumbai&config=2_bhk" },
  { label: "3 BHK in Mumbai", href: "/listings?q=3+BHK+Mumbai&config=3_bhk" },
  { label: "Luxury Residences", href: "/listings?q=Luxury" },
  { label: "Ready to Move", href: "/listings?status=ready_to_move" },
];

const CATEGORY_CARDS = [
  {
    src: "/images/projects/Untitled-design-18.webp",
    title: "Luxury Apartments",
    sub: "In Mumbai",
  },
  {
    src: "/images/cat/banglow.png",
    title: "Independent Houses",
    sub: "In Bangalore",
  },
  {
    src: "/images/cat/plot.jpg",
    title: "Plots & Land",
    sub: "In Pune",
  },
];

const FEATURES = [
  // {
  //   bg: "#e8edff",
  //   icon: (
  //     <svg viewBox="0 0 24 24" fill="#2f3cf0" style={{ width: 22, height: 22 }}>
  //       <path d="M12 3 2 12h3v9h5v-6h4v6h5v-9h3z" />
  //     </svg>
  //   ),
  //   title: "Verified Listings",
  //   sub: "100% authentic properties",
  // },
  {
    bg: "#dcf5e5",
    icon: (
      <svg viewBox="0 0 24 24" fill="#26a75a" style={{ width: 22, height: 22 }}>
        <path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5z" />
        <path d="m8.5 12 2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2" fill="none" />
      </svg>
    ),
    title: "Trusted Agents",
    sub: "RERA approved professionals",
  },
  {
    bg: "#fdebd9",
    icon: (
      <svg viewBox="0 0 24 24" fill="#f7931e" style={{ width: 22, height: 22 }}>
        <path d="m12 2 3 6.5 7 .8-5.2 4.8 1.5 7-6.3-3.6L5.7 21l1.5-7L2 9.3l7-.8z" />
      </svg>
    ),
    title: "Best Prices",
    sub: "Compare & save more",
  },
  {
    bg: "#ece3fb",
    icon: (
      <svg viewBox="0 0 24 24" fill="#7b3fe4" style={{ width: 22, height: 22 }}>
        <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
      </svg>
    ),
    title: "Prime Locations",
    sub: "Homes in top neighbourhoods",
  },
];

const PROPERTIES = ALL_PROPERTIES.slice(0,8)


// ─── SVG helpers ─────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "#222", fill: "none", strokeWidth: 2 }}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

const IconHome = () => (
  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "#2f3cf0", fill: "none", strokeWidth: 2 }}>
    <path d="M3 11 12 3l9 8v10H3z" />
  </svg>
);

const IconBudget = () => (
  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "#2f3cf0", fill: "none", strokeWidth: 2 }}>
    <ellipse cx="12" cy="6" rx="8" ry="3" />
    <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
  </svg>
);

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#2f3cf0" strokeWidth="2" style={{ width: 18, height: 18 }}>
    <path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z" />
  </svg>
);

const IconHeart = () => (
  <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "#111", fill: "none", strokeWidth: 2 }}>
    <path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z" />
  </svg>
);

const IconArea = () => (
  <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "#666", fill: "none", strokeWidth: 1.8 }}>
    <path d="M4 4h16v16H4z" />
  </svg>
);

const IconBed = () => (
  <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "#666", fill: "none", strokeWidth: 1.8 }}>
    <path d="M3 18V8h18v10M3 14h18" />
  </svg>
);

const IconBath = () => (
  <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "#666", fill: "none", strokeWidth: 1.8 }}>
    <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
  </svg>
);

function SearchDropdown({
  id,
  icon,
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (val: string) => void;
}) {
  const selectedOption = options.find((o) => o.value === value) || options[0];
  const hasValue = Boolean(value);

  return (
    <div className="hs-dropdown-wrap" id={`wrap-${id}`}>
      <button
        type="button"
        id={id}
        className={`hs-dropdown-btn${isOpen ? " open" : ""}${hasValue ? " has-value" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="hs-dropdown-btn-left">
          <div className="hs-dropdown-icon">{icon}</div>
          <div className="hs-dropdown-labels">
            <span className="hs-dropdown-tag">{label}</span>
            <span className="hs-dropdown-val" title={selectedOption.label}>
              {selectedOption.label}
            </span>
          </div>
        </div>
        <span className={`hs-dropdown-chevron${isOpen ? " rotate" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="hs-dropdown-popover" role="listbox">
          <div className="hs-dropdown-header">
            <span>Select {label}</span>
            {hasValue && (
              <button
                type="button"
                className="hs-dropdown-reset"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect("");
                }}
              >
                Reset
              </button>
            )}
          </div>
          <div className="hs-dropdown-options">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`hs-dropdown-item${isSelected ? " selected" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(opt.value);
                  }}
                >
                  <span className="hs-dropdown-check">
                    {isSelected && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  <span className="hs-dropdown-item-label">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomeSpace() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0); // 0: Buy, 1: Rent, 2: New Projects
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [openDropdown, setOpenDropdown] = useState<"type" | "budget" | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  // Debounce search query for suggestions dropdown
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions and custom dropdowns on click outside or escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setOpenDropdown(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowSuggestions(false);
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearch = (overrideQuery?: string) => {
    setShowSuggestions(false);
    const q = overrideQuery !== undefined ? overrideQuery : query;
    const params = new URLSearchParams();

    if (activeTab === 1) {
      params.set("mode", "rent");
    } else {
      params.set("mode", "buy");
      if (activeTab === 2) {
        params.set("status", "new_launch");
      }
    }

    if (q.trim()) {
      params.set("q", q.trim());
    }
    if (propertyType) {
      params.set("config", propertyType);
    }
    if (budget) {
      params.set("budget", budget);
    }

    router.push(`/listings?${params.toString()}`);
  };

  const suggestions = debouncedQuery.length >= 2
    ? ALL_PROPERTIES.filter((p) => {
        const mode = activeTab === 1 ? "rent" : "buy";
        if (p.mode && p.mode !== mode) return false;
        const q = debouncedQuery.toLowerCase();
        const corpus = [
          p.name,
          p.projectName,
          p.developer,
          p.locality,
          p.locality_label,
          p.address,
          p.config,
          p.config_label,
          p.beds,
        ].filter(Boolean).join(" ").toLowerCase();
        return q.split(/\s+/).every((term) => corpus.includes(term));
      }).slice(0, 5)
    : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .hs-root * { box-sizing: border-box; }
        .hs-root {
          font-family: 'Inter', system-ui, sans-serif;
          color: #0d0d12;
          background: #fff;
          overflow-x: hidden;
          --blue: #2f3cf0;
          --blue-d: #2531d6;
          --ink: #0d0d12;
          --muted: #5b6172;
          --navy: #3a4a6b;
        }
        .hs-root img { display: block; object-fit: cover; background: linear-gradient(135deg,#dfe6f3,#c4d0e6); }
        .hs-root a { color: inherit; text-decoration: none; }

        /* HERO TEXT FOG */
        .hs-hero-text-fog {
          display: inline-block;
          background: transparent;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border-radius: 16px;
          margin-top: 4px;
        }

        .hs-wrap { max-width: 1320px; margin: 0rem auto; padding: 0 24px; position: relative; }
.hs-features-section { margin-top: 4rem; }
        /* HERO */
        .hs-hero {
          position: relative;
          min-height: 720px;
          padding-top: 100px;
          background-image: url('/images/heroBg.png');
          background-attachment: fixed;
          background-size: cover;
          background-position: center;
        }
        .hs-hero::after {
          content: "";
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(90deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.15) 45%, transparent 65%);
        }
        .hs-hero-curve {
          position: absolute; left: 0; right: 0; bottom: -1px; height: 130px;
          background: #fff; z-index: 2;
          clip-path: path("M0 60 C 250 20 500 90 800 70 S 1300 130 1600 160 L1600 200 L0 200 Z");
          width: 100%;
        }
        .hs-hero .hs-wrap { z-index: 3; position: relative; min-height: 600px; }

        /* HERO CONTENT */
        .hs-pill {
          display: inline-block;
          background: rgba(232,236,255,.85); color: #22308f;
          font-size: 13px; font-weight: 500;
          padding: 9px 16px; border-radius: 999px;
          border: 1px solid #cfd6f5;
        }
        .hs-trust { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; color: #444; margin-left: 18px; }
        .hs-trust-dot { width: 8px; height: 8px; border-radius: 50%; background: #f7931e; display: inline-block; }
        .hs-hero-top { margin-top: 16px; }
        .hs-h1 { font-size: 54px; line-height: 1.05; font-weight: 800; letter-spacing: -1.5px; margin: 10px 0 22px; }
        .hs-h1 span { color: #2f3cf0; }
        .hs-lead { font-size: 14px; line-height: 1.65; color: #222; max-width: 470px; }

        /* SEARCH */
        .hs-search-area { position: absolute; left: 24px; top: 270px; width: 1015px; z-index: 5; }
        .hs-tabs { display: inline-flex; gap: 8px; background: #fff; padding: 12px 14px 10px; border-radius: 26px 26px 0 0; }
        .hs-tabs button {
          border: 0; font: 500 12px 'Inter'; padding: 12px 26px;
          border-radius: 999px; background: #f1f3f8; cursor: pointer;
          transition: background .15s, color .15s;
        }
        .hs-tabs button.on { background: #2f3cf0; color: #fff; }
        .hs-bar {
          background: #fff; border-radius: 0 26px 26px 26px;
          padding: 12px 14px; display: flex; gap: 10px; align-items: center;
          box-shadow: 0 20px 50px rgba(20,30,80,.12);
          position: relative;
        }
        .hs-field {
          display: flex; align-items: center; gap: 10px;
          background: #f3f5f9; border-radius: 14px;
          height: 48px; padding: 0 14px;
          font-size: 12px; color: #666;
          white-space: nowrap;
          position: relative;
        }
        /* SEARCH DROPDOWNS */
        .hs-dropdowns-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hs-dropdown-wrap {
          position: relative;
          width: 175px;
          flex-shrink: 0;
        }
        .hs-dropdown-btn {
          width: 100%;
          height: 48px;
          border-radius: 14px;
          background: #f3f5f9;
          border: 1.5px solid transparent;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          cursor: pointer;
          transition: all 0.15s ease;
          outline: none;
          text-align: left;
        }
        .hs-dropdown-btn:hover {
          background: #eef2f8;
          border-color: #cbd5e1;
        }
        .hs-dropdown-btn.open {
          background: #ffffff;
          border-color: #2f3cf0;
          box-shadow: 0 0 0 3px rgba(47, 60, 240, 0.14);
        }
        .hs-dropdown-btn.has-value {
          background: #f8faff;
          border-color: #c7d2fe;
        }
        .hs-dropdown-btn-left {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
          overflow: hidden;
        }
        .hs-dropdown-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #ffffff;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          color: #2f3cf0;
        }
        .hs-dropdown-labels {
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }
        .hs-dropdown-tag {
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #64748b;
          line-height: 1;
          margin-bottom: 2px;
        }
        .hs-dropdown-val {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hs-dropdown-chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          color: #94a3b8;
          flex-shrink: 0;
          margin-left: 4px;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s;
        }
        .hs-dropdown-chevron svg {
          width: 14px;
          height: 14px;
          display: block;
        }
        .hs-dropdown-chevron.rotate {
          transform: rotate(180deg);
          color: #2f3cf0;
        }

        /* FLOATING DROPDOWN MENU */
        @keyframes hs-drop-fade {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .hs-dropdown-popover {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 220px;
          background: #ffffff;
          border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 18px 40px -6px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(15, 23, 42, 0.08);
          padding: 6px;
          z-index: 60;
          animation: hs-drop-fade 0.16s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px 8px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .hs-dropdown-reset {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 4px;
          transition: background 0.12s;
        }
        .hs-dropdown-reset:hover {
          background: #fee2e2;
        }
        .hs-dropdown-options {
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-height: 260px;
          overflow-y: auto;
        }
        .hs-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          border: 0;
          background: transparent;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background 0.12s, color 0.12s;
          color: #334155;
        }
        .hs-dropdown-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .hs-dropdown-item.selected {
          background: #eef2ff;
          color: #1e1b4b;
          font-weight: 600;
        }
        .hs-dropdown-check {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid #cbd5e1;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          background: #ffffff;
          transition: all 0.15s;
        }
        .hs-dropdown-item.selected .hs-dropdown-check {
          background: #2f3cf0;
          border-color: #2f3cf0;
          color: #ffffff;
        }
        .hs-dropdown-check svg {
          width: 11px;
          height: 11px;
          stroke: #ffffff;
          display: block;
        }
        .hs-dropdown-item-label {
          font-size: 13px;
          font-family: inherit;
        }
        .hs-go {
          background: #2f3cf0; color: #fff; border: 0;
          border-radius: 12px; height: 48px; width: 110px;
          font: 600 13.5px 'Inter'; cursor: pointer; transition: background .15s, transform .1s, box-shadow .15s;
          flex-shrink: 0; box-shadow: 0 4px 14px rgba(47,60,240,.3);
        }
        .hs-go:hover { background: #2531d6; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(47,60,240,.4); }
        .hs-go:active { transform: translateY(0); }

        /* LIVE SUGGESTIONS POPUP */
        .hs-sugg-box {
          position: absolute; top: calc(100% + 8px); left: 0; right: 0;
          background: #ffffff; border-radius: 16px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16), 0 2px 8px rgba(15, 23, 42, 0.08);
          border: 1px solid #e2e8f0; padding: 8px 0; z-index: 50; overflow: hidden;
        }
        .hs-sugg-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 16px; cursor: pointer; transition: background 0.12s ease;
          text-decoration: none; color: inherit;
        }
        .hs-sugg-item:hover { background: #f8fafc; }
        .hs-sugg-title {
          font-size: 13px; font-weight: 600; color: #0f172a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .hs-sugg-sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
        .hs-sugg-price {
          font-size: 12px; font-weight: 700; color: #2563eb;
          white-space: nowrap; margin-left: 12px;
        }
        .hs-sugg-footer {
          display: block; padding: 10px 16px; text-align: center;
          font-size: 12px; font-weight: 600; color: #2f3cf0;
          border-top: 1px solid #f1f5f9; background: #fafbfd;
          cursor: pointer; border: 0; width: 100%; transition: background .12s;
        }
        .hs-sugg-footer:hover { background: #f1f5f9; }

        .hs-popular { display: flex; align-items: center; gap: 10px; margin-top: 16px; color: #fff; font-size: 12.5px; font-weight: 500; flex-wrap: wrap; }
        .hs-popular a {
          border: 1px solid rgba(255,255,255,.55);
          background: rgba(20,30,50,.3); backdrop-filter: blur(6px);
          padding: 7px 15px; border-radius: 999px; font-size: 11.5px;
          transition: background .15s;
        }
        .hs-popular a:hover { background: rgba(20,30,50,.5); }

        /* CATEGORY CARDS (3D Extruded Slabs) */
        .hs-cats {
          position: absolute;
          right: 40px;
          top: 440px;
          display: flex;
          gap: 28px;
          z-index: 4;
          perspective: 1300px;
          perspective-origin: 30% 50%;
          transform-style: preserve-3d;
        }
        .hs-cat {
          position: relative;
          width: 130px;
          height: 225px;
          background: #ffffff;
          border-radius: 15px;
          padding: 4px 8px 12px;
          transform-style: preserve-3d;
          transform: perspective(1000px) rotateY(-28deg) rotateX(12deg) rotateZ(-3deg);
          /* 3D solid edge extrusion (depth/thickness) + realistic ambient drop shadow */
          box-shadow:
            1px 1px 0 #cdd9e6,
            2px 1px 0 #cdd9e6,
            3px 2px 0 #cdd9e6,
            4px 2px 0 #cdd9e6,
            5px 3px 0 #cdd9e6,
            6px 3px 0 #cdd9e6,
            7px 4px 0 #cdd9e6,
            8px 4px 0 #cdd9e6,
            9px 5px 0 #cdd9e6,
            18px 24px 34px rgba(15, 23, 42, 0.18),
            28px 40px 65px rgba(15, 23, 42, 0.24),
            0 2px 6px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.5);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          user-select: none;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
     
          .hs-cat:hover {
  transform: perspective(1000px)
    translateY(-12px)
    translateZ(15px)
    rotateY(-12deg)
    rotateX(5deg)
    rotateZ(-1deg);

  box-shadow:
    2px 3px 0 #d5e0eb,
    4px 5px 0 #d5e0eb,
    12px 20px 35px rgba(15, 23, 42, 0.16),
    25px 40px 65px rgba(15, 23, 42, 0.20);
}
        .hs-cat img {
          width: 100%;
          height: 156px;
          border-radius: 12px;
          object-fit: cover;
          display: block;
        }
        .hs-cat-body {
          padding: 11px 8px 4px;
          display: flex;
          flex-direction: column;
        }
        .hs-cat b {
          display: block;
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.25;
          letter-spacing: -0.2px;
        }
        .hs-cat small {
          font-size: 12.5px;
          font-weight: 500;
          color: #64748b;
          display: block;
          margin-top: 3px;
        }

        /* FEATURES */
        .hs-features { display: flex; gap: 44px; margin-top: -4px; position: relative; z-index: 3; }
        .hs-feat { display: flex; align-items: center; gap: 14px; }
        .hs-ic { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; }
        .hs-feat b { font-size: 12.5px; display: block; font-weight: 600; }
        .hs-feat small { font-size: 11.5px; color: #555; }

        /* SECTION HEADER */
        .hs-sec-h { display: flex; align-items: flex-end; justify-content: space-between; margin: 52px 0 22px; }
        .hs-sec-h h2 { font-size: 24px; font-weight: 700; }
        .hs-sec-h p { font-size: 14.5px; color: #5b6172; margin-top: 4px; }
        .hs-sec-r { display: flex; align-items: center; gap: 14px; margin-right:0px; }
        .hs-view {
          border: 1px solid #d5d9e4; background: #fff;
          border-radius: 999px; padding: 10px 20px;
          font-size: 13px; font-weight: 500; transition: background .15s;
        }
        .hs-view:hover { background: #f3f5f9; }
        .hs-arrow {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid #d5d9e4; background: #fff;
          display: grid; place-items: center;
          font-size: 16px; cursor: pointer;
          transition: background .15s, border-color .15s, box-shadow .15s;
          box-shadow: 0 1px 4px rgba(30,40,90,.07);
          line-height: 1; color: #333;
        }
        .hs-arrow:hover { background: #f3f5f9; border-color: #b0b8cc; box-shadow: 0 2px 8px rgba(30,40,90,.12); }

        /* SECTION PILL */
        .hs-sec-pill {
          display: inline-block;
          background: #eef4d4; color: #3f5a10;
          font-size: 11.5px; font-weight: 600;
          padding: 5px 13px; border-radius: 999px;
          margin-bottom: 8px;
        }

        /* SWIPER CAROUSEL */
        .hs-swiper-wrap { overflow: hidden; }
        .cs-swiper { overflow: visible !important; }
        .cs-swiper .swiper-slide { height: auto; }

        /* CARD */
        .hs-card {
          background: #fff; border-radius: 18px; overflow: hidden;
          box-shadow: 0 8px 30px rgba(30,40,90,.12); position: relative;
          transition: transform .2s, box-shadow .2s;
          height: 100%;
        }
        .hs-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(30,40,90,.18); }
        .hs-card > img { width: 100%; height: 166px; object-fit: cover; }
        .hs-tag { position: absolute; left: 12px; top: 12px; font-size: 11.5px; font-weight: 500; padding: 6px 13px; border-radius: 999px; }
        .t1 { background: #6a4df0; color: #fff; }
        .t2 { background: #d3f4e0; color: #166a3a; }
        .t3 { background: #eef4d4; color: #3f5a10; }
        .t4 { background: #dfe4ff; color: #2a3aa8; }
        .hs-heart {
          position: absolute; right: 12px; top: 12px;
          width: 30px; height: 30px; border-radius: 50%;
          background: #fff; display: grid; place-items: center;
          cursor: pointer; transition: transform .15s;
        }
        .hs-heart:hover { transform: scale(1.15); }
        .hs-body { padding: 12px 18px 18px; }
        .hs-price { font-size: 20px; font-weight: 700; }
        .hs-type { font-size: 15px; margin-top: 4px; }
        .hs-loc { font-size: 12px; color: #555; margin-top: 8px; display: flex; gap: 6px; align-items: center; }
        .hs-meta { display: flex; justify-content: space-between; margin-top: 16px; font-size: 12px; color: #555; border-top: 1px solid #f0f2f7; padding-top: 14px; }
        .hs-meta span { display: flex; gap: 7px; align-items: center; }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .hs-search-area { position: static; width: auto; margin: 20px 0; }
          .hs-cats {
            position: static;
            width: 100%;
            max-width: 580px;
            margin: 24px auto 0;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            transform: none;
            perspective: none;
            justify-content: center;
          }
          .hs-cat {
            transform: none;
            width: 100%;
            height: 100%;
            min-width: 0;
            padding: 4px;
          }
          .hs-cat:hover { transform: translateY(-4px); box-shadow: none; }
          .hs-cat img { height: 200px; }
          .hs-hero { height: auto; padding-bottom: 40px; }
          .hs-hero-curve { display: none; }
          .hs-grid { grid-template-columns: repeat(2,1fr); }
          .hs-sec-r { margin-right: 0; }
          .hs-menu { display: none; }
          .hs-h1 { font-size: 44px; }
          .hs-bar { flex-wrap: wrap; }
        }
        @media (max-width: 900px) {
          .hs-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            padding: 14px;
            border-radius: 0 20px 20px 20px;
          }
          .hs-field.grow {
            width: 100%;
            min-width: 0;
          }
          .hs-dropdowns-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            width: 100%;
          }
          .hs-dropdown-wrap {
            width: 100%;
            flex: 1;
          }
          .hs-dropdown-popover {
            min-width: 180px;
          }
          .hs-go {
            width: 100%;
            height: 48px;
            font-size: 14px;
            border-radius: 12px;
          }
        }
        @media (max-width: 600px) {
          .hs-grid { grid-template-columns: 1fr; }
          .hs-h1 { font-size: 32px; }
          .hs-search-area {
            position: static;
            width: 100%;
            max-width: 100%;
            margin: 16px 0 0;
          }
          .hs-bar {
            border-radius: 0 16px 16px 16px;
            padding: 10px;
          }
          .hs-dropdown-btn {
            padding: 0 8px;
            height: 46px;
          }
          .hs-dropdown-icon {
            width: 24px;
            height: 24px;
          }
          .hs-dropdown-tag {
            font-size: 8.5px;
          }
          .hs-dropdown-val {
            font-size: 11px;
          }
          .hs-dropdown-popover {
            left: 0;
            right: auto;
            max-width: 90vw;
          }
          #wrap-hs-dropdown-budget .hs-dropdown-popover {
            left: auto;
            right: 0;
          }
          .hs-cats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            width: 100%;
            max-width: 100%;
            margin: 18px 0 0;
          }
          .hs-cat {
            width: 100%;
            max-width: none;
            padding: 4px 5px 8px;
            border-radius: 12px;
          }
          .hs-cat img {
            height: 200px;
            border-radius: 8px;
          }
          .hs-cat-body {
            padding: 6px 2px 0;
          }
          .hs-cat b {
            font-size: 11px;
            line-height: 1.2;
            word-break: break-word;
          }
          .hs-cat small {
            font-size: 9.5px;
          }
        }
        @media (max-width: 380px) {
          .hs-cats { gap: 6px; }
          .hs-cat { padding: 3px 4px 6px; }
          .hs-cat img { height: 200px; }
          .hs-cat b { font-size: 10px; }
          .hs-cat small { font-size: 8.5px; }
        }
      `}</style>

      <div className="hs-root">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="hs-hero">

          <div className="hs-wrap">

            {/* HERO COPY */}
            {/* <div className="hs-hero-top">
              <span className="hs-pill">Find Your Perfect Place</span>
              <span className="hs-trust">
                <span className="hs-trust-dot" />
                Trusted by 1M+ home seekers
              </span>
            </div> */}

            <div className="hs-hero-text-fog">
              <h1 className="hs-h1">
                Discover a Better<br />Way to Find <span>Home</span>
              </h1>

              <p className="hs-lead">
                Explore verified properties, compare prices, and find your dream home with ease.
                From apartments to villas, we&apos;ve got you covered.
              </p>
            </div>

            {/* SEARCH */}
            <div className="hs-search-area" ref={searchWrapRef}>
              <div className="hs-tabs">
                {SEARCH_TABS.map((tab, i) => (
                  <button
                    key={tab}
                    type="button"
                    className={activeTab === i ? "on" : ""}
                    onClick={() => setActiveTab(i)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="hs-bar">
                <div className="hs-field grow">
                  <IconSearch />
                  <input
                    type="text"
                    className="hs-search-input"
                    placeholder="Search by city, locality, project or builder..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                  {query && (
                    <button
                      type="button"
                      className="hs-clear-btn"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="hs-dropdowns-group">
                  <SearchDropdown
                    id="hs-dropdown-type"
                    icon={<IconHome />}
                    label="Property Type"
                    value={propertyType}
                    options={PROPERTY_TYPE_OPTIONS}
                    isOpen={openDropdown === "type"}
                    onToggle={() => setOpenDropdown((prev) => (prev === "type" ? null : "type"))}
                    onSelect={(val) => {
                      setPropertyType(val);
                      setOpenDropdown(null);
                    }}
                  />

                  <SearchDropdown
                    id="hs-dropdown-budget"
                    icon={<IconBudget />}
                    label="Budget"
                    value={budget}
                    options={BUDGET_OPTIONS}
                    isOpen={openDropdown === "budget"}
                    onToggle={() => setOpenDropdown((prev) => (prev === "budget" ? null : "budget"))}
                    onSelect={(val) => {
                      setBudget(val);
                      setOpenDropdown(null);
                    }}
                  />
                </div>

                <button type="button" className="hs-go" onClick={() => handleSearch()}>Search</button>

                {/* Live debounced suggestions popup */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="hs-sugg-box">
                    {suggestions.map((p) => (
                      <Link
                        key={p.id}
                        href={`/property/${p.slug}`}
                        className="hs-sugg-item"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div>
                          <div className="hs-sugg-title">{p.projectName || p.name}</div>
                          <div className="hs-sugg-sub">{p.config} • {p.locality}</div>
                        </div>
                        <div className="hs-sugg-price">{p.priceFrom || p.priceLabel}</div>
                      </Link>
                    ))}
                    <button
                      type="button"
                      className="hs-sugg-footer"
                      onClick={() => handleSearch()}
                    >
                      View all results for &ldquo;{query}&rdquo; in Listings →
                    </button>
                  </div>
                )}
              </div>

              <div className="hs-popular">
                Popular Searches:
                {POPULAR_SEARCHES.map((s,i) => (
                  <Link key={s.label+i} href={s.href}>{s.label}</Link>
                ))}
              </div>
            </div>

            {/* CATEGORY TILT CARDS */}
            <div className="hs-cats">
              {CATEGORY_CARDS.map((c, i) => (
                <div className="hs-cat" key={c.title+i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt={c.title} />
                  <div className="hs-cat-body">
                    <b>{c.title}</b>
                    <small>{c.sub}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hs-hero-curve" />
        </section>


        {/* ── FEATURES + FEATURED ──────────────────────────────────────── */}
        <div className="hs-wrap hs-features-section">
          {/* FEATURES */}
          <div className="hs-features">
            {FEATURES.map((f, i) => (
              <div className="hs-feat" key={i}>
                <div className="hs-ic" style={{ background: f.bg }}>{f.icon}</div>
                <div>
                  <b>{f.title}</b>
                  {/* <small>{f.sub}</small> */}
                </div>
              </div>
            ))}
          </div>

          <PropertyCarousel properties={PROPERTIES} />
          
        {/* ── STATS ────────────────────────────────────────────────────── */}
        <StatsBanner />
        <ImageMarquee />
        </div>
      </div>
    </>
  );
}
