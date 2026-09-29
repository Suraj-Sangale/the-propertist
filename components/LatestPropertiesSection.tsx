"use client";

import React, { useState, useRef } from "react";
import {
  Heart,
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { LATEST_PROPERTIES } from "@/utilities/data";

export default function LatestPropertiesSection() {
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 380;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Section Header with Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 md:mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>New Listings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Latest Properties
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-md">
            Discover the newest handpicked properties added to our platform.
          </p>
        </div>

        {/* Carousel Arrow Controls and View All */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a
            href="#all-properties"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors mr-2 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={() => scroll("left")}
            aria-label="Previous properties"
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-sm hover:shadow transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            aria-label="Next properties"
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-sm hover:shadow transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Property Cards Container */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-2 px-1 no-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {LATEST_PROPERTIES.map((property) => {
          const isFav = !!favorites[property.id];
          return (
            <div
              key={property.id}
              className="snap-start shrink-0 w-[290px] sm:w-[330px] md:w-[360px] bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-400 group cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container with Badges */}
              <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={property.image}
                  alt={property.type}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Status Tag */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md ${property.tagColor}`}
                  >
                    {property.tag}
                  </span>
                </div>

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(property.id, e)}
                  aria-label="Favorite property"
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-md transition-all duration-300 active:scale-75 ${
                    isFav
                      ? "bg-rose-500 text-white scale-110"
                      : "bg-white/85 text-slate-700 hover:text-rose-500 hover:bg-white"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${
                      isFav ? "fill-white" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Property Details */}
              <div className="p-3">
                {/* Price and Title */}
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {property.price}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {property.type}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>

                {/* Property Specs (Area, Beds, Baths) */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Maximize className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{property.area}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{property.baths} Baths</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
