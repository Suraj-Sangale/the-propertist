"use client";

import { useEffect, useRef } from "react";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
    label: "Modern Villa",
    sub: "Beverly Hills, CA",
  },
  {
    src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80",
    label: "Luxury Penthouse",
    sub: "Manhattan, NY",
  },
  {
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
    label: "Coastal Retreat",
    sub: "Malibu, CA",
  },
  {
    src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80",
    label: "Contemporary Home",
    sub: "Miami, FL",
  },
  {
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80",
    label: "Garden Estate",
    sub: "Hamptons, NY",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
    label: "Sky Residence",
    sub: "Chicago, IL",
  },
  {
    src: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=900&q=80",
    label: "Heritage Manor",
    sub: "Savannah, GA",
  },
];

// Duplicated for seamless loop
const TRACK = [...IMAGES, ...IMAGES];

export default function ImageMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Don't run the scale loop if user prefers reduced motion
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Track which cards are hovered so we can merge the translateY into the JS transform
    const hovered = new WeakSet<HTMLElement>();

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>(".imq-card")
    );

    const onEnter = (e: Event) => hovered.add(e.currentTarget as HTMLElement);
    const onLeave = (e: Event) => hovered.delete(e.currentTarget as HTMLElement);

    cards.forEach((c) => {
      c.addEventListener("mouseenter", onEnter);
      c.addEventListener("mouseleave", onLeave);
    });

    // ── Per-card smoothed state (lerp targets) ───────────────────────────────
    const smoothed = cards.map(() => ({
      scale: 1, rotateY: 0, ty: 0,
    }));
    let lastTime = 0;
    let rafId: number;

    // update(time) — receives RAF high-res timestamp for frame-rate-independent lerp
    function update(time: number) {
      // Cap dt so a background tab resuming doesn't cause a giant jump
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const alpha = 1 - Math.exp(-dt * 12);

      const vw = window.innerWidth;
      const cx = vw / 2;

      // Dynamically measure actual rendered card width for responsive accuracy
      const baseCardW = cards[0]?.offsetWidth || 300;

      // ── BATCH READ — all rects before any style writes ──────────────────────
      const rects = cards.map((c) => c.getBoundingClientRect());

      // ── COMPUTE targets + LERP smoothed state ──────────────────────────────
      const k = 0.85;
      const kNorm = 1 - Math.sqrt(1 - k * k);
      const isMobile = vw <= 768;
      const minScale = isMobile ? 0.9 : 0.8;
      const scaleRange = 1.0 - minScale;
      const rotFactor = vw < 600 ? 0.42 : 0.58; // slightly gentler 3D tilt on narrow screens

      cards.forEach((card, i) => {
        const rect    = rects[i];
        const cardCx  = rect.left + rect.width / 2;
        const offset  = cardCx - cx;
        const u       = Math.max(-1, Math.min(1, offset / Math.max(cx, 1))); // -1 (left) to +1 (right)
        const uAbs    = Math.abs(u);

        // Circular arc: 0 at center, 1 at edge, with 0 derivative at center (flat apex)
        const circ = (1 - Math.sqrt(Math.max(0, 1 - Math.pow(uAbs * k, 2)))) / kNorm;

        // Scale: 0.8x (mobile) / 0.7x (desktop) at center, smooth circular curve up to 1.0x at edges
        const targetScale = minScale + scaleRange * circ;

        // Cylinder tangent rotation: 0deg at center, smooth circular angle toward center
        const targetRotateY = -Math.sign(u) * (Math.asin(uAbs * 0.75) * (180 / Math.PI) * rotFactor);
        const targetTy      = hovered.has(card) ? -8 : 0;

        const s = smoothed[i];
        s.scale   += (targetScale   - s.scale)   * alpha;
        s.rotateY += (targetRotateY - s.rotateY) * alpha;
        s.ty      += (targetTy      - s.ty)      * alpha;
      });

      // ── BATCH WRITE — all style mutations together ──────────────────────────
      cards.forEach((card, i) => {
        const { scale, rotateY, ty } = smoothed[i];

        // Constant-gap margin compensation (dynamically derived from current card width)
        const comp = (baseCardW * (1 - scale)) / 2;
        card.style.marginLeft  = `-${comp.toFixed(2)}px`;
        card.style.marginRight = `-${comp.toFixed(2)}px`;

        card.style.transform =
          `translateY(${ty.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      });

      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      cards.forEach((c) => {
        c.removeEventListener("mouseenter", onEnter);
        c.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <style>{`
        /* ─── Root section ─────────────────────────────── */
        .imq-root {
          width: 100%;
          overflow: hidden;
          padding: clamp(36px, 6vw, 68px) 0 clamp(44px, 7vw, 76px);
          position: relative;
        }

        /* ─── Header ───────────────────────────────────── */
        .imq-eyebrow {
          text-align: center;
          font-family: Poppins, Inter, system-ui, sans-serif;
          font-size: clamp(10px, 1.2vw, 12px);
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #3ec8e4;
          margin: 0 0 8px;
        }
        .imq-heading {
          text-align: center;
          font-family: Poppins, Inter, system-ui, sans-serif;
          font-size: clamp(20px, 3.5vw, 36px);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        /* ─── Track ────────────────────────────────────── */
        .imq-wrap {
          overflow: hidden;
          width: 100%;
          /* Extra vertical room so cards at 1.0× don't clip */
          padding: clamp(16px, 3vw, 28px) 0;
          /* Perspective origin for the 3-D cylinder effect */
          perspective: clamp(700px, 90vw, 1200px);
          perspective-origin: 50% 50%;
        }
        .imq-track {
          display: flex;
          gap: clamp(14px, 2vw, 24px);
          width: max-content;
          animation: imq-scroll 34s linear infinite;
          /* Pass perspective through to child cards */
          transform-style: preserve-3d;
        }
        .imq-track.imq-paused {
          animation-play-state: paused;
        }

        @keyframes imq-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ─── Card ─────────────────────────────────────── */
        .imq-card {
          position: relative;
          flex: 0 0 320px;
          height: 420px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          will-change: transform;
          transition: box-shadow 0.35s ease;
          box-shadow:
            0 8px 32px rgba(0,0,0,0.4),
            inset 0 0 0 1px rgba(255,255,255,0.07);
        }
        .imq-card:hover {
          box-shadow:
            0 24px 50px rgba(0,0,0,0.65),
            0 0 0 1.5px rgba(62,200,228,0.4),
            0 6px 20px rgba(62,200,228,0.18);
        }

        /* Photo */
        .imq-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.55s cubic-bezier(.22,.61,.36,1);
        }
        .imq-card:hover .imq-img {
          transform: scale(1.06);
        }

        /* Dark gradient scrim */
        .imq-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(5,8,16,0) 35%,
            rgba(5,8,16,0.52) 58%,
            rgba(5,8,16,0.92) 100%
          );
        }

        /* Top badge */
        .imq-badge {
          position: absolute;
          top: clamp(10px, 1.5vw, 16px);
          left: clamp(10px, 1.5vw, 16px);
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(8,11,18,0.68);
          border: 1px solid rgba(62,200,228,0.32);
          backdrop-filter: blur(10px);
          font-family: Poppins, Inter, system-ui, sans-serif;
          font-size: clamp(8px, 1vw, 10px);
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #3ec8e4;
          text-transform: uppercase;
        }

        /* Bottom copy */
        .imq-copy {
          position: absolute;
          left: clamp(12px, 1.8vw, 20px);
          right: clamp(12px, 1.8vw, 20px);
          bottom: clamp(14px, 2vw, 22px);
        }
        .imq-label {
          font-family: Poppins, Inter, system-ui, sans-serif;
          font-weight: 700;
          font-size: clamp(15px, 1.8vw, 18px);
          color: #fff;
          letter-spacing: -0.01em;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0,0,0,0.7);
        }
        .imq-sub {
          font-family: Poppins, Inter, system-ui, sans-serif;
          font-size: clamp(10px, 1.2vw, 12px);
          color: rgba(255,255,255,0.7);
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .imq-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #3ec8e4;
          flex: 0 0 auto;
        }

        /* ─── Responsive Breakpoints ───────────────────── */
        @media (max-width: 1024px) {
          .imq-card {
            flex: 0 0 270px;
            height: 360px;
          }
        }

        @media (max-width: 768px) {
          .imq-card {
            flex: 0 0 220px;
            height: 300px;
            border-radius: 10px;
          }
          .imq-track {
            animation-duration: 28s;
          }
        }

        @media (max-width: 480px) {
          .imq-card {
            flex: 0 0 180px;
            height: 250px;
            border-radius: 8px;
          }
          .imq-track {
            animation-duration: 24s;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .imq-track { animation: none; }
          .imq-card { transform: none !important; }
        }
      `}</style>

      <section className="imq-root">
        <p className="imq-eyebrow">Featured Listings</p>
        <h2 className="imq-heading">Exceptional Properties</h2>

        <div className="imq-wrap">
          <div className="imq-track" ref={trackRef}>
            {TRACK.map((img, idx) => (
              <div className="imq-card" key={idx}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="imq-img"
                  src={img.src}
                  alt={img.label}
                  loading="lazy"
                  draggable={false}
                />
                <div className="imq-scrim" />
                <span className="imq-badge">For Sale</span>
                <div className="imq-copy">
                  <div className="imq-label">{img.label}</div>
                  <div className="imq-sub">
                    <span className="imq-dot" />
                    {img.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
