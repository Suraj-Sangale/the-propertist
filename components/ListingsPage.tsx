"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const LOCALITIES = [
  "All Localities",
  "Kandivali East",
  "Jokhandwala",
  "Andheri West",
  "Bandra West",
  "Powai",
  "Malad West",
  "Borivali West",
  "Goregaon West",
];

const CONFIGURATIONS = [
  "All BHK",
  "1 BHK",
  "2 BHK",
  "2 & 3 BHK",
  "3 BHK",
  "3 & 4 BHK",
  "4 BHK",
  "4 & 5 BHK",
  "5 BHK",
];

const STATUS_OPTIONS = [
  "Any Status",
  "Ready to Move",
  "Under Construction",
  "New Launch",
  "Upcoming",
];

const DEVELOPERS = [
  "All Developers",
  "Kalpataru",
  "Godrej Properties",
  "Lodha Group",
  "Oberoi Realty",
  "Rustomjee",
];

const ALL_PROPERTIES = [
  {
    id: 1,
    name: "KALPATARU VIAN",
    projectName: "Kalpataru Vian",
    developer: "KALPATARU LIMITED",
    locality: "Jokhandwala",
    locality_label: "JOKHANDWALA",
    config: "3, 4 & 4.5 BHK",
    config_label: "3, 4 & 4.5 BHK in KALPATARU VIAN",
    area: "1116 – 2688 sq.ft",
    beds: "3, 4 & 4.5 BHK",
    priceFrom: "₹ 4.95 Cr.+++",
    priceLabel: "From ₹4.95 Cr.*",
    status: "Under Construction",
    mode: "buy",
    verified: true,
    rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: [
      "Expansive Open Views",
      "Premium Lifestyle Amenities",
      "Excellent Connectivity",
      "2, 3, 4 & 5 BHK Lavish Residences",
    ],
  },
  {
    id: 2,
    name: "KALPATARU VIENTA",
    projectName: "Kalpataru Vienta",
    developer: "KALPATARU LIMITED",
    locality: "Kandivali East",
    locality_label: "KANDIVALI EAST",
    config: "2, 3 & 4.5 BHK",
    config_label: "2, 3 & 4.5 BHK Duplex in KALPATARU VIENTA",
    area: "1075 – 1689 sq.ft",
    beds: "2, 3 & 4.5 BHK Duplex",
    priceFrom: "₹ 3.82 Cr.++",
    priceLabel: "From ₹3.82 Cr.++",
    status: "Under Construction",
    mode: "buy",
    verified: true,
    rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: [
      "Expansive Open Views",
      "Premium Lifestyle Amenities",
      "Excellent Connectivity",
      "2, 3 & 4.5 BHK Duplex Residences",
    ],
  },
  {
    id: 3,
    name: "GODREJ RESERVE",
    projectName: "Godrej Reserve",
    developer: "GODREJ PROPERTIES",
    locality: "Kandivali East",
    locality_label: "KANDIVALI EAST",
    config: "3 & 4 BHK",
    config_label: "3 & 4 BHK in GODREJ RESERVE",
    area: "1470 – 2030 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 5.90 Cr.*",
    priceLabel: "From ₹5.90 Cr.* All Incl.",
    status: "New Launch",
    mode: "buy",
    verified: true,
    rera: true,
    badge: "A NEW BENCHMARK IN WESTERN SUBURBS" as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: [
      "Expansive Open Views",
      "Premium Lifestyle Amenities",
      "Excellent Connectivity",
      "3 & 4 BHK Luxury Residences",
    ],
  },
  {
    id: 4,
    name: "OBEROI SKY",
    projectName: "Oberoi Sky Heights",
    developer: "OBEROI REALTY",
    locality: "Goregaon West",
    locality_label: "GOREGAON WEST",
    config: "3 & 4 BHK",
    config_label: "3 & 4 BHK in OBEROI SKY",
    area: "1350 – 2450 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 6.20 Cr.*",
    priceLabel: "From ₹6.20 Cr.*",
    status: "Under Construction",
    mode: "buy",
    verified: true,
    rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: [
      "Panoramic City Views",
      "World-Class Amenities",
      "Metro Connectivity",
      "3 & 4 BHK Premium Homes",
    ],
  },
  {
    id: 5,
    name: "LODHA BELLAVISTA",
    projectName: "Lodha Bellavista",
    developer: "LODHA GROUP",
    locality: "Powai",
    locality_label: "POWAI",
    config: "2 & 3 BHK",
    config_label: "2 & 3 BHK in LODHA BELLAVISTA",
    area: "890 – 1680 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.85 Cr.*",
    priceLabel: "From ₹2.85 Cr.*",
    status: "Ready to Move",
    mode: "buy",
    verified: true,
    rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: [
      "Lakeside Living",
      "Premium Club Amenities",
      "Strategic Location",
      "2 & 3 BHK Spacious Homes",
    ],
  },
  {
    id: 6,
    name: "RUSTOMJEE ELANZA",
    projectName: "Rustomjee Elanza",
    developer: "RUSTOMJEE",
    locality: "Malad West",
    locality_label: "MALAD WEST",
    config: "2 BHK",
    config_label: "2 BHK in RUSTOMJEE ELANZA",
    area: "780 – 1250 sq.ft",
    beds: "2 BHK",
    priceFrom: "₹ 1.95 Cr.*",
    priceLabel: "From ₹1.95 Cr.*",
    status: "New Launch",
    mode: "buy",
    verified: true,
    rera: true,
    badge: "EARLY BIRD OFFER" as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: [
      "Modern Architecture",
      "Green Spaces",
      "Premium Fittings",
      "2 BHK Smart Homes",
    ],
  },
  {
    id: 7,
    name: "GODREJ PRIME",
    projectName: "Godrej Prime",
    developer: "GODREJ PROPERTIES",
    locality: "Bandra West",
    locality_label: "BANDRA WEST",
    config: "3 BHK",
    config_label: "3 BHK in GODREJ PRIME",
    area: "1200 – 1800 sq.ft",
    beds: "3 BHK",
    priceFrom: "₹ 4.50 Cr.*",
    priceLabel: "From ₹4.50 Cr.*",
    status: "Under Construction",
    mode: "rent",
    verified: true,
    rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: [
      "Sea-facing Views",
      "Luxury Club House",
      "Vaastu Compliant",
      "3 BHK Spacious Flats",
    ],
  },
  {
    id: 8,
    name: "KALPATARU AURA",
    projectName: "Kalpataru Aura",
    developer: "KALPATARU LIMITED",
    locality: "Andheri West",
    locality_label: "ANDHERI WEST",
    config: "1 BHK",
    config_label: "1 BHK in KALPATARU AURA",
    area: "540 – 750 sq.ft",
    beds: "1 BHK",
    priceFrom: "₹ 1.20 Cr.*",
    priceLabel: "From ₹1.20 Cr.*",
    status: "Ready to Move",
    mode: "rent",
    verified: true,
    rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: [
      "Compact & Smart Design",
      "Excellent Connectivity",
      "Premium Interiors",
      "1 BHK Ready Homes",
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function matchConfig(propConfig: string, filterConfig: string): boolean {
  if (filterConfig === "All BHK") return true;
  const filterBhks = filterConfig.toLowerCase().replace(/\s/g, "").split("&");
  const prop = propConfig.toLowerCase().replace(/\s/g, "");
  return filterBhks.some((f) => prop.includes(f));
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg className="lp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "#e74c3c" : "none"} stroke={filled ? "#e74c3c" : "#666"} strokeWidth={1.8} style={{ width: 18, height: 18 }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#22c55e" style={{ width: 14, height: 14 }}>
      <path d="M12 2l2.4 4.8 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.4.9-5.4L4.2 7.6l5.4-.8z" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={1.7} style={{ width: 13, height: 13 }}>
      <rect x="3" y="3" width="18" height="18" rx="1" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={1.7} style={{ width: 13, height: 13 }}>
      <path d="M3 20V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12" />
      <path d="M3 14h18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={1.8} style={{ width: 13, height: 13, flexShrink: 0 }}>
      <path d="M12 21s-8-5.5-8-11a8 8 0 1 1 16 0c0 5.5-8 11-8 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function RERAIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth={1.7} style={{ width: 14, height: 14 }}>
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "#c8a84b" : "none"} stroke={active ? "#c8a84b" : "#999"} strokeWidth={1.6} style={{ width: 18, height: 18 }}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={active ? "#c8a84b" : "#999"} strokeWidth={1.6} style={{ width: 18, height: 18 }}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SelectFilter({ id, label, options, value, onChange }: {
  id: string; label: string; options: string[];
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="lp-filter-group">
      <label htmlFor={id} className="lp-filter-label">{label}</label>
      <div className="lp-select-wrap">
        <select id={id} className="lp-select" value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronIcon />
      </div>
    </div>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────────

type Property = typeof ALL_PROPERTIES[0];

function PropertyCard({ property, view }: { property: Property; view: "grid" | "list" }) {
  const [hearted, setHearted] = useState(false);

  const cardBody = (
    <div className="lp-card-body">
      <div className="lp-card-title">{property.config_label}</div>
      <div className="lp-card-price-main">{property.priceFrom} Onwards</div>
      <div className="lp-card-loc"><PinIcon />{property.projectName}</div>
      <div className="lp-card-meta">
        <span><AreaIcon />{property.area}</span>
        <span><BedIcon />{property.beds}</span>
      </div>
      <div className="lp-card-footer">
        <div className="lp-badges-row">
          {property.verified && <span className="lp-badge lp-badge--green"><VerifiedIcon /> Verified Project</span>}
          {property.rera && <span className="lp-badge lp-badge--outline"><RERAIcon /> RERA Approved</span>}
        </div>
        <button className="lp-view-btn">View Details <span>→</span></button>
      </div>
    </div>
  );

  return (
    <article className={`lp-card${view === "list" ? " lp-card--list" : ""}`}>
      <div className={`lp-card-img-wrap${view === "list" ? " lp-card-img-wrap--list" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={property.image} alt={property.name} className="lp-card-img" />
        <button className="lp-heart" onClick={() => setHearted((h) => !h)} aria-label="Save property">
          <HeartIcon filled={hearted} />
        </button>

        {/* Overlay: features left, name+price right */}
        <div className="lp-card-overlay">
          <div className="lp-card-features">
            {property.features.map((f) => (
              <div key={f} className="lp-feat-item">
                <span className="lp-feat-dot" />
                {f}
              </div>
            ))}
          </div>
          <div className="lp-card-name-area">
            <div className="lp-card-name">{property.name}</div>
            <div className="lp-card-locality">{property.locality_label}</div>
            <div className="lp-card-price-badge">{property.priceLabel}</div>
          </div>
        </div>

        {property.badge && <div className="lp-card-badge-ribbon">{property.badge}</div>}
        <div className="lp-dev-tag">{property.developer}</div>
      </div>
      {cardBody}
    </article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type DrawerPanel = "view" | "sort" | "filter" | null;

export default function ListingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const mode = searchParams.get("mode") ?? "buy";
  const locality = searchParams.get("locality") ?? "All Localities";
  const config = searchParams.get("config") ?? "All BHK";
  const status = searchParams.get("status") ?? "Any Status";
  const developer = searchParams.get("developer") ?? "All Developers";
  const sort = searchParams.get("sort") ?? "Relevance";
  const view = (searchParams.get("view") ?? "grid") as "grid" | "list";

  const [pendingLocality, setPendingLocality] = useState(locality);
  const [pendingConfig, setPendingConfig] = useState(config);
  const [pendingDeveloper, setPendingDeveloper] = useState(developer);
  const [pendingStatus, setPendingStatus] = useState(status);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [drawer, setDrawer] = useState<DrawerPanel>(null);
  const [isClosing, setIsClosing] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => { if (v) params.set(k, v); else params.delete(k); });
      startTransition(() => { router.replace(`${pathname}?${params.toString()}`, { scroll: false }); });
    },
    [searchParams, pathname, router]
  );

  // Trigger close animation then unmount
  const closeDrawer = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setDrawer(null);
      setIsClosing(false);
    }, 320);
  }, []);

  const openDrawer = useCallback((panel: DrawerPanel) => {
    if (drawer === panel) {
      closeDrawer();
    } else {
      setIsClosing(false);
      setDrawer(panel);
    }
  }, [drawer, closeDrawer]);

  const applyFilters = () => {
    updateParams({ locality: pendingLocality, config: pendingConfig, developer: pendingDeveloper, status: pendingStatus, q: search });
    closeDrawer();
  };

  // count active filters for badge
  const activeFilterCount = [
    locality !== "All Localities",
    config !== "All BHK",
    developer !== "All Developers",
    status !== "Any Status",
  ].filter(Boolean).length;

  const filtered = ALL_PROPERTIES.filter((p) => {
    if (p.mode !== mode) return false;
    if (locality !== "All Localities" && p.locality !== locality) return false;
    if (!matchConfig(p.config, config)) return false;
    if (status !== "Any Status" && p.status !== status) return false;
    if (developer !== "All Developers" && !p.developer.toLowerCase().includes(developer.toLowerCase().split(" ")[0])) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.locality.toLowerCase().includes(search.toLowerCase()) && !p.developer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap');

        .lp-root { font-family: 'Inter', sans-serif; background: #f3f4f6; min-height: 100vh; color: #1a1a2e; }
        .lp-root * { box-sizing: border-box; }

        /* HERO */
        .lp-hero { background: #0a0e1e; position: relative; overflow: hidden; padding: 56px 0 0; }
        .lp-hero-bg { position: absolute; inset: 0; background-image: url('/images/heroBg.png'); background-size: cover; background-position: center top; opacity: 0.18; }
        .lp-hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(8,12,28,0.97) 0%, rgba(10,18,38,0.82) 55%, rgba(0,0,0,0.55) 100%); }
        .lp-hero-inner { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; padding: 0 32px 44px; text-align: center; }
        .lp-hero-eyebrow { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 22px; }
        .lp-hero-eyebrow-line { width: 52px; height: 1px; background: linear-gradient(90deg, transparent, #c8a84b); }
        .lp-hero-eyebrow-line:last-child { background: linear-gradient(90deg, #c8a84b, transparent); }
        .lp-hero-eyebrow-text { font-size: 10.5px; font-weight: 700; letter-spacing: 3.5px; color: #c8a84b; text-transform: uppercase; }
        .lp-hero-h1 { font-size: clamp(30px, 4.2vw, 54px); font-weight: 800; color: #fff; line-height: 1.08; margin: 0 0 18px; letter-spacing: -1px; }
        .lp-hero-h1 em { font-family: 'Playfair Display', serif; font-style: italic; color: #c8a84b; }
        .lp-hero-sub { color: rgba(255,255,255,0.65); font-size: 15px; line-height: 1.7; max-width: 500px; margin: 0 auto 36px; }
        .lp-trust-row { display: flex; justify-content: center; gap: 0; flex-wrap: wrap; }
        .lp-trust-item { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.8); font-size: 13px; padding: 0 36px; }
        .lp-trust-icon { width: 40px; height: 40px; border-radius: 50%; background: rgba(200,168,75,0.15); border: 1px solid rgba(200,168,75,0.35); display: grid; place-items: center; flex-shrink: 0; }
        .lp-trust-icon svg { width: 20px; height: 20px; color: #c8a84b; }
        .lp-trust-text b { display: block; font-size: 13.5px; font-weight: 600; color: #fff; }
        .lp-trust-text span { font-size: 11.5px; color: rgba(255,255,255,0.5); }
        .lp-trust-divider { width: 1px; height: 44px; background: rgba(255,255,255,0.1); }

        /* FILTER BAR */
        .lp-filter-bar-wrap { max-width: 1280px; margin: -26px auto 0; padding: 0 32px; position: relative; z-index: 10; }
        .lp-filter-bar { background: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.13), 0 1px 6px rgba(0,0,0,0.05); padding: 18px 22px; display: flex; align-items: flex-end; gap: 14px; flex-wrap: wrap; }
        .lp-search-field { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 10px; background: #f8f9fb; border: 1.5px solid #eaecf0; border-radius: 10px; height: 48px; padding: 0 14px; font-size: 13px; color: #555; transition: border-color .15s; }
        .lp-search-field:focus-within { border-color: #c8a84b; }
        .lp-search-field input { flex: 1; border: 0; background: transparent; outline: none; font: inherit; color: #222; }
        .lp-search-field svg { width: 16px; height: 16px; color: #aaa; flex-shrink: 0; }
        .lp-filter-group { display: flex; flex-direction: column; gap: 4px; }
        .lp-filter-label { font-size: 9.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #aaa; padding-left: 2px; }
        .lp-select-wrap { position: relative; }
        .lp-select { appearance: none; -webkit-appearance: none; background: #f8f9fb; border: 1.5px solid #eaecf0; border-radius: 10px; height: 48px; padding: 0 36px 0 14px; font: 500 13px 'Inter'; color: #222; cursor: pointer; width: 100%; outline: none; transition: border-color .15s; }
        .lp-select:focus { border-color: #c8a84b; }
        .lp-chevron { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: #aaa; pointer-events: none; }
        .lp-apply-btn { height: 48px; padding: 0 28px; background: #c8a84b; color: #fff; border: 0; border-radius: 10px; font: 700 13.5px 'Inter'; cursor: pointer; display: flex; align-items: center; gap: 8px; white-space: nowrap; transition: background .15s, transform .1s, box-shadow .15s; flex-shrink: 0; box-shadow: 0 4px 14px rgba(200,168,75,0.35); }
        .lp-apply-btn:hover { background: #b8963c; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,168,75,0.45); }
        .lp-apply-btn:active { transform: translateY(0); }

        /* BUY / RENT TOGGLE */
        .lp-mode-toggle { display: inline-flex; border: 1.5px solid #eaecf0; border-radius: 10px; overflow: hidden; background: #f8f9fb; height: 48px; align-self: flex-end; }
        .lp-mode-btn { padding: 0 24px; font: 600 13px 'Inter'; border: 0; background: transparent; cursor: pointer; color: #888; transition: background .15s, color .15s; }
        .lp-mode-btn.active { background: #0d1b2a; color: #fff; }

        /* RESULTS HEADER */
        .lp-results-header { max-width: 1280px; margin: 30px auto 16px; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .lp-count { font-size: 14.5px; color: #666; }
        .lp-count strong { color: #1a1a2e; font-weight: 800; font-size: 17px; }
        .lp-sort-row { display: flex; align-items: center; gap: 10px; }
        .lp-sort-label { font-size: 13px; color: #999; }
        .lp-sort-select { appearance: none; -webkit-appearance: none; background: #fff; border: 1.5px solid #eaecf0; border-radius: 8px; height: 36px; padding: 0 14px; font: 500 13px 'Inter'; color: #222; cursor: pointer; outline: none; }
        .lp-view-toggle { display: flex; gap: 4px; }
        .lp-view-btn-icon { width: 36px; height: 36px; border-radius: 8px; border: 1.5px solid #eaecf0; background: #fff; display: grid; place-items: center; cursor: pointer; transition: border-color .15s, background .15s; }
        .lp-view-btn-icon.active { border-color: #c8a84b; background: #fdf8ec; }

        /* PROPERTY GRID */
        .lp-grid-wrap { max-width: 1280px; margin: 0 auto 70px; padding: 0 32px; }
        .lp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
        .lp-grid--list { grid-template-columns: 1fr; }

        /* PROPERTY CARD */
        .lp-card { background: #fff; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 14px rgba(0,0,0,0.07); transition: transform .28s cubic-bezier(0.2,0.8,0.2,1), box-shadow .28s; display: flex; flex-direction: column; }
        .lp-card:hover { transform: translateY(-7px); box-shadow: 0 18px 50px rgba(0,0,0,0.14); }
        .lp-card--list { flex-direction: row; }
        .lp-card-img-wrap { position: relative; overflow: hidden; height: 235px; flex-shrink: 0; }
        .lp-card-img-wrap--list { width: 360px; height: auto; }
        .lp-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .45s; }
        .lp-card:hover .lp-card-img { transform: scale(1.05); }
        .lp-heart { position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.93); border: 0; cursor: pointer; display: grid; place-items: center; z-index: 3; box-shadow: 0 2px 10px rgba(0,0,0,0.15); transition: transform .15s; }
        .lp-heart:hover { transform: scale(1.12); }

        /* Card image overlay */
        .lp-card-overlay { position: absolute; inset: 0; z-index: 2; display: flex; align-items: stretch; padding: 14px; background: linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 45%, transparent 70%); }
        .lp-card-features { display: flex; flex-direction: column; gap: 5px; flex: 1; padding-top: 2px; }
        .lp-feat-item { display: flex; align-items: flex-start; gap: 6px; font-size: 10px; color: rgba(255,255,255,0.9); line-height: 1.35; }
        .lp-feat-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; flex-shrink: 0; margin-top: 3px; }
        .lp-card-name-area { display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; flex-shrink: 0; max-width: 50%; }
        .lp-card-name { font-size: 21px; font-weight: 900; color: #fff; text-align: right; line-height: 1.08; text-shadow: 0 2px 14px rgba(0,0,0,0.7); letter-spacing: -0.3px; }
        .lp-card-locality { font-size: 10px; font-weight: 700; letter-spacing: 1.8px; color: rgba(255,255,255,0.65); text-align: right; margin-top: 4px; }
        .lp-card-price-badge { margin-top: 8px; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.28); border-radius: 6px; padding: 4px 10px; font-size: 11.5px; font-weight: 700; color: #fff; backdrop-filter: blur(6px); text-align: right; white-space: nowrap; }
        .lp-card-badge-ribbon { position: absolute; bottom: 38px; left: 0; right: 0; z-index: 3; background: #1a1a7e; color: #fff; font-size: 9px; font-weight: 800; letter-spacing: 1.2px; text-align: center; padding: 5px 10px; text-transform: uppercase; }
        .lp-dev-tag { position: absolute; bottom: 0; left: 0; right: 0; z-index: 3; background: rgba(0,0,0,0.85); color: rgba(255,255,255,0.85); font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 7px 14px; }

        /* Card body */
        .lp-card-body { padding: 16px 18px 20px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .lp-card-title { font-size: 13.5px; font-weight: 600; color: #1a1a2e; line-height: 1.4; }
        .lp-card-price-main { font-size: 18px; font-weight: 800; color: #c8a84b; line-height: 1.2; margin-top: 2px; }
        .lp-card-loc { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #777; margin-top: 2px; }
        .lp-card-meta { display: flex; gap: 18px; margin-top: 8px; padding-top: 10px; border-top: 1px solid #f0f2f7; flex-wrap: wrap; }
        .lp-card-meta span { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #666; }
        .lp-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; flex-wrap: wrap; gap: 8px; }
        .lp-badges-row { display: flex; gap: 7px; flex-wrap: wrap; }
        .lp-badge { display: flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 500; padding: 4px 8px; border-radius: 6px; white-space: nowrap; }
        .lp-badge--green { background: #f0fdf4; color: #15803d; }
        .lp-badge--outline { background: #f8fafc; color: #555; border: 1px solid #e2e8f0; }
        .lp-view-btn { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 8px; border: 1.5px solid #1a1a2e; background: #fff; font: 600 12px 'Inter'; color: #1a1a2e; cursor: pointer; transition: background .15s, color .15s; white-space: nowrap; }
        .lp-view-btn:hover { background: #1a1a2e; color: #fff; }

        /* EMPTY STATE */
        .lp-empty { grid-column: 1 / -1; text-align: center; padding: 80px 24px; }
        .lp-empty-icon { font-size: 52px; margin-bottom: 16px; }
        .lp-empty h3 { font-size: 20px; font-weight: 700; color: #333; margin-bottom: 8px; }
        .lp-empty p { color: #888; font-size: 14px; }

        /* DESKTOP: hide apply btn */
        .lp-apply-btn { display: none; }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .lp-grid { grid-template-columns: repeat(2, 1fr); }
          .lp-card--list { flex-direction: column; }
          .lp-card-img-wrap--list { width: 100%; height: 235px; }
        }

        /* ── MOBILE (≤720px) ─────────────────────── */
        @media (max-width: 720px) {
          .lp-grid { grid-template-columns: 1fr; }
          .lp-hero-inner, .lp-results-header, .lp-grid-wrap { padding-left: 16px; padding-right: 16px; }
          .lp-filter-bar-wrap { display: none; }
          .lp-trust-divider { display: none; }
          .lp-trust-item { padding: 0 14px; }
          .lp-trust-row { gap: 8px 0; }
          .lp-grid-wrap { margin-bottom: 100px; }

          /* Sticky mobile footer toolbar */
          .lp-mob-toolbar {
            display: flex !important;
          }
          /* Bottom-sheet drawer */
          .lp-drawer-backdrop { display: block !important; }
          .lp-drawer { display: flex !important; }
        }

        /* ── MOBILE TOOLBAR ─────────────────────── */
        .lp-mob-toolbar {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
          background: #fff;
          border-top: 1px solid #e8eaed;
          box-shadow: 0 -4px 24px rgba(0,0,0,0.10);
          height: 64px;
        }
        .lp-mob-tab {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 2px;
          background: transparent; border: 0;
          cursor: pointer;
          padding: 10px 8px 8px;
          position: relative;
          transition: background .12s;
        }
        .lp-mob-tab:not(:last-child) { border-right: 1px solid #e8eaed; }
        .lp-mob-tab.active { background: #fdf8ec; }
        .lp-mob-tab-label {
          font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; color: #333;
          display: flex; align-items: center; gap: 3px;
        }
        .lp-mob-tab-label svg { width: 8px; height: 8px; color: #555; }
        .lp-mob-tab-sub {
          font-size: 11.5px; font-weight: 500; color: #1a88d4;
        }
        .lp-mob-tab-badge {
          position: absolute; top: 8px; right: calc(50% - 22px);
          min-width: 16px; height: 16px; border-radius: 999px;
          background: #c8a84b; color: #fff;
          font-size: 9px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
        }

        /* ── BOTTOM SHEET DRAWER ─────────────────── */
        .lp-drawer-backdrop {
          display: none;
          position: fixed; inset: 0; z-index: 300;
          background: rgba(0,0,0,0.45);
          animation: lpFadeIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }
        .lp-drawer-backdrop.closing {
          animation: lpFadeOut 0.3s cubic-bezier(0.4,0,1,1) both;
        }
        @keyframes lpFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lpFadeOut { from { opacity: 1; } to { opacity: 0; } }

        .lp-drawer {
          display: none;
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 301;
          height: 70%;
          background: #fff;
          border-radius: 20px 20px 0 0;
          flex-direction: column;
          overflow: hidden;
          /* Open: spring curve — feels physical */
          animation: lpSlideUp 0.42s cubic-bezier(0.16,1,0.3,1) both;
          will-change: transform;
        }
        .lp-drawer.closing {
          animation: lpSlideDown 0.32s cubic-bezier(0.4,0,0.6,1) both;
        }
        @keyframes lpSlideUp {
          from { transform: translateY(105%); }
          to   { transform: translateY(0); }
        }
        @keyframes lpSlideDown {
          from { transform: translateY(0); }
          to   { transform: translateY(105%); }
        }
        .lp-drawer-handle {
          width: 40px; height: 4px; border-radius: 99px;
          background: #d1d5db; margin: 12px auto 0;
          flex-shrink: 0;
        }
        .lp-drawer-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px 12px;
          border-bottom: 1px solid #f0f2f5;
          flex-shrink: 0;
        }
        .lp-drawer-title {
          font-size: 15px; font-weight: 700; color: #1a1a2e;
        }
        .lp-drawer-close {
          width: 30px; height: 30px; border-radius: 50%;
          background: #f3f4f6; border: 0; cursor: pointer;
          display: grid; place-items: center; color: #555;
          font-size: 16px; line-height: 1;
        }
        .lp-drawer-body {
          flex: 1; overflow-y: auto; padding: 16px 20px 24px;
        }
        /* Drawer option list */
        .lp-drawer-options { display: flex; flex-direction: column; gap: 6px; }
        .lp-drawer-opt {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px; border-radius: 12px;
          border: 1.5px solid #eaecf0; background: #fff;
          font: 500 14px 'Inter'; color: #333; cursor: pointer;
          transition: border-color .15s, background .15s;
        }
        .lp-drawer-opt.selected {
          border-color: #c8a84b; background: #fdf8ec; color: #1a1a2e; font-weight: 600;
        }
        .lp-drawer-opt-check {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid #d1d5db;
          display: grid; place-items: center; flex-shrink: 0;
        }
        .lp-drawer-opt.selected .lp-drawer-opt-check {
          border-color: #c8a84b; background: #c8a84b;
        }
        .lp-drawer-opt.selected .lp-drawer-opt-check::after {
          content: '';
          width: 5px; height: 9px;
          border-right: 2px solid #fff; border-bottom: 2px solid #fff;
          transform: rotate(45deg) translateY(-1px);
          display: block;
        }
        /* Drawer filter groups */
        .lp-drawer-group { margin-bottom: 20px; }
        .lp-drawer-group-label {
          font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; color: #aaa; margin-bottom: 10px;
        }
        .lp-drawer-chips {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .lp-drawer-chip {
          padding: 8px 16px; border-radius: 999px;
          border: 1.5px solid #eaecf0; background: #fff;
          font: 500 13px 'Inter'; color: #333; cursor: pointer;
          transition: border-color .12s, background .12s;
        }
        .lp-drawer-chip.selected {
          border-color: #c8a84b; background: #fdf8ec;
          color: #b8963c; font-weight: 600;
        }
        /* Drawer footer */
        .lp-drawer-foot {
          padding: 12px 20px 20px; flex-shrink: 0;
          border-top: 1px solid #f0f2f5;
          display: flex; gap: 10px;
        }
        .lp-drawer-reset {
          flex: 1; height: 48px; border-radius: 10px;
          border: 1.5px solid #ddd; background: #fff;
          font: 600 14px 'Inter'; color: #555; cursor: pointer;
        }
        .lp-drawer-apply {
          flex: 2; height: 48px; border-radius: 10px;
          border: 0; background: #c8a84b; color: #fff;
          font: 700 14px 'Inter'; cursor: pointer;
          box-shadow: 0 4px 14px rgba(200,168,75,.35);
        }
      `}</style>

      <div className="lp-root">
        {/* ── HERO ──────────────────────────────── */}
        <section className="lp-hero">
          <div className="lp-hero-bg" aria-hidden="true" />
          <div className="lp-hero-overlay" aria-hidden="true" />
          <div className="lp-hero-inner">
            <div className="lp-hero-eyebrow" aria-hidden="true">
              <div className="lp-hero-eyebrow-line" />
              <span className="lp-hero-eyebrow-text">The Propertist</span>
              <div className="lp-hero-eyebrow-line" />
            </div>
            <h1 className="lp-hero-h1">
              Verified ₹2 Crore+ Homes <em>in Mumbai</em>
            </h1>
            <p className="lp-hero-sub">
              Handpicked properties from Kalpataru, Godrej, Lodha, Oberoi &amp; more.<br />
              Zero brokerage for buyers.
            </p>
            <div className="lp-trust-row" role="list">
              <div className="lp-trust-item" role="listitem">
                <div className="lp-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="lp-trust-text">
                  <b>Verified Projects</b>
                  <span>RERA Approved</span>
                </div>
              </div>
              <div className="lp-trust-divider" aria-hidden="true" />
              <div className="lp-trust-item" role="listitem">
                <div className="lp-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="lp-trust-text">
                  <b>Trusted by 10,000+ Buyers</b>
                  <span>Across Mumbai</span>
                </div>
              </div>
              <div className="lp-trust-divider" aria-hidden="true" />
              <div className="lp-trust-item" role="listitem">
                <div className="lp-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                </div>
                <div className="lp-trust-text">
                  <b>Zero Brokerage</b>
                  <span>Direct from Developers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FILTER BAR ────────────────────────── */}
        <div className="lp-filter-bar-wrap">
          <div className="lp-filter-bar" role="search">
            <div className="lp-mode-toggle" role="group" aria-label="Listing type">
              {(["buy", "rent"] as const).map((m) => (
                <button
                  key={m}
                  id={`toggle-${m}`}
                  className={`lp-mode-btn${mode === m ? " active" : ""}`}
                  onClick={() => updateParams({ mode: m })}
                >
                  {m === "buy" ? "Buy" : "Rent"}
                </button>
              ))}
            </div>

            <div className="lp-search-field">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
              </svg>
              <input
                id="lp-search"
                type="text"
                placeholder="Search by project, locality or developer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>

            <SelectFilter id="lp-locality" label="Locality" options={LOCALITIES} value={pendingLocality} onChange={setPendingLocality} />
            <SelectFilter id="lp-config" label="Configuration" options={CONFIGURATIONS} value={pendingConfig} onChange={setPendingConfig} />
            <SelectFilter id="lp-developer" label="Developer" options={DEVELOPERS} value={pendingDeveloper} onChange={setPendingDeveloper} />
            <SelectFilter id="lp-status" label="Status" options={STATUS_OPTIONS} value={pendingStatus} onChange={setPendingStatus} />
          </div>
        </div>

        {/* ── RESULTS HEADER ─────────────────────── */}
        <div className="lp-results-header">
          <p className="lp-count">
            <strong>{filtered.length}</strong> properties found
          </p>
          <div className="lp-sort-row">
            <span className="lp-sort-label">Sort by</span>
            <select
              id="lp-sort"
              className="lp-sort-select"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
            >
              {["Relevance", "Price: Low to High", "Price: High to Low", "Newest First"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="lp-view-toggle">
              <button id="lp-view-grid" className={`lp-view-btn-icon${view === "grid" ? " active" : ""}`} onClick={() => updateParams({ view: "grid" })} aria-label="Grid view">
                <GridIcon active={view === "grid"} />
              </button>
              <button id="lp-view-list" className={`lp-view-btn-icon${view === "list" ? " active" : ""}`} onClick={() => updateParams({ view: "list" })} aria-label="List view">
                <ListIcon active={view === "list"} />
              </button>
            </div>
          </div>
        </div>

        {/* ── PROPERTY GRID ──────────────────────── */}
        <main className="lp-grid-wrap">
          <div className={`lp-grid${view === "list" ? " lp-grid--list" : ""}`}>
            {filtered.length === 0 ? (
              <div className="lp-empty">
                <div className="lp-empty-icon">🏡</div>
                <h3>No properties found</h3>
                <p>Try adjusting your filters or switch between Buy / Rent.</p>
              </div>
            ) : (
              filtered.map((p) => <PropertyCard key={p.id} property={p} view={view} />)
            )}
          </div>
        </main>

        {/* ── MOBILE STICKY TOOLBAR ─────────────── */}
        <nav className="lp-mob-toolbar" aria-label="Filter toolbar">
          {/* VIEW */}
          <button
            id="mob-tab-view"
            className={`lp-mob-tab${drawer === "view" ? " active" : ""}`}
            onClick={() => openDrawer("view")}
          >
            <span className="lp-mob-tab-label">
              VIEW
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m6 9 6 6 6-6" /></svg>
            </span>
            <span className="lp-mob-tab-sub">{view === "grid" ? "Grid View" : "List View"}</span>
          </button>
          {/* SORT */}
          <button
            id="mob-tab-sort"
            className={`lp-mob-tab${drawer === "sort" ? " active" : ""}`}
            onClick={() => openDrawer("sort")}
          >
            <span className="lp-mob-tab-label">
              SORT
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m6 9 6 6 6-6" /></svg>
            </span>
            <span className="lp-mob-tab-sub">{sort.split(":")[0].trim()}</span>
          </button>
          {/* FILTER */}
          <button
            id="mob-tab-filter"
            className={`lp-mob-tab${drawer === "filter" ? " active" : ""}`}
            onClick={() => openDrawer("filter")}
          >
            {activeFilterCount > 0 && (
              <span className="lp-mob-tab-badge">{activeFilterCount}</span>
            )}
            <span className="lp-mob-tab-label">
              FILTER
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m6 9 6 6 6-6" /></svg>
            </span>
            <span className="lp-mob-tab-sub">{activeFilterCount === 0 ? "0 applied" : `${activeFilterCount} applied`}</span>
          </button>
        </nav>

        {/* ── BOTTOM SHEET BACKDROP ─────────────── */}
        {drawer && (
          <div
            className={`lp-drawer-backdrop${isClosing ? " closing" : ""}`}
            onClick={closeDrawer}
            aria-hidden="true"
          />
        )}

        {/* ── BOTTOM SHEET DRAWER ───────────────── */}
        {drawer && (
          <div className={`lp-drawer${isClosing ? " closing" : ""}`} role="dialog" aria-modal="true" aria-label={`${drawer} options`}>
            <div className="lp-drawer-handle" />
            <div className="lp-drawer-head">
              <span className="lp-drawer-title">
                {drawer === "view" && "View"}
                {drawer === "sort" && "Sort By"}
                {drawer === "filter" && "Filters"}
              </span>
              <button className="lp-drawer-close" onClick={closeDrawer} aria-label="Close">✕</button>
            </div>

            <div className="lp-drawer-body">
              {/* VIEW PANEL */}
              {drawer === "view" && (
                <div className="lp-drawer-options">
                  {(["grid", "list"] as const).map((v) => (
                    <button
                      key={v}
                      className={`lp-drawer-opt${view === v ? " selected" : ""}`}
                      onClick={() => { updateParams({ view: v }); closeDrawer(); }}
                    >
                      {v === "grid" ? "Grid View" : "List View"}
                      <span className="lp-drawer-opt-check" />
                    </button>
                  ))}
                </div>
              )}

              {/* SORT PANEL */}
              {drawer === "sort" && (
                <div className="lp-drawer-options">
                  {["Relevance", "Price: Low to High", "Price: High to Low", "Newest First"].map((s) => (
                    <button
                      key={s}
                      className={`lp-drawer-opt${sort === s ? " selected" : ""}`}
                      onClick={() => { updateParams({ sort: s }); closeDrawer(); }}
                    >
                      {s}
                      <span className="lp-drawer-opt-check" />
                    </button>
                  ))}
                </div>
              )}

              {/* FILTER PANEL */}
              {drawer === "filter" && (
                <div>
                  <div className="lp-drawer-group">
                    <div className="lp-drawer-group-label">Locality</div>
                    <div className="lp-drawer-chips">
                      {LOCALITIES.map((loc) => (
                        <button
                          key={loc}
                          className={`lp-drawer-chip${pendingLocality === loc ? " selected" : ""}`}
                          onClick={() => setPendingLocality(loc)}
                        >{loc}</button>
                      ))}
                    </div>
                  </div>
                  <div className="lp-drawer-group">
                    <div className="lp-drawer-group-label">Configuration</div>
                    <div className="lp-drawer-chips">
                      {CONFIGURATIONS.map((cfg) => (
                        <button
                          key={cfg}
                          className={`lp-drawer-chip${pendingConfig === cfg ? " selected" : ""}`}
                          onClick={() => setPendingConfig(cfg)}
                        >{cfg}</button>
                      ))}
                    </div>
                  </div>
                  <div className="lp-drawer-group">
                    <div className="lp-drawer-group-label">Status</div>
                    <div className="lp-drawer-chips">
                      {STATUS_OPTIONS.map((st) => (
                        <button
                          key={st}
                          className={`lp-drawer-chip${pendingStatus === st ? " selected" : ""}`}
                          onClick={() => setPendingStatus(st)}
                        >{st}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {drawer === "filter" && (
              <div className="lp-drawer-foot">
                <button className="lp-drawer-reset" onClick={() => {
                  setPendingLocality("All Localities");
                  setPendingConfig("All BHK");
                  setPendingStatus("Any Status");
                  setPendingDeveloper("All Developers");
                }}>Reset</button>
                <button className="lp-drawer-apply" onClick={applyFilters}>Apply Filters</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
