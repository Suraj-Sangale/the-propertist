"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  {
    label: "Buy",
    href: "/buy",
    badge: "",
    subItems: [
      { title: "Apartments & Flats", desc: "Ready to move & under construction", icon: "🏢" },
      { title: "Independent Houses / Villas", desc: "Luxury gated community homes", icon: "🏡" },
      { title: "Residential Plots & Land", desc: "Prime investment locations", icon: "📍" },
      { title: "Penthouse & Duplex", desc: "Ultra-luxury sky homes", icon: "✨" },
    ],
  },
  {
    label: "Rent",
    href: "/rent",
    badge: "",
    subItems: [
      { title: "Furnished Flats", desc: "Move-in ready verified rentals", icon: "🛋️" },
      { title: "Studio Apartments", desc: "Budget & single occupancy units", icon: "🛏️" },
      { title: "Villas on Rent", desc: "Spacious family homes with gardens", icon: "🏠" },
      { title: "Office Space / Shops", desc: "Commercial rentals in prime hubs", icon: "🏪" },
    ],
  },
  {
    label: "Projects",
    href: "/projects",
    badge: "New",
    subItems: [
      { title: "Upcoming Launches", desc: "Pre-launch discounts & offers", icon: "🚀" },
      { title: "RERA Approved Projects", desc: "100% verified legal clarity", icon: "🛡️" },
      { title: "Luxury Waterfront Estates", desc: "Premium coastal & lake views", icon: "🌊" },
      { title: "Smart Eco Residences", desc: "Green living & solar powered", icon: "🌿" },
    ],
  },
  {
    label: "Agents",
    href: "/agents",
    badge: "",
    subItems: [
      { title: "Find RERA Agents", desc: "Certified real estate experts", icon: "⭐" },
      { title: "Top Rated Advisors", desc: "Reviewed by 10,000+ buyers", icon: "🏆" },
      { title: "Join as Partner Agent", desc: "Grow your real estate network", icon: "🤝" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    badge: "Popular",
    subItems: [
      { title: "Home Loans & EMI Calculator", desc: "Lowest interest rate approvals", icon: "💳" },
      { title: "Property Valuation", desc: "Instant AI price estimates", icon: "📊" },
      { title: "Legal & Documentation", desc: "Title search & stamp duty help", icon: "📜" },
      { title: "Interior Design & Fitouts", desc: "Turnkey modular home interiors", icon: "🎨" },
    ],
  },
];

const CITIES = ["Mumbai", "Pune", "Bangalore", "Delhi NCR", "Hyderabad", "Goa"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Handle scroll detection for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
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
          background: ${scrolled ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0.75)"};
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid ${scrolled ? "rgba(226, 232, 240, 0.9)" : "rgba(255, 255, 255, 0.4)"};
          box-shadow: ${scrolled ? "0 4px 24px -2px rgba(15, 23, 42, 0.08)" : "none"};
        }

        .hs-header-container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 24px;
          height: 74px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        /* ─── Logo ───────────────────────────────────── */
        .hs-hdr-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-weight: 800;
          font-size: 22px;
          color: #0f172a;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .hs-hdr-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2f3cf0 0%, #1e25ad 100%);
          display: grid;
          place-items: center;
          color: #fff;
          box-shadow: 0 4px 12px rgba(47, 60, 240, 0.35);
          transition: transform 0.2s ease;
        }
        .hs-hdr-logo:hover .hs-hdr-logo-icon {
          transform: scale(1.05);
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
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(241, 245, 249, 0.8);
          border: 1px solid rgba(203, 213, 225, 0.6);
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hs-city-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .hs-city-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 160px;
          background: #fff;
          border-radius: 12px;
          padding: 6px;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
          border: 1px solid #e2e8f0;
          z-index: 1050;
          animation: hs-pop 0.2s ease forwards;
        }
        .hs-city-item {
          width: 100%;
          text-align: left;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 500;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s;
        }
        .hs-city-item:hover, .hs-city-item.active {
          background: #eff2fe;
          color: #2f3cf0;
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
          gap: 5px;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          text-decoration: none;
          transition: all 0.18s ease;
        }
        .hs-nav-link:hover, .hs-nav-item-wrap:hover .hs-nav-link {
          color: #2f3cf0;
          background: rgba(47, 60, 240, 0.06);
        }
        .hs-nav-badge {
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 2px 6px;
          border-radius: 6px;
          background: #2f3cf0;
          color: #fff;
        }
        .hs-nav-badge.new {
          background: #10b981;
        }

        /* Mega Dropdown */
        .hs-dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          background: #ffffff;
          border-radius: 16px;
          padding: 10px;
          box-shadow: 0 20px 45px -8px rgba(15, 23, 42, 0.16);
          border: 1px solid rgba(226, 232, 240, 0.9);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
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
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .hs-dropdown-item:hover {
          background: #f8faff;
        }
        .hs-dropdown-icon {
          font-size: 18px;
          line-height: 1;
          margin-top: 2px;
        }
        .hs-dropdown-title {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 2px;
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
          gap: 14px;
        }
        .hs-btn-list-prop {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #2f3cf0 0%, #212bbd 100%);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 999px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(47, 60, 240, 0.28);
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .hs-btn-list-prop:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(47, 60, 240, 0.38);
          background: linear-gradient(135deg, #2633d9 0%, #1a229a 100%);
        }
        .hs-btn-free-badge {
          background: #10b981;
          color: #fff;
          font-size: 9.5px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .hs-user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .hs-user-btn:hover {
          background: #e2e8f0;
        }
        .hs-user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: grid;
          place-items: center;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
        }
        .hs-user-text {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        /* ─── Mobile Menu Trigger ────────────────────── */
        .hs-mobile-toggle {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #0f172a;
          transition: all 0.2s;
        }
        .hs-mobile-toggle:hover {
          background: #e2e8f0;
        }

        /* ─── Mobile Drawer ──────────────────────────── */
        .hs-mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(6px);
          z-index: 2000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .hs-mobile-drawer-backdrop.open {
          opacity: 1;
          visibility: visible;
        }

        .hs-mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 86%;
          max-width: 380px;
          background: #ffffff;
          z-index: 2010;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.15);
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
          overflow-y: auto;
        }
        .hs-mobile-drawer.open {
          transform: translateX(0);
        }

        .hs-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
        }
        .hs-drawer-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          display: grid;
          place-items: center;
          font-size: 18px;
          cursor: pointer;
          color: #475569;
        }

        .hs-drawer-body {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
        }

        /* Mobile City Pills */
        .hs-mobile-cities-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
          margin-bottom: 8px;
        }
        .hs-mobile-cities {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .hs-m-city-chip {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          cursor: pointer;
        }
        .hs-m-city-chip.active {
          background: #2f3cf0;
          border-color: #2f3cf0;
          color: #fff;
        }

        /* Mobile Nav Links */
        .hs-m-nav-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .hs-m-nav-card {
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          background: #fafbfc;
          overflow: hidden;
        }
        .hs-m-nav-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
          cursor: pointer;
        }
        .hs-m-sublist {
          padding: 4px 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid #edf2f7;
        }
        .hs-m-sublink {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          padding: 6px 0;
        }
        .hs-m-sublink:hover {
          color: #2f3cf0;
        }

        .hs-m-drawer-footer {
          padding: 20px 24px 28px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @keyframes hs-pop {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* ─── Responsive Media Queries ──────────────── */
        @media (max-width: 1040px) {
          .hs-hdr-nav {
            display: none;
          }
          .hs-mobile-toggle {
            display: flex;
          }
          .hs-city-picker {
            display: none;
          }
        }

        @media (max-width: 520px) {
          .hs-header-container {
            height: 64px;
            padding: 0 16px;
          }
          .hs-hdr-logo {
            font-size: 19px;
          }
          .hs-hdr-logo-icon {
            width: 32px;
            height: 32px;
          }
          .hs-btn-list-prop {
            padding: 8px 14px;
            font-size: 12.5px;
          }
          .hs-user-btn {
            display: none;
          }
        }
      `}</style>

      <header className="hs-header-sticky">
        <div className="hs-header-container">
          {/* LEFT: Logo & City */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" className="hs-hdr-logo">
              <div className="hs-hdr-logo-icon">
                <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "currentColor" }}>
                  <path d="M12 2 1 11h3v10h6v-6h4v6h6V11h3z" />
                </svg>
              </div>
              <span>HomeSpace</span>
            </Link>

            {/* City Selector */}
            <div className="hs-city-picker">
              <button
                type="button"
                className="hs-city-btn"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              >
                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: "none", stroke: "#2f3cf0", strokeWidth: 2 }}>
                  <path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z" />
                </svg>
                <span>{selectedCity}</span>
                <span style={{ fontSize: 9 }}>▼</span>
              </button>

              {cityDropdownOpen && (
                <div className="hs-city-dropdown">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`hs-city-item ${selectedCity === c ? "active" : ""}`}
                      onClick={() => {
                        setSelectedCity(c);
                        setCityDropdownOpen(false);
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Desktop Navigation Menu */}
          <nav className="hs-hdr-nav">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="hs-nav-item-wrap"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link href={link.href} className="hs-nav-link">
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`hs-nav-badge ${link.badge.toLowerCase()}`}>
                      {link.badge}
                    </span>
                  )}
                  <span style={{ fontSize: 9, opacity: 0.6, marginTop: 1 }}>▼</span>
                </Link>

                {/* Submenu Dropdown */}
                {link.subItems && (
                  <div className="hs-dropdown-menu">
                    {link.subItems.map((sub) => (
                      <Link key={sub.title} href={link.href} className="hs-dropdown-item">
                        <span className="hs-dropdown-icon">{sub.icon}</span>
                        <div>
                          <div className="hs-dropdown-title">{sub.title}</div>
                          <div className="hs-dropdown-desc">{sub.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="hs-hdr-actions">
            <Link href="/list-property" className="hs-btn-list-prop">
              <span>+ List Property</span>
              <span className="hs-btn-free-badge">Free</span>
            </Link>

            <button type="button" className="hs-user-btn" aria-label="User profile">
              <div className="hs-user-avatar">U</div>
              <span className="hs-user-text">Account</span>
              <span style={{ fontSize: 10, color: "#64748b" }}>▼</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="hs-mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
            >
              <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: "none", stroke: "currentColor", strokeWidth: 2 }}>
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Drawer Navigation ─────────────────────────── */}
      <div
        className={`hs-mobile-drawer-backdrop ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className={`hs-mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        {/* Drawer Header */}
        <div className="hs-drawer-header">
          <div className="hs-hdr-logo">
            <div className="hs-hdr-logo-icon">
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "currentColor" }}>
                <path d="M12 2 1 11h3v10h6v-6h4v6h6V11h3z" />
              </svg>
            </div>
            <span>HomeSpace</span>
          </div>

          <button
            type="button"
            className="hs-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="hs-drawer-body">
          {/* Quick City Picker */}
          <div>
            <div className="hs-mobile-cities-title">Select City</div>
            <div className="hs-mobile-cities">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`hs-m-city-chip ${selectedCity === c ? "active" : ""}`}
                  onClick={() => setSelectedCity(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Accordion Cards */}
          <div className="hs-m-nav-list">
            {NAV_LINKS.map((nav) => (
              <div className="hs-m-nav-card" key={nav.label}>
                <button
                  type="button"
                  className="hs-m-nav-header"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === nav.label ? null : nav.label)
                  }
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {nav.label}
                    {nav.badge && (
                      <span className={`hs-nav-badge ${nav.badge.toLowerCase()}`}>
                        {nav.badge}
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: 12, transform: activeDropdown === nav.label ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    ▼
                  </span>
                </button>

                {activeDropdown === nav.label && nav.subItems && (
                  <div className="hs-m-sublist">
                    {nav.subItems.map((sub) => (
                      <Link
                        key={sub.title}
                        href={nav.href}
                        className="hs-m-sublink"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{sub.icon}</span>
                        <span>{sub.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="hs-m-drawer-footer">
          <Link
            href="/list-property"
            className="hs-btn-list-prop"
            style={{ justifyContent: "center", width: "100%", padding: "12px 20px" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>+ Post Property for Free</span>
          </Link>

          <button
            type="button"
            className="hs-user-btn"
            style={{ justifyContent: "center", width: "100%", padding: "10px 16px" }}
          >
            <div className="hs-user-avatar">U</div>
            <span className="hs-user-text">Login / Register</span>
          </button>
        </div>
      </aside>
    </>
  );
}
