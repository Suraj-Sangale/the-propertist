import React from "react";
import Link from "next/link";
import { Building2, Home, ArrowLeft, Search, Compass, Phone } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | The Propertist",
  description: "The page you are looking for cannot be found. Explore verified luxury properties in Mumbai on The Propertist.",
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-white">
      {/* Subtle ambient luxury background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c8a84b]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#2563eb]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#c8a84b]/30 shadow-sm text-xs font-bold text-[#b8963c] uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b]" />
          Error 404 • Page Not Found
        </div>

        {/* Big Classic 404 Display */}
        <div className="relative mb-6 select-none">
          <span className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#1a1a2e] to-[#475569] leading-none">
            404
          </span>
          <div className="absolute -inset-x-4 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#c8a84b]/30 to-transparent pointer-events-none" />
        </div>

        {/* Classic Headline & Subtext */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight mb-3">
          Looks Like You&apos;ve Stepped Off the Map
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
          The property or page you are looking for has been moved, renamed, or is currently unavailable.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <Link
            href="/"
            className="w-full sm:w-auto h-12 px-7 rounded-xl bg-gradient-to-r from-[#c8a84b] via-[#d4b55b] to-[#b3832c] text-[#0a0e1e] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#c8a84b]/20 hover:opacity-95 transition-all"
          >
            <Home className="w-4 h-4" /> Back to Homepage
          </Link>

          <Link
            href="/listings"
            className="w-full sm:w-auto h-12 px-7 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#1a1a2e] hover:border-slate-300 font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Compass className="w-4 h-4 text-[#c8a84b]" /> Explore Properties
          </Link>
        </div>

        {/* Helpful Popular Destinations */}
        <div className="pt-8 border-t border-slate-200/80">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Popular Destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Bandra West", href: "/listings?locality=bandra_west" },
              { label: "Andheri West", href: "/listings?locality=andheri_west" },
              { label: "Ready to Move", href: "/listings?status=ready_to_move" },
              { label: "Under Construction", href: "/listings?status=under_construction" },
              { label: "Saved Homes", href: "/saved" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#c8a84b]/40 hover:text-[#b8963c] px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Quick Concierge Support */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Need direct assistance?</span>
            <a
              href="tel:+917039529129"
              className="font-bold text-[#b8963c] hover:underline flex items-center gap-1"
            >
              <Phone className="w-3 h-3" /> +91 70395 29129
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
