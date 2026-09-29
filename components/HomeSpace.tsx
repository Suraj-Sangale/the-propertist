"use client";

import { useState } from "react";
import StatsBanner from "./StatsBanner";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Buy", "Rent", "Projects", "Agents", "Services ⌄"];

const SEARCH_TABS = ["Buy", "Rent", "New Projects"];

const POPULAR_SEARCHES = [
  { label: "2 BHK in Mumbai", href: "#" },
  { label: "3 BHK in Pune", href: "#" },
  { label: "Villas in Bangalore", href: "#" },
  { label: "Commercial in Delhi", href: "#" },
];

const CATEGORY_CARDS = [
  {
    src: "/images/projects/Untitled-design-18.webp",
    title: "Luxury Apartments",
    sub: "In Mumbai",
  },
  {
    src: "/images/projects/Untitled-design-19.webp",
    title: "Independent Houses",
    sub: "In Bangalore",
  },
  {
    src: "/images/projects/Untitled-design-20.webp",
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

const PROPERTIES = [
  {
    tag: "Featured",
    tagClass: "t1",
    price: "₹ 1.25 Cr",
    type: "2 BHK Apartment",
    loc: "Thane West, Mumbai",
    area: "1200 sq.ft",
    beds: "2 Beds",
    baths: "2 Baths",
    imgLink:"/images/projects/Untitled-design-18.webp"
  },
  {
    tag: "New",
    tagClass: "t2",
    price: "₹ 3.2 Cr",
    type: "4 BHK Villa",
    loc: "Whitefield, Bangalore",
    area: "2400 sq.ft",
    beds: "4 Beds",
    baths: "4 Baths",
    imgLink:"/images/projects/Untitled-design-19.webp"

  },
  {
    tag: "Ready to Move",
    tagClass: "t3",
    price: "₹ 85 Lakh",
    type: "3 BHK Apartment",
    loc: "Wakad, Pune",
    area: "1450 sq.ft",
    beds: "3 Beds",
    baths: "3 Baths",
    imgLink:"/images/projects/Untitled-design-20.webp"
  },
  {
    tag: "High Rental Yield",
    tagClass: "t4",
    price: "₹ 2.1 Cr",
    type: "3 BHK Apartment",
    loc: "Sector 62, Gurgaon",
    area: "1800 sq.ft",
    beds: "3 Beds",
    baths: "3 Baths",
    imgLink:"/images/projects/Untitled-design-18.webp"

  },
];


// ─── SVG helpers ─────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "#222", fill: "none", strokeWidth: 2 }}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

const IconHome = () => (
  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "#222", stroke: "none" }}>
    <path d="M3 11 12 3l9 8v10H3z" />
  </svg>
);

