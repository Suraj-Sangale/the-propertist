"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search,
  Building,
  DollarSign,
  ChevronDown,
  Sparkles,
  MapPin,
  TrendingUp,
} from "lucide-react";
import CategoryCards3D from "./CategoryCards3D";
import { POPULAR_SEARCHES } from "@/utilities/data";

interface HeroProps {
  onSearch?: (query: string, tab: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [activeTab, setActiveTab] = useState("Buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("Any");
  const [budget, setBudget] = useState("Any");

  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!heroRef.current || !heroContentRef.current || !heroBgRef.current) return;

    // Subtle parallax on hero content as user scrolls
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    tl.to(heroContentRef.current, {
      y: 60,
      opacity: 0.85,
      ease: "none",
    });

    return () => {
      tl.kill();
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, activeTab);
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col justify-between pt-24 md:pt-28 pb-12 overflow-hidden"
    >
      {/* Visual Sticky Background Layer */}
      <div
        ref={heroBgRef}
        className="absolute inset-0 w-full h-full -z-10 overflow-hidden"
      >
        {/* Luxury Villa with Infinity Pool & Sunset Skyline */}
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2600&q=90"
          alt="Luxury modern villa with swimming pool at sunset"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Soft atmospheric gradient overlays for perfect text contrast and luminous warmth */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent sm:via-white/50 w-full sm:w-3/4 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-[1]" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/70 to-transparent z-[1]" />

        {/* Floating Marker Tooltip Pin on the Villa */}
        <div className="absolute top-28 right-12 sm:right-28 md:right-44 lg:right-64 hidden sm:flex items-center gap-2.5 bg-white/90 backdrop-blur-xl p-2 pr-4 rounded-2xl shadow-xl border border-white/80 animate-bounce duration-1000 z-10">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=200&q=80"
              alt="Villa snippet"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              <span>Modern Villa</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-sm font-bold text-blue-600">₹ 3.2 Cr</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Bangalore</span>
            </div>
          </div>
          {/* Tooltip pointer */}
          <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white/90 rotate-45 border-r border-b border-white/60"></div>
        </div>
      </div>

      {/* Hero Content Container */}
      <div
        ref={heroContentRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex-1 flex flex-col justify-center pt-6 sm:pt-10"
      >
        <div className="max-w-3xl">
          {/* Top Pill Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-5 sm:mb-6">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50/90 backdrop-blur-md border border-blue-200/60 shadow-sm text-xs font-semibold text-blue-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Find Your Perfect Place</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-sm text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Trusted by 1M+ home seekers</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-5">
            Discover a Better <br />
            Way to Find <span className="text-blue-600 relative">Home</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8 sm:mb-10">
            Explore verified properties, compare prices, and find your dream
            home with ease. From apartments to villas, we&apos;ve got you
            covered.
          </p>

          {/* Floating Search Panel */}
          <div className="w-full max-w-4xl bg-white/90 backdrop-blur-2xl rounded-3xl p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] border border-white/80">
            {/* Tabs (Buy, Rent, New Projects) */}
            <div className="flex items-center gap-2 mb-4">
              {["Buy", "Rent", "New Projects"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-[1.02]"
                      : "bg-slate-100/70 hover:bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input and Select Fields Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3"
            >
              {/* Keyword / Locality Search */}
              <div className="flex-[1.6] flex items-center gap-3 px-4 py-3.5 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200/70 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by city, locality, project or builder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>

              {/* Property Type Dropdown */}
              <div className="flex-1 flex items-center justify-between px-4 py-3 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200/70 cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Property Type
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {propertyType}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              {/* Budget Dropdown */}
              <div className="flex-1 flex items-center justify-between px-4 py-3 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200/70 cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Budget
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {budget}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              {/* Primary Search Button */}
              <button
                type="submit"
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Popular Searches */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                Popular Searches:
              </span>
              {POPULAR_SEARCHES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSearchQuery(item)}
                  className="px-3 py-1 rounded-full bg-slate-100/80 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-medium transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Floating Category Cards at bottom-right */}
        <div className="w-full mt-6 sm:mt-10 flex justify-end">
          <CategoryCards3D />
        </div>
      </div>
    </section>
  );
}
