"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OverlapFeatures from "@/components/OverlapFeatures";
import WhyChooseSection from "@/components/WhyChooseSection";
import PropertyTypesSection from "@/components/PropertyTypesSection";
import TrustStatsSection from "@/components/TrustStatsSection";
import LatestPropertiesSection from "@/components/LatestPropertiesSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const whiteSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const whiteSection = whiteSectionRef.current;
    const heroWrapper = heroWrapperRef.current;

    if (!whiteSection || !heroWrapper) return;

    // Cinematic overlap transition using ScrollTrigger
    const overlapTrigger = ScrollTrigger.create({
      trigger: whiteSection,
      start: "top 90%",
      end: "top 20%",
      scrub: 1,
      onUpdate: (self) => {
        // As white section moves upward over hero, add subtle elevation and scale stability
        const progress = self.progress;
        gsap.to(whiteSection, {
          boxShadow: `0 -${15 + progress * 25}px ${40 + progress * 30}px -10px rgba(15, 23, 42, ${
            0.06 + progress * 0.1
          })`,
          overwrite: "auto",
        });
      },
    });

    return () => {
      overlapTrigger.kill();
    };
  }, []);

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-white selection:bg-blue-600 selection:text-white font-sans antialiased text-slate-900">
        {/* Fixed / Frosted Navbar */}
        <Navbar />

        {/* 1. Hero Section Container */}
        <div ref={heroWrapperRef} className="relative z-10">
          <Hero />
        </div>

        {/* 2. White Content Section (Overlaps the bottom of the Hero) */}
        <main
          ref={whiteSectionRef}
          className="relative z-20 -mt-12 sm:-mt-16 md:-mt-24 rounded-t-[36px] sm:rounded-t-[48px] md:rounded-t-[60px] bg-white shadow-[0_-25px_60px_-15px_rgba(15,23,42,0.12)] border-t border-slate-100/90 pt-4"
        >
          {/* Overlap Feature Ribbon */}
          <OverlapFeatures />

          {/* 3. Why Choose HomeSpace Section */}
          <div className="border-t border-slate-100/60">
            <WhyChooseSection />
          </div>

          {/* 4. Explore by Property Type Section */}
          <div className="bg-slate-50/60 border-y border-slate-100/80">
            <PropertyTypesSection />
          </div>

          {/* 5. Statistics / Trust Section */}
          <TrustStatsSection />

          {/* 6. Latest / Featured Properties Section */}
          <div className="border-t border-slate-100/60">
            <LatestPropertiesSection />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