const IconBudget = () => (
  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "#222", fill: "none", strokeWidth: 2 }}>
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomeSpace() {
  const [activeTab, setActiveTab] = useState(0);

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
        .hs-hero { position: relative; height: 640px; }
        .hs-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
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
        .hs-hero .hs-wrap { z-index: 3; }

        /* NAV */
        .hs-nav { display: flex; align-items: center; height: 80px; gap: 56px; }
        .hs-logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 21px; color: #111; }
        .hs-logo svg { width: 28px; height: 28px; fill: #2f3cf0; }
        .hs-menu { display: flex; gap: 38px; font-size: 13px; font-weight: 500; }
        .hs-nav-r { margin-left: auto; display: flex; align-items: center; gap: 22px; }
        .hs-btn-list {
          background: #3a4a6b; color: #fff;
          font-size: 13px; font-weight: 500;
          padding: 11px 20px; border-radius: 999px;
          transition: background .15s;
        }
        .hs-btn-list:hover { background: #2d3a55; }
        .hs-avatar { width: 32px; height: 32px; border-radius: 50%; background: #dfe6f3; }
        .hs-user { display: flex; align-items: center; gap: 14px; }

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
        .hs-h1 { font-size: 54px; line-height: 1.05; font-weight: 800; letter-spacing: -1.5px; margin: 28px 0 22px; }
        .hs-h1 span { color: #2f3cf0; }
        .hs-lead { font-size: 14px; line-height: 1.65; color: #222; max-width: 470px; }

        /* SEARCH */
        .hs-search-area { position: absolute; left: 24px; top: 350px; width: 1015px; }
        .hs-tabs { display: inline-flex; gap: 8px; background: #fff; padding: 12px 14px 10px; border-radius: 26px 26px 0 0; }
        .hs-tabs button {
          border: 0; font: 500 12px 'Inter'; padding: 12px 26px;
          border-radius: 999px; background: #f1f3f8; cursor: pointer;
          transition: background .15s, color .15s;
        }
        .hs-tabs button.on { background: #2f3cf0; color: #fff; }
        .hs-bar {
          background: #fff; border-radius: 0 26px 26px 26px;
          padding: 14px; display: flex; gap: 14px; align-items: center;
          box-shadow: 0 20px 50px rgba(20,30,80,.12);
        }
        .hs-field {
          display: flex; align-items: center; gap: 12px;
          background: #f3f5f9; border-radius: 14px;
          height: 48px; padding: 0 16px;
          font-size: 12.5px; color: #666;
        }
        .hs-field.grow { flex: 1; }
        .hs-field.sel { width: 190px; justify-content: space-between; }
        .hs-field small { display: block; font-size: 11px; color: #666; }
        .hs-field b { display: block; font-size: 12.5px; color: #111; font-weight: 600; }
        .hs-go {
          background: #2f3cf0; color: #fff; border: 0;
          border-radius: 12px; height: 48px; width: 150px;
          font: 600 14px 'Inter'; cursor: pointer; transition: background .15s;
        }
        .hs-go:hover { background: #2531d6; }
        .hs-popular { display: flex; align-items: center; gap: 12px; margin-top: 16px; color: #fff; font-size: 13px; font-weight: 500; flex-wrap: wrap; }
        .hs-popular a {
          border: 1px solid rgba(255,255,255,.55);
          background: rgba(20,30,50,.3); backdrop-filter: blur(6px);
          padding: 8px 17px; border-radius: 999px; font-size: 12px;
          transition: background .15s;
        }
        .hs-popular a:hover { background: rgba(20,30,50,.5); }

        /* CATEGORY CARDS */
        .hs-cats { position: absolute; right: 20px; top: 560px; display: flex; gap: 26px; z-index: 4; transform: rotate(-4deg); }
        .hs-cat {
          width: 130px; height: 225px; background: #fff;
          border-radius: 18px; padding: 8px 8px 0;
          box-shadow: 0 20px 40px rgba(30,40,90,.2);
          transform: perspective(600px) rotateY(-25deg);
        }
        .hs-cat img { width: 100%; height: 148px; border-radius: 12px; }
        .hs-cat b { display: block; font-size: 12px; margin-top: 10px; transform: rotate(2deg); transform-origin: left; }
        .hs-cat small { font-size: 11px; color: #666; display: block; transform: rotate(2deg); transform-origin: left; margin-top: 2px; }

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
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid #e3e6ee; display: grid; place-items: center;
          font-size: 14px; cursor: pointer; transition: background .15s;
        }
        .hs-arrow:hover { background: #f3f5f9; }

        /* GRID */
        .hs-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 26px; padding-bottom: 40px; }
        .hs-card {
          background: #fff; border-radius: 18px; overflow: hidden;
          box-shadow: 0 8px 30px rgba(30,40,90,.12); position: relative;
          transition: transform .2s, box-shadow .2s;
        }
        .hs-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(30,40,90,.18); }
        .hs-card > img { width: 100%; height: 142px; }
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
        .hs-meta { display: flex; justify-content: space-between; margin-top: 16px; font-size: 12px; color: #555; }
        .hs-meta span { display: flex; gap: 7px; align-items: center; }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .hs-search-area, .hs-cats { position: static; width: auto; margin: 20px 0; }
          .hs-hero { height: auto; padding-bottom: 40px; }
          .hs-hero-curve { display: none; }
          .hs-grid { grid-template-columns: repeat(2,1fr); }
          .hs-features { flex-wrap: wrap; }
          .hs-sec-r { margin-right: 0; }
          .hs-menu { display: none; }
          .hs-h1 { font-size: 44px; }
          .hs-bar { flex-wrap: wrap; }
          .hs-cats { flex-wrap: wrap; transform: none; }
        }
        @media (max-width: 600px) { .hs-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="hs-root">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="hs-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hs-hero-bg" src="/images/heroBg.png" alt="" />

          <div className="hs-wrap">
            {/* NAV */}
            <nav className="hs-nav">
              <a className="hs-logo" href="#">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2 1 11h3v10h6v-6h4v6h6V11h3z" />
                </svg>
                HomeSpace
              </a>

              <div className="hs-menu">
                {NAV_LINKS.map((l) => (
                  <a key={l} href="#">{l}</a>
                ))}
              </div>

              <div className="hs-nav-r">
                <IconPin />
                <a className="hs-btn-list" href="#">List Property</a>
                <div className="hs-user">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="hs-avatar" src="" alt="User avatar" />
                  <span style={{ fontSize: 11 }}>⌄</span>
                </div>
              </div>
            </nav>

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
            <div className="hs-search-area">
              <div className="hs-tabs">
                {SEARCH_TABS.map((tab, i) => (
                  <button
                    key={tab}
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
                  Search by city, locality, project or builder...
                </div>

                <div className="hs-field sel">
                  <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <IconHome />
                    <span>
                      <small>Property Type</small>
                      <b>Any</b>
                    </span>
                  </span>
                  <span>⌄</span>
                </div>

                <div className="hs-field sel">
                  <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <IconBudget />
                    <span>
                      <small>Budget</small>
                      <b>Any</b>
                    </span>
                  </span>
                  <span>⌄</span>
                </div>

                <button className="hs-go">Search</button>
              </div>

              <div className="hs-popular">
                Popular Searches:
                {POPULAR_SEARCHES.map((s) => (
                  <a key={s.label} href={s.href}>{s.label}</a>
                ))}
              </div>
            </div>

            {/* CATEGORY TILT CARDS */}
            <div className="hs-cats">
              {CATEGORY_CARDS.map((c) => (
                <div className="hs-cat" key={c.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt={c.title} />
                  <b>{c.title}</b>
                  <small>{c.sub}</small>
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
            {FEATURES.map((f) => (
              <div className="hs-feat" key={f.title}>
                <div className="hs-ic" style={{ background: f.bg }}>{f.icon}</div>
                <div>
                  <b>{f.title}</b>
                  <small>{f.sub}</small>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION HEADER */}
          <div className="hs-sec-h">
            <div>
              <h2>Featured Properties</h2>
              <p>Handpicked properties just for you</p>
            </div>
            <div className="hs-sec-r">
              <a className="hs-view" href="#">View All &nbsp;→</a>
              {/* <span className="hs-arrow">‹</span> */}
            </div>
          </div>

          {/* PROPERTY GRID */}
          <div className="hs-grid">
            {PROPERTIES.map((p) => (
              <article className="hs-card" key={p.price + p.loc}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imgLink} alt={p.type} />
                <span className={`hs-tag ${p.tagClass}`}>{p.tag}</span>
                <span className="hs-heart"><IconHeart /></span>
                <div className="hs-body">
                  <div className="hs-price">{p.price}</div>
                  <div className="hs-type">{p.type}</div>
                  <div className="hs-loc">● {p.loc}</div>
                  <div className="hs-meta">
                    <span><IconArea />{p.area}</span>
                    <span><IconBed />{p.beds}</span>
                    <span><IconBath />{p.baths}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
        {/* ── STATS ────────────────────────────────────────────────────── */}
        <StatsBanner />
        </div>
      </div>
    </>
  );
}
