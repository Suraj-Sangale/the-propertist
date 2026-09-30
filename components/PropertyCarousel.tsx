"use client";

import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import CommonSwiper, { SwiperSlide } from "./commonSwiper";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Property {
  tag: string;
  tagClass: string;
  price: string;
  type: string;
  loc: string;
  area: string;
  beds: string;
  baths: string;
  imgLink: string;
}

interface PropertyCarouselProps {
  properties: Property[];
  /** Pill label above the heading, e.g. "New Listings" */
  pill?: string;
  /** Section heading */
  heading?: string;
  /** Section sub-heading */
  subheading?: string;
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#2f3cf0" strokeWidth="2" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z" />
  </svg>
);

const IconHeart = () => (
  <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "#111", fill: "none", strokeWidth: 2 }}>
    <path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z" />
  </svg>
);

const IconArea = () => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "#666", fill: "none", strokeWidth: 1.8 }}>
    <path d="M4 4h16v16H4z" />
  </svg>
);

const IconBed = () => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "#666", fill: "none", strokeWidth: 1.8 }}>
    <path d="M3 18V8h18v10M3 14h18" />
  </svg>
);

const IconBath = () => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "#666", fill: "none", strokeWidth: 1.8 }}>
    <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
  </svg>
);

// ─── Styles ──────────────────────────────────────────────────────────────────

const CSS = `
  .pc-section { font-family: 'Inter', system-ui, sans-serif; }
  .pc-section * { box-sizing: border-box; }

  /* Header */
  .pc-header { display: flex; align-items: flex-end; justify-content: space-between; margin: 52px 0 22px; }
  .pc-header h2 { font-size: 24px; font-weight: 700; color: #0d0d12; }
  .pc-header p  { font-size: 14.5px; color: #5b6172; margin-top: 4px; }
  .pc-pill {
    display: inline-block;
    background: #eef4d4; color: #3f5a10;
    font-size: 11.5px; font-weight: 600;
    padding: 5px 13px; border-radius: 999px;
    margin-bottom: 8px;
  }
  .pc-arrows { display: flex; align-items: center; gap: 10px; }
  .pc-arrow {
    width: 34px; height: 34px; border-radius: 50%;
    border: 1px solid #d5d9e4; background: #fff;
    display: grid; place-items: center;
    font-size: 18px; line-height: 1; cursor: pointer; color: #333;
    transition: background .15s, border-color .15s, box-shadow .15s;
    box-shadow: 0 1px 4px rgba(30,40,90,.07);
  }
  .pc-arrow:hover { background: #f3f5f9; border-color: #b0b8cc; box-shadow: 0 2px 8px rgba(30,40,90,.12); }

  /* Carousel wrapper */
  .pc-swiper-wrap { overflow: hidden; }
  .cs-swiper { overflow: visible !important; }
  .cs-swiper .swiper-slide { height: auto; }

  /* Card */
  .pc-card {
    background: #fff; border-radius: 18px; overflow: hidden;
    box-shadow: 0 8px 30px rgba(30,40,90,.12);
    position: relative; height: 100%;
    transition: transform .2s, box-shadow .2s;
  }
  .pc-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(30,40,90,.18); }
  .pc-card > img { width: 100%; height: 166px; object-fit: cover; display: block; }

  /* Tag badge */
  .pc-tag { position: absolute; left: 12px; top: 12px; font-size: 11.5px; font-weight: 500; padding: 6px 13px; border-radius: 999px; }
  .pc-t1 { background: #6a4df0; color: #fff; }
  .pc-t2 { background: #d3f4e0; color: #166a3a; }
  .pc-t3 { background: #eef4d4; color: #3f5a10; }
  .pc-t4 { background: #dfe4ff; color: #2a3aa8; }

  /* Heart */
  .pc-heart {
    position: absolute; right: 12px; top: 12px;
    width: 30px; height: 30px; border-radius: 50%;
    background: #fff; display: grid; place-items: center;
    cursor: pointer; transition: transform .15s;
  }
  .pc-heart:hover { transform: scale(1.15); }

  /* Body */
  .pc-body { padding: 12px 18px 18px; }
  .pc-price { font-size: 20px; font-weight: 700; color: #0d0d12; }
  .pc-type  { font-size: 14px; margin-top: 4px; color: #222; }
  .pc-loc   { font-size: 12px; color: #555; margin-top: 8px; display: flex; gap: 6px; align-items: center; }
  .pc-meta  {
    display: flex; justify-content: space-between;
    margin-top: 14px; font-size: 12px; color: #555;
    border-top: 1px solid #f0f2f7; padding-top: 14px;
  }
  .pc-meta span { display: flex; gap: 6px; align-items: center; }
`;

// Tag class mapping (CSS-namespaced)
const TAG_CLASS_MAP: Record<string, string> = {
  t1: "pc-t1",
  t2: "pc-t2",
  t3: "pc-t3",
  t4: "pc-t4",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PropertyCarousel({
  properties,
  pill = "New Listings",
  heading = "Latest Properties",
  subheading = "Discover the newest properties added to our platform.",
}: PropertyCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="pc-section">
      <style>{CSS}</style>

      {/* Section header */}
      <div className="pc-header">
        <div>
          <div className="pc-pill">{pill}</div>
          <h2>{heading}</h2>
          <p>{subheading}</p>
        </div>
        <div className="pc-arrows">
          <button
            className="pc-arrow"
            aria-label="Previous"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            ‹
          </button>
          <button
            className="pc-arrow"
            aria-label="Next"
            onClick={() => swiperRef.current?.slideNext()}
          >
            ›
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="pc-swiper-wrap" style={{ paddingBottom: 40 }}>
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
              1100: { slidesPerView: 4, spaceBetween: 26 },
            },
          }}
        >
          {properties.map((p) => (
            <SwiperSlide key={p.price + p.loc + p.imgLink} style={{ height: "auto" }}>
              <article className="pc-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imgLink} alt={p.type} />
                <span className={`pc-tag ${TAG_CLASS_MAP[p.tagClass] ?? p.tagClass}`}>
                  {p.tag}
                </span>
                <span className="pc-heart"><IconHeart /></span>
                <div className="pc-body">
                  <div className="pc-price">{p.price}</div>
                  <div className="pc-type">{p.type}</div>
                  <div className="pc-loc"><IconPin />{p.loc}</div>
                  <div className="pc-meta">
                    <span><IconArea />{p.area}</span>
                    <span><IconBed />{p.beds}</span>
                    <span><IconBath />{p.baths}</span>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </CommonSwiper>
      </div>
    </section>
  );
}
