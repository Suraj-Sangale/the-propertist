"use client";

import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import CommonSwiper, { SwiperSlide } from "./commonSwiper";
import Link from "next/link";
import { useWishlist } from "@/utilities/wishlist";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Property {
  tag?: string;
  tagClass?: string;
  price?: string;
  type?: string;
  loc?: string;
  area?: string;
  beds?: string;
  baths?: string;
  imgLink?: string;
  slug?: string;
  id?: number | string;
  name?: string;
  projectName?: string;
  developer?: string;
  locality?: string;
  locality_label?: string;
  config?: string;
  config_label?: string;
  priceFrom?: string;
  priceLabel?: string;
  status?: string;
  propertyStatus?: string;
  badge?: string;
  gallery?: string[];
  image?: string;
  verified?: boolean;
  rera?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface PropertyCarouselProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Property[] | any[];
  /** Pill label above the heading, e.g. "New Listings" */
  pill?: string;
  /** Section heading */
  heading?: string;
  /** Section sub-heading */
  subheading?: string;
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z" />
  </svg>
);

const IconHeart = ({ filled = false }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    style={{
      width: 16,
      height: 16,
      stroke: filled ? "#ef4444" : "#1e293b",
      fill: filled ? "#ef4444" : "none",
      strokeWidth: 2,
      transition: "all 0.18s ease",
    }}
  >
    <path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z" />
  </svg>
);

const IconArea = () => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "#64748b", fill: "none", strokeWidth: 1.8, flexShrink: 0 }}>
    <path d="M4 4h16v16H4z" />
  </svg>
);

const IconBed = () => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "#64748b", fill: "none", strokeWidth: 1.8, flexShrink: 0 }}>
    <path d="M3 18V8h18v10M3 14h18" />
  </svg>
);

const IconVerified = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12, flexShrink: 0 }}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, display: "block" }}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, display: "block" }}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// ─── Styles ──────────────────────────────────────────────────────────────────

