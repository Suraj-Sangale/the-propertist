"use client";

import React from "react";
import { Home, ShieldCheck, Star, MapPin } from "lucide-react";

export default function OverlapFeatures() {
  const features = [
    {
      id: "feat-1",
      title: "Verified Listings",
      subtitle: "100% authentic properties",
      icon: Home,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      id: "feat-2",
      title: "Trusted Agents",
      subtitle: "RERA approved professionals",
      icon: ShieldCheck,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      id: "feat-3",
      title: "Best Prices",
      subtitle: "Compare & save more",
      icon: Star,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      id: "feat-4",
      title: "Prime Locations",
      subtitle: "Homes in top neighbourhoods",
      icon: MapPin,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${item.bgColor} ${item.textColor} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
