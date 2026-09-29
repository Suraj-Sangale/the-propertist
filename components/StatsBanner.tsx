"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatItem {
  icon: ReactNode;
  value: number;
  suffix: string;
  label: string;
  decimal?: boolean;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface StatsBannerProps {
  /** Override the pill label. Defaults to "Our Impact" */
  pillLabel?: string;
  /** Override the heading. Defaults to "Numbers\nThat Build Trust" */
  heading?: ReactNode;
  /** Override individual stat items */
  stats?: StatItem[];
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_STATS: StatItem[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2f3cf0" strokeWidth="1.8" style={{ width: 28, height: 28 }}>
        <path d="M3 11 12 3l9 8v10H3z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
    value: 1,
    suffix: "M+",
    label: "Happy Home Seekers",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2f3cf0" strokeWidth="1.8" style={{ width: 28, height: 28 }}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="m9 12 2.5 2.5L15 9" />
      </svg>
    ),
    value: 50000,
    suffix: "+",
    label: "Verified Properties",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2f3cf0" strokeWidth="1.8" style={{ width: 28, height: 28 }}>
        <circle cx="9" cy="7" r="3" />
        <circle cx="15" cy="7" r="3" />
        <path d="M3 21v-1a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v1" />
      </svg>
    ),
    value: 5000,
    suffix: "+",
    label: "Trusted Agents",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f7931e" strokeWidth="1.8" style={{ width: 28, height: 28 }}>
        <path d="m12 2 3 6.5 7 .8-5.2 4.8 1.5 7-6.3-3.6L5.7 21l1.5-7L2 9.3l7-.8z" />
      </svg>
    ),
    value: 48,
    suffix: "/5",
    label: "Customer Rating",
    decimal: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCount(raw: number, stat: StatItem): string {
  if (stat.decimal) return (raw / 10).toFixed(1);
  if (stat.value >= 1_000_000) return `${Math.round(raw / 1_000_000)}`;
  if (stat.value >= 1_000) return Math.round(raw).toLocaleString();
  return Math.round(raw).toString();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StatsBanner({
  pillLabel = "Our Impact",
  heading = (
    <>
      Numbers
      <br />
      That Build Trust
    </>
  ),
  stats = DEFAULT_STATS,
}: StatsBannerProps) {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          stats.forEach((stat, i) => {
            const duration = 1600;
            const steps = 60;
            const increment = stat.value / steps;
            let current = 0;
            const interval = setInterval(() => {
              current = Math.min(current + increment, stat.value);
              setCounts((prev) => {
                const next = [...prev];
                next[i] = current;
                return next;
              });
              if (current >= stat.value) clearInterval(interval);
            }, duration / steps);
          });
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        .sb-root {
          background: linear-gradient(120deg, #eef1ff 0%, #f0f7ff 50%, #e8f4ff 100%);
          border-radius: 24px;
          margin: 40px 24px;
          padding: 36px 48px;
          display: flex;
          align-items: center;
          overflow: hidden;
          position: relative;
          box-shadow: 0 4px 24px rgba(47,60,240,0.07);
        }
        .sb-root::before {
          content: "";
          position: absolute;
          right: -80px; top: -80px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(47,60,240,0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .sb-left {
          min-width: 200px;
          padding-right: 48px;
          border-right: 1.5px solid rgba(47,60,240,0.15);
          flex-shrink: 0;
        }
        .sb-pill {
          display: inline-flex;
          align-items: center;
          background: rgba(47,60,240,0.1);
          color: #2f3cf0;
          font-size: 10px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 999px;
          margin-bottom: 12px;
          letter-spacing: 0.3px;
        }
        .sb-left h2 {
          font-size: 20px;
          font-weight: 800;
          line-height: 1.25;
          color: #0d0d12;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .sb-items {
          display: flex;
          flex: 1;
          align-items: center;
        }
        .sb-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 40px;
          flex: 1;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .sb-item.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .sb-item:not(:last-child) {
          border-right: 1.5px solid rgba(47,60,240,0.15);
        }
        .sb-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: #fff;
          display: grid; place-items: center;
          box-shadow: 0 2px 10px rgba(47,60,240,0.1);
          flex-shrink: 0;
        }
        .sb-num {
          font-size: 24px;
          font-weight: 800;
          color: #0d0d12;
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .sb-label {
          font-size: 10px;
          color: #5b6172;
          margin-top: 4px;
          font-weight: 500;
        }
        @media (max-width: 1100px) {
          .sb-root { flex-direction: column; align-items: flex-start; gap: 28px; padding: 28px 24px; margin: 24px 16px; }
          .sb-left { border-right: none; padding-right: 0; border-bottom: 1.5px solid rgba(47,60,240,0.15); padding-bottom: 20px; width: 100%; }
          .sb-items { flex-wrap: wrap; gap: 20px; }
          .sb-item { flex: 1 1 40%; padding: 0; border-right: none !important; }
        }
      `}</style>

      <div className="sb-root" ref={ref}>
        <div className="sb-left">
          <div className="sb-pill">{pillLabel}</div>
          <h2>{heading}</h2>
        </div>

        <div className="sb-items">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`sb-item${counts[i] > 0 || animated.current ? " visible" : ""}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="sb-icon">{s.icon}</div>
              <div>
                <div className="sb-num">
                  {formatCount(counts[i], s)}{s.suffix}
                </div>
                <div className="sb-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