const CSS = `
  .pc-section { font-family: 'Inter', system-ui, sans-serif; }
  .pc-section * { box-sizing: border-box; }

  /* Header */
  .pc-header { display: flex; align-items: flex-end; justify-content: space-between; margin: 48px 0 24px; }
  .pc-header h2 { font-size: 26px; font-weight: 700; color: #0d0d12; letter-spacing: -0.4px; }
  .pc-header p  { font-size: 14.5px; color: #64748b; margin-top: 4px; }
  .pc-pill {
    display: inline-block;
    background: #eef4d4; color: #3f5a10;
    font-size: 11.5px; font-weight: 600;
    padding: 5px 13px; border-radius: 999px;
    margin-bottom: 8px;
  }

  /* Carousel container */
  .pc-carousel-container {
    position: relative;
    margin-bottom: 30px;
  }
  .pc-swiper-wrap {
    overflow: hidden;
    padding: 12px 4px 24px;
    margin: -12px -4px 0;
  }
  .cs-swiper { overflow: visible !important; }
  .cs-swiper .swiper-slide { height: auto; display: flex; }

  /* Navigation Arrows - centered on image (195px height / 2 = 98px) so they never overlap price */
  .pc-arrow {
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    z-index: 15;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid #e2e8f0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #1e293b;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.12);
    transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, color 0.15s ease;
  }
  .pc-arrow:hover {
    background: #ffffff;
    border-color: #2563eb;
    color: #2563eb;
    transform: translateY(-50%) scale(1.08);
    box-shadow: 0 6px 22px rgba(37, 99, 235, 0.22);
  }
  .pc-arrow:active {
    transform: translateY(-50%) scale(0.95);
  }
  .pc-arrow-prev { left: -22px; }
  .pc-arrow-next { right: -22px; }

  @media (min-width: 1240px) {
    .pc-arrow-prev { left: -24px; }
    .pc-arrow-next { right: -24px; }
  }

  @media (max-width: 900px) {
    .pc-arrow { top: 40%; }
    .pc-arrow-prev { left: -8px; }
    .pc-arrow-next { right: -8px; }
  }

  @media (max-width: 640px) {
    .pc-arrow { width: 36px; height: 36px; top: 35%; }
    .pc-arrow-prev { left: 8px; }
    .pc-arrow-next { right: 8px; }
  }

  /* Property Card */
  .pc-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    border: 1px solid #eef0f4;
    box-shadow: 0 2px 12px rgba(15, 23, 42, 0.05);
    transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease;
    position: relative;
  }
  .pc-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
    border-color: #cbd5e1;
  }

  /* Card Image */
  .pc-img-wrap {
    position: relative;
    height: 195px;
    width: 100%;
    overflow: hidden;
    background: #f1f5f9;
    flex-shrink: 0;
  }
  .pc-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.45s ease;
  }
  .pc-card:hover .pc-card-img {
    transform: scale(1.06);
  }
  .pc-img-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%);
    pointer-events: none;
    z-index: 1;
  }

  /* Status Tag Badge */
  .pc-tag {
    position: absolute;
    left: 12px;
    top: 12px;
    z-index: 2;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }

  /* Developer pill on image bottom */
  .pc-img-dev {
    position: absolute;
    bottom: 10px;
    left: 12px;
    z-index: 2;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 1px 4px rgba(0,0,0,0.6);
    max-width: calc(100% - 24px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Heart Button */
  .pc-heart {
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 2;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(4px);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    transition: transform 0.15s ease, background 0.15s ease;
  }
  .pc-heart:hover {
    transform: scale(1.12);
    background: #ffffff;
  }

  /* Card Body */
  .pc-body {
    padding: 16px 18px 18px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .pc-price {
    font-size: 19px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    letter-spacing: -0.3px;
  }
  .pc-title {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    margin-top: 6px;
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pc-type {
    font-size: 13px;
    color: #64748b;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pc-loc {
    font-size: 12.5px;
    color: #64748b;
    margin-top: 8px;
    display: flex;
    gap: 6px;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Meta Specs */
  .pc-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid #f1f5f9;
    font-size: 12px;
    color: #475569;
  }
  .pc-meta span {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 500;
    white-space: nowrap;
  }

  /* Card Footer */
  .pc-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px dashed #e2e8f0;
  }
  .pc-trust-badges {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .pc-badge-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 4px;
    white-space: nowrap;
  }
  .pc-badge-verified {
    background: #f0fdf4;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }
  .pc-badge-rera {
    background: #f8fafc;
    color: #475569;
    border: 1px solid #e2e8f0;
  }
  .pc-view-link {
    font-size: 12.5px;
    font-weight: 600;
    color: #2563eb;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
    transition: color 0.15s ease;
  }
  .pc-view-arrow {
    transition: transform 0.18s ease;
    display: inline-block;
  }
  .pc-card:hover .pc-view-link {
    color: #1d4ed8;
  }
  .pc-card:hover .pc-view-arrow {
    transform: translateX(3px);
  }
`;

