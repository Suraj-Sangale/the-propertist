"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  Coins,
  Headphones,
  FileCheck2,
  ArrowRight,
  Home,
  Sparkles,
} from "lucide-react";
import { WHY_CHOOSE_BENEFITS } from "@/utilities/data";

export default function WhyChooseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const darkCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!darkCardRef.current || !sectionRef.current) return;

    // Subtle parallax on the dark dream home card
    const parallax = gsap.to(darkCardRef.current, {
      y: -25,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    return () => {
      parallax.kill();
    };
  }, []);

  const getBenefitIcon = (id: string) => {
    switch (id) {
      case "why-1":
        return <ShieldCheck className="w-5 h-5" />;
      case "why-2":
        return <Coins className="w-5 h-5" />;
      case "why-3":
        return <Headphones className="w-5 h-5" />;
      case "why-4":
        return <FileCheck2 className="w-5 h-5" />;
      default:
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  return (
    <section ref={sectionRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Heading, intro and 4 benefit cards */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          {/* Header block */}
          <div className="mb-8 md:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mb-4">
              <span>Why HomeSpace</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
              Why Choose <br />
              <span className="text-blue-600">HomeSpace?</span>
            </h2>
            <p className="text-base text-slate-600 max-w-lg leading-relaxed mb-6">
              We make your property journey simple, transparent, and hassle-free.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* 4 Benefit Cards (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {WHY_CHOOSE_BENEFITS.map((benefit) => (
              <div
                key={benefit.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100/90 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 group flex flex-col justify-between"
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${benefit.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm`}
                >
                  {getBenefitIcon(benefit.id)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dark Dream Home Card with luxury background and parallax */}
        <div className="lg:col-span-5 flex items-stretch">
          <div
            ref={darkCardRef}
            className="relative w-full rounded-3xl md:rounded-[36px] overflow-hidden p-7 sm:p-9 md:p-10 flex flex-col justify-between shadow-2xl border border-white/10 group cursor-pointer min-h-[440px] lg:min-h-full"
            style={{ willChange: "transform" }}
          >
            {/* Background Luxury Villa Image */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                alt="Luxury Modern Architecture at dusk"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />
              <div className="absolute inset-0 bg-blue-950/30 mix-blend-overlay" />
            </div>

            {/* Top row with circular floating home icon badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/90">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Personalized Concierge</span>
              </div>
              <div className="w-11 h-11 rounded-full bg-blue-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg shadow-blue-500/40 group-hover:rotate-12 transition-transform duration-300">
                <Home className="w-5 h-5" />
              </div>
            </div>

            {/* Middle Content */}
            <div className="my-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                Let Us Help You <br />
                Find Your Dream Home
              </h3>
              <p className="text-sm text-slate-300 font-normal leading-relaxed max-w-sm">
                Connect with our verified property experts for personalized
                recommendations and zero brokerage fees.
              </p>
            </div>

            {/* Bottom Section: CTA and Avatar Stack */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-6 border-t border-white/10">
              <a
                href="#expert"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-950 font-bold text-sm hover:bg-blue-50 hover:text-blue-600 shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>Talk to an Expert</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Avatar Stack */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="User"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="User"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="User"
                  />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">1M+</div>
                  <div className="text-[10px] text-slate-400">Happy Home Seekers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
