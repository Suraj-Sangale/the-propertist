"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Home as HomeIcon, Trees, ArrowUpRight } from "lucide-react";
import { CATEGORY_CARDS } from "@/utilities/data";

export default function CategoryCards3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;
    const container = containerRef.current;

    if (!card1 || !card2 || !card3 || !container) return;

    // Set initial 3D transform states
    gsap.set(card1, {
      rotateY: -14,
      rotateX: 3,
      rotateZ: -3,
      scale: 1,
      transformPerspective: 1400,
      transformOrigin: "center center",
    });

    gsap.set(card2, {
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
      scale: 1,
      transformPerspective: 1400,
      transformOrigin: "center center",
    });

    gsap.set(card3, {
      rotateY: 14,
      rotateX: 3,
      rotateZ: 3,
      scale: 1,
      transformPerspective: 1400,
      transformOrigin: "center center",
    });

    // GSAP ScrollTrigger for continuous 3D un-tilting to front-facing state
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 80%",
      end: "bottom 30%",
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress; // 0 to 1

        // Smoothly interpolate from initial rotation to 0deg front-facing
        gsap.to(card1, {
          rotateY: -14 * (1 - p),
          rotateX: 3 * (1 - p),
          rotateZ: -3 * (1 - p),
          scale: 1 + p * 0.05,
          boxShadow: `0 ${20 + p * 15}px ${40 + p * 20}px -10px rgba(15, 23, 42, ${0.15 + p * 0.08})`,
          overwrite: "auto",
          duration: 0.1,
        });

        gsap.to(card2, {
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          scale: 1 + p * 0.05,
          boxShadow: `0 ${24 + p * 16}px ${45 + p * 20}px -10px rgba(15, 23, 42, ${0.18 + p * 0.08})`,
          overwrite: "auto",
          duration: 0.1,
        });

        gsap.to(card3, {
          rotateY: 14 * (1 - p),
          rotateX: 3 * (1 - p),
          rotateZ: 3 * (1 - p),
          scale: 1 + p * 0.05,
          boxShadow: `0 ${20 + p * 15}px ${40 + p * 20}px -10px rgba(15, 23, 42, ${0.15 + p * 0.08})`,
          overwrite: "auto",
          duration: 0.1,
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const getIcon = (id: string) => {
    switch (id) {
      case "card-1":
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case "card-2":
        return <HomeIcon className="w-4 h-4 text-emerald-600" />;
      case "card-3":
        return <Trees className="w-4 h-4 text-amber-600" />;
      default:
        return <Building2 className="w-4 h-4 text-blue-600" />;
    }
  };

  const getCardRef = (index: number) => {
    if (index === 0) return card1Ref;
    if (index === 1) return card2Ref;
    return card3Ref;
  };

  return (
    <div
      ref={containerRef}
      className="perspective-container relative w-full flex items-center justify-center lg:justify-end gap-3 sm:gap-4 md:gap-5 py-6 px-2 sm:px-4"
    >
      {CATEGORY_CARDS.map((card, idx) => {
        const cardRef = getCardRef(idx);
        return (
          <div
            key={card.id}
            ref={cardRef}
            className="preserve-3d relative w-36 sm:w-44 md:w-52 lg:w-56 bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl p-2.5 sm:p-3 md:p-3.5 shadow-card-3d border border-white/80 cursor-pointer transition-all duration-300 hover:scale-[1.06] hover:z-30 group"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform, box-shadow",
            }}
          >
            {/* Card Image Container */}
            <div className="relative w-full h-32 sm:h-36 md:h-44 rounded-xl md:rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Corner floating badge */}
              <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 transition-all duration-300">
                <ArrowUpRight className="w-4 h-4 text-slate-900" />
              </div>
            </div>

            {/* Card Info */}
            <div className="mt-3 px-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                {getIcon(card.id)}
                <span>{card.location}</span>
              </div>
              <h4 className="text-xs sm:text-sm md:text-[15px] font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                {card.title}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}
