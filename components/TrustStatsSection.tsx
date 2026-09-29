"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Home, CheckSquare, Users, Trophy } from "lucide-react";
import { TRUST_STATS } from "@/utilities/data";

export default function TrustStatsSection() {
  const panelRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!panelRef.current) return;

    // Animate stats panel entrance
    const panelAnimation = gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 85%",
        },
      }
    );

    return () => {
      panelAnimation.kill();
    };
  }, []);

  const getStatIcon = (id: string) => {
    switch (id) {
      case "stat-1":
        return <Home className="w-6 h-6 text-blue-600" />;
      case "stat-2":
        return <CheckSquare className="w-6 h-6 text-emerald-600" />;
      case "stat-3":
        return <Users className="w-6 h-6 text-indigo-600" />;
      case "stat-4":
        return <Trophy className="w-6 h-6 text-amber-500" />;
      default:
        return <Home className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div
        ref={panelRef}
        className="w-full rounded-3xl md:rounded-[40px] bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-blue-50/90 border border-blue-100/80 p-8 sm:p-10 md:p-12 shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Title Area */}
          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-blue-200 text-xs font-semibold text-blue-700 mb-3 shadow-xs">
              <span>Our Impact</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Numbers <br />
              <span className="text-blue-600">That Build Trust</span>
            </h2>
          </div>

          {/* Right 4 Stats Items */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 md:gap-6">
            {TRUST_STATS.map((stat, idx) => (
              <div
                key={stat.id}
                className="flex flex-col items-center sm:items-start text-center sm:text-left bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Circular Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
                  {getStatIcon(stat.id)}
                </div>

                {/* Stat Number */}
                <div className="text-2xl sm:text-3xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  <span
                    ref={(el) => {
                      countersRef.current[idx] = el;
                    }}
                  >
                    {stat.displayNum}
                  </span>
                </div>

                {/* Stat Label */}
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
