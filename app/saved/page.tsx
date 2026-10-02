"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ALL_PROPERTIES } from "@/utilities/masterData";
import { useWishlist } from "@/utilities/wishlist";

export default function SavedPropertiesPage() {
  const { wishlist, count, isLoaded, toggle } = useWishlist();

  // Find all matched properties in masterData
  const savedProperties = useMemo(() => {
    if (!isLoaded || wishlist.length === 0) return [];
    const idSet = new Set(wishlist.map((id) => String(id)));
    return ALL_PROPERTIES.filter(
      (p) => idSet.has(String(p.id)) || (p.slug && idSet.has(String(p.slug)))
    );
  }, [wishlist, isLoaded]);

  return (
    <main className="saved-page-main">
      <style>{`
        .saved-page-main {
          min-height: 100vh;
          background: #f8fafc;
          padding-top: 100px;
          padding-bottom: 80px;
          font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .saved-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ─── Breadcrumb & Header ───────────────────── */
        .saved-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 16px;
        }
        .saved-breadcrumbs a {
          color: #64748b;
          text-decoration: none;
          transition: color 0.15s;
        }
        .saved-breadcrumbs a:hover {
          color: #2563eb;
        }
        .saved-breadcrumbs span {
          color: #0f172a;
          font-weight: 600;
        }

        .saved-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        .saved-title {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 6px 0;
        }
        .saved-title-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #fee2e2;
          color: #ef4444;
          font-size: 14px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 999px;
        }
        .saved-subtitle {
          color: #64748b;
          font-size: 15px;
          margin: 0;
        }

        /* ─── Property Grid ─────────────────────────── */
        .saved-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .saved-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .saved-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ─── Property Card ─────────────────────────── */
        .saved-card {
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
          border: 1px solid #f1f5f9;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .saved-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
        }

        .saved-card-img-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: #e2e8f0;
        }
        .saved-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .saved-card:hover .saved-card-img {
          transform: scale(1.05);
        }

        .saved-heart-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.15s ease, background 0.15s ease;
          color: #ef4444;
        }
        .saved-heart-btn:hover {
          transform: scale(1.1);
          background: #fee2e2;
        }

        .saved-card-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.85);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          backdrop-filter: blur(4px);
        }

        .saved-card-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .saved-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .saved-card-price {
          font-size: 20px;
          font-weight: 800;
          color: #c8a84b;
          margin-bottom: 8px;
        }
        .saved-card-loc {
          font-size: 12.5px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 12px;
        }
        .saved-card-meta {
          display: flex;
          gap: 16px;
          padding: 10px 0;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 16px;
          font-size: 12px;
          color: #64748b;
        }
        .saved-card-meta span {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 500;
        }
        .saved-card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .saved-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #1a1a2e;
          color: #ffffff;
          font-size: 12.5px;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .saved-view-btn:hover {
          background: #2563eb;
        }

        /* ─── Empty State ───────────────────────────── */
        .saved-empty {
          background: #ffffff;
          border-radius: 24px;
          padding: 60px 24px;
          text-align: center;
          max-width: 580px;
          margin: 40px auto;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
          border: 1px dashed #cbd5e1;
        }
        .saved-empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #fef2f2;
          color: #ef4444;
          display: grid;
          place-items: center;
          margin: 0 auto 20px;
        }
        .saved-empty-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }
        .saved-empty-desc {
          font-size: 14.5px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .saved-empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          padding: 12px 28px;
          border-radius: 999px;
          text-decoration: none;
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .saved-empty-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.45);
        }
      `}</style>

      <div className="saved-container">
        {/* Breadcrumb */}
        <div className="saved-breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/listings">Listings</Link>
          <span>/</span>
          <span>Saved Properties</span>
        </div>

        {/* Header */}
        <div className="saved-header-row">
          <div>
            <h1 className="saved-title">
              Saved Homes
              {isLoaded && count > 0 && (
                <span className="saved-title-badge">{count}</span>
              )}
            </h1>
            <p className="saved-subtitle">
              Your personalized shortlist of verified luxury apartments & villas in Mumbai.
            </p>
          </div>
          {isLoaded && count > 0 && (
            <Link href="/listings" className="saved-view-btn" style={{ background: "#2563eb" }}>
              + Browse More Homes
            </Link>
          )}
        </div>

        {/* Content */}
        {!isLoaded ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
            Loading your saved homes...
          </div>
        ) : savedProperties.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-icon">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div className="saved-empty-title">Your wishlist is empty</div>
            <p className="saved-empty-desc">
              You haven&apos;t saved any properties yet. Explore our curated portfolio of ₹2 Cr+ verified homes across Mumbai and tap the heart icon on any card to save it here.
            </p>
            <Link href="/listings" className="saved-empty-btn">
              Explore Luxury Properties →
            </Link>
          </div>
        ) : (
          <div className="saved-grid">
            {savedProperties.map((property) => {
              const id = property.id;
              const title = property.projectName || property.name || property.config_label;
              const imgSrc = property.gallery?.[0] || property.image || "/images/projects/building-1.jpg";
              const price = property.mode === "rent" ? property.priceFrom : `${property.priceFrom} Onwards`;

              return (
                <div key={id} className="saved-card">
                  <div className="saved-card-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgSrc} alt={title} className="saved-card-img" />
                    
                    {/* Remove/Toggle Heart Button */}
                    <button
                      type="button"
                      className="saved-heart-btn"
                      onClick={() => toggle(id)}
                      title="Remove from saved homes"
                      aria-label="Remove from saved homes"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="#ef4444" stroke="#ef4444" strokeWidth="1.8">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    {property.badge && (
                      <span className="saved-card-badge">{property.badge}</span>
                    )}
                  </div>

                  <div className="saved-card-body">
                    <div className="saved-card-title">{title}</div>
                    <div className="saved-card-price">{price}</div>
                    <div className="saved-card-loc">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#2563eb" strokeWidth="2">
                        <path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z" />
                      </svg>
                      {property.locality_label || property.projectName}
                    </div>

                    <div className="saved-card-meta">
                      {property.area && (
                        <span>
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="3" y="3" width="18" height="18" rx="1" />
                          </svg>
                          {property.area}
                        </span>
                      )}
                      {property.beds && (
                        <span>
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M3 20V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12" />
                            <path d="M3 14h18" />
                          </svg>
                          {property.beds}
                        </span>
                      )}
                    </div>

                    <div className="saved-card-footer">
                      <div style={{ display: "flex", gap: "6px" }}>
                        {property.verified && (
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "#16a34a", background: "#f0fdf4", padding: "3px 8px", borderRadius: "4px" }}>
                            ✓ Verified
                          </span>
                        )}
                        {property.rera && (
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "#475569", background: "#f1f5f9", padding: "3px 8px", borderRadius: "4px" }}>
                            RERA
                          </span>
                        )}
                      </div>

                      <Link href={`/property/${property.slug}`} className="saved-view-btn">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