function getStatusStyle(statusText: string) {
  const s = statusText.toLowerCase();
  if (s.includes("ready") || s.includes("move")) {
    return { background: "rgba(22, 101, 52, 0.88)", color: "#ffffff", border: "1px solid rgba(74, 222, 128, 0.4)" };
  }
  if (s.includes("launch") || s.includes("offer") || s.includes("early")) {
    return { background: "rgba(180, 83, 9, 0.9)", color: "#ffffff", border: "1px solid rgba(251, 191, 36, 0.4)" };
  }
  if (s.includes("luxury") || s.includes("premium")) {
    return { background: "rgba(107, 33, 168, 0.9)", color: "#ffffff", border: "1px solid rgba(216, 180, 254, 0.4)" };
  }
  return { background: "rgba(15, 23, 42, 0.8)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.2)" };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PropertyCarousel({
  properties,
  pill = "New Listings",
  heading = "Latest Properties",
  subheading = "Discover the newest properties added to our platform.",
}: PropertyCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const { has: isInWishlist, toggle: toggleWishlist } = useWishlist();

  const toggleSave = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  return (
    <section className="pc-section">
      <style>{CSS}</style>

      {/* Section header */}
      <div className="pc-header">
        <div className="pc-header-left">
          {/* {pill && <div className="pc-pill">{pill}</div>} */}
          <h2>{heading}</h2>
          {subheading && <p>{subheading}</p>}
        </div>
          <Link href="/listings" className="pc-view-btn">View All<span>→</span></Link>
      </div>

      {/* Carousel */}
      <div className="pc-carousel-container">
        <button
          className="pc-arrow pc-arrow-prev"
          aria-label="Previous property"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <IconChevronLeft />
        </button>

        <div className="pc-swiper-wrap">
          <CommonSwiper
            className="hs-prop-swiper"
            carouselOptions={{
              slidesPerView: 1.2,
              spaceBetween: 20,
              loop: true,
              navigation: false,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onSwiper: (swiper: any) => { swiperRef.current = swiper; },
              breakpoints: {
                600:  { slidesPerView: 2, spaceBetween: 20 },
                900:  { slidesPerView: 3, spaceBetween: 24 },
                1100: { slidesPerView: 4, spaceBetween: 24 },
              },
            }}
          >
            {properties.map((p, i) => {
              const id = p.id ?? p.slug ?? i;
              const title = p.projectName || p.name || p.config_label || "Premium Property";
              const imgSrc = p.gallery?.[0] || p.imgLink || p.image || "/images/projects/building-1.jpg";
              const price = p.priceFrom || p.priceLabel || p.price || "Price on Request";
              const config = p.config || p.type || "";
              const locality = p.locality || p.locality_label || p.loc || p.address || "";
              const statusTag = p.badge || p.status || p.propertyStatus || p.tag || "";
              const area = p.area || "";
              const beds = p.beds || p.config || "";
              const tagStyle = statusTag ? getStatusStyle(statusTag) : null;
              const href = p.slug ? `/property/${p.slug}` : "#";
              const isSaved = isInWishlist(id);

              return (
                <SwiperSlide key={id} style={{ height: "auto" }}>
                  <Link href={href} className="pc-card">
                    {/* Image Area */}
                    <div className="pc-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgSrc} alt={title} className="pc-card-img" />
                      <div className="pc-img-gradient" />

                      {/* Status Tag */}
                      {statusTag && tagStyle && (
                        <span className="pc-tag" style={tagStyle}>
                          {statusTag}
                        </span>
                      )}

                      {/* Heart Button */}
                      <button
                        type="button"
                        className="pc-heart"
                        onClick={(e) => toggleSave(e, id)}
                        aria-label="Save property"
                      >
                        <IconHeart filled={isSaved} />
                      </button>

                      {/* Developer name pill on bottom of image */}
                      {p.developer && (
                        <div className="pc-img-dev">{p.developer}</div>
                      )}
                    </div>

                    {/* Card Content Body */}
                    <div className="pc-body">
                      <div className="pc-price">{price}</div>
                      <div className="pc-title" title={title}>{title}</div>
                      {config && <div className="pc-type">{config}</div>}

                      {locality && (
                        <div className="pc-loc">
                          <IconPin />
                          <span>{locality}</span>
                        </div>
                      )}

                      {/* Meta specs: Area & Beds */}
                      {(area || beds) && (
                        <div className="pc-meta">
                          {area && (
                            <span>
                              <IconArea />
                              {area}
                            </span>
                          )}
                          {beds && (
                            <span>
                              <IconBed />
                              {beds}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer: Trust badges + Details link */}
                      <div className="pc-footer">
                        <div className="pc-trust-badges">
                          {p.verified && (
                            <span className="pc-badge-tag pc-badge-verified">
                              <IconVerified /> Verified
                            </span>
                          )}
                          {p.rera && (
                            <span className="pc-badge-tag pc-badge-rera">
                              RERA
                            </span>
                          )}
                        </div>
                        {/* <span className="pc-view-link">
                          Details <span className="pc-view-arrow">→</span>
                        </span> */}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </CommonSwiper>
        </div>

        <button
          className="pc-arrow pc-arrow-next"
          aria-label="Next property"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <IconChevronRight />
        </button>
      </div>
    </section>
  );
}
