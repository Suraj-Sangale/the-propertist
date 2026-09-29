"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building2,
  Home,
  Compass,
  Trees,
  Briefcase,
  Key,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { PROPERTY_TYPES } from "@/utilities/data";

export default function PropertyTypesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current) return;

    const cards = cardsRef.current.filter(Boolean);

    // Staggered scroll entrance animation
    const tween = gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 50,
        rotateX: 8,
        scale: 0.96,
        transformPerspective: 1000,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "building-2":
        return <Building2 className="w-5 h-5 text-slate-800" />;
      case "home":
        return <Home className="w-5 h-5 text-slate-800" />;
      case "house":
        return <Compass className="w-5 h-5 text-slate-800" />;
      case "map-pin":
        return <Trees className="w-5 h-5 text-slate-800" />;
      case "briefcase":
        return <Briefcase className="w-5 h-5 text-slate-800" />;
      case "key":
        return <Key className="w-5 h-5 text-slate-800" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-800" />;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mb-3">
            <span>Browse Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Explore by <br />
            <span className="text-blue-600">Property Type</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-md">
            Find the perfect property that suits your lifestyle and investment goals.
          </p>
        </div>

        <a
          href="#all-categories"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group cursor-pointer"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* 6 Property Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {PROPERTY_TYPES.map((type, index) => (
          <div
            key={type.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="group relative bg-white rounded-3xl p-3 sm:p-3.5 border border-slate-100/90 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-400 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Property Image Container */}
            <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={type.image}
                alt={type.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Circular category icon badge */}
              <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-md border border-white/80 transition-transform duration-300 group-hover:scale-110">
                {getCategoryIcon(type.icon)}
              </div>
            </div>

            {/* Card Content */}
            <div className="pt-4 pb-2 px-2 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {type.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {type.description}
                </p>
                <div className="text-[11px] font-semibold text-blue-600/90 mt-1.5">
                  {type.listings}
                </div>
              </div>

              {/* Circular Action Button */}
              <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm shrink-0 ml-2">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
