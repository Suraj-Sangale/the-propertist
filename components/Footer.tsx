"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ChevronUp,
  ShieldCheck,
  Sparkles,
  Heart,
  CheckCircle2,
  ArrowRight,
  BadgePercent,
  Car,
  FileCheck,
} from "lucide-react";
import { useWishlist } from "@/utilities/wishlist";

export default function Footer() {
  const { count: wishlistCount, isLoaded: isWishlistLoaded } = useWishlist();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#070a14] text-slate-400 overflow-hidden border-t border-[#c8a84b]/20 selection:bg-[#c8a84b] selection:text-black">
      {/* Top subtle golden shimmer line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#c8a84b]/50 to-transparent" />

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#c8a84b]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#2563eb]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* ─── 1. Trust & Value Strip ───────────────────────────── */}
      <div className="relative border-b border-white/5 bg-white/[0.015]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#c8a84b]/30 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c8a84b]/20 to-transparent border border-[#c8a84b]/30 flex items-center justify-center text-[#c8a84b] flex-shrink-0 group-hover:scale-105 transition-transform">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-white tracking-tight flex items-center gap-1.5">
                  0% Brokerage Direct
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Transparent direct-from-developer deals without hidden commissions.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#c8a84b]/30 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c8a84b]/20 to-transparent border border-[#c8a84b]/30 flex items-center justify-center text-[#c8a84b] flex-shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-white tracking-tight flex items-center gap-1.5">
                  100% RERA Verified
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Every listed project is verified with official MahaRERA registration IDs.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#c8a84b]/30 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c8a84b]/20 to-transparent border border-[#c8a84b]/30 flex items-center justify-center text-[#c8a84b] flex-shrink-0 group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-white tracking-tight flex items-center gap-1.5">
                  VIP Private Visits
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Complimentary scheduled site inspections with senior luxury advisors.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#c8a84b]/30 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c8a84b]/20 to-transparent border border-[#c8a84b]/30 flex items-center justify-center text-[#c8a84b] flex-shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-white tracking-tight flex items-center gap-1.5">
                  End-to-End Advisory
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Complete assistance with legal checks, home financing, and registration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. Main Footer Navigation ────────────────────────── */}
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Column (5 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-3 group mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c8a84b] via-[#b8963c] to-[#8a6a24] flex items-center justify-center text-[#0a0e1e] shadow-lg shadow-[#c8a84b]/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5 text-[#0a0e1e]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[21px] font-black tracking-tight leading-none text-white">
                    HomeSpace
                  </span>
                  <span className="text-[9.5px] font-bold tracking-[0.2em] text-[#c8a84b] uppercase mt-1">
                    THE PROPERTIST
                  </span>
                </div>
              </Link>

              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                Mumbai&apos;s premier luxury real estate portal. Discover verified ₹2 Cr+ high-rise apartments, penthouses, and modern residences with guaranteed zero brokerage.
              </p>

              {/* Status pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Specialist Advisors Online • Mumbai
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              <a
                href="tel:+917039529129"
                className="flex items-center gap-3 text-sm text-slate-300 hover:text-[#c8a84b] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#c8a84b] group-hover:bg-[#c8a84b]/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-semibold">+91 70395 29129</span>
                <span className="text-[11px] text-slate-500 ml-auto">Direct Hotline</span>
              </a>

              <a
                href="mailto:surajdsangale@gmail.com"
                className="flex items-center gap-3 text-sm text-slate-300 hover:text-[#c8a84b] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#c8a84b] group-hover:bg-[#c8a84b]/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-semibold">surajdsangale@gmail.com</span>
              </a>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Prime Localities (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b]" />
              Prime Localities
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: "Bandra West", key: "bandra_west", tag: "Prime" },
                { name: "Andheri West", key: "andheri_west", tag: "Popular" },
                { name: "Powai", key: "powai", tag: "Lakeside" },
                { name: "Jokhandwala", key: "jokhandwala", tag: "Luxury" },
                { name: "Kandivali East", key: "kandivali_east", tag: "Top Picks" },
                { name: "Goregaon West", key: "goregaon_west", tag: "High Rise" },
                { name: "Malad West", key: "malad_west", tag: "Modern" },
                { name: "Borivali West", key: "borivali_west", tag: "Suburbs" },
              ].map((loc) => (
                <li key={loc.key}>
                  <Link
                    href={`/listings?locality=${loc.key}`}
                    className="flex items-center justify-between py-1 text-slate-400 hover:text-white transition-colors group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {loc.name}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-400 group-hover:bg-[#c8a84b]/15 group-hover:text-[#c8a84b] transition-colors">
                      {loc.tag}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Leading Developers (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b]" />
              Top Developers
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: "Kalpataru Projects", key: "kalpataru", note: "Vian & Vienta" },
                { name: "Godrej Properties", key: "godrej", note: "Reserve & Prime" },
                { name: "Oberoi Realty", key: "oberoi", note: "Sky City & Splendor" },
                { name: "Lodha Group", key: "lodha", note: "Luxury Towers" },
                { name: "Rustomjee", key: "rustomjee", note: "Bandra & Juhu" },
              ].map((dev) => (
                <li key={dev.key}>
                  <Link
                    href={`/listings?developer=${dev.key}`}
                    className="flex items-center justify-between py-1 text-slate-400 hover:text-white transition-colors group"
                  >
                    <div className="flex flex-col">
                      <span className="group-hover:translate-x-1 transition-transform font-medium">
                        {dev.name}
                      </span>
                      <span className="text-[11px] text-slate-500">{dev.note}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#c8a84b] group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-5 border-t border-white/5">
              <Link
                href="/listings"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#c8a84b] hover:text-[#d4b55b] transition-colors group"
              >
                Browse All Developer Portfolios
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Useful Options / Quick Navigation (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b]" />
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/listings"
                  className="block py-1 text-slate-400 hover:text-white transition-colors hover:translate-x-1 transition-transform"
                >
                  All Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/listings?mode=buy&status=ready_to_move"
                  className="block py-1 text-slate-400 hover:text-white transition-colors hover:translate-x-1 transition-transform"
                >
                  Ready to Move In
                </Link>
              </li>
              <li>
                <Link
                  href="/listings?mode=buy&status=under_construction"
                  className="block py-1 text-slate-400 hover:text-white transition-colors hover:translate-x-1 transition-transform"
                >
                  Under Construction
                </Link>
              </li>
              <li>
                <Link
                  href="/listings?mode=rent"
                  className="block py-1 text-slate-400 hover:text-white transition-colors hover:translate-x-1 transition-transform"
                >
                  Properties for Rent
                </Link>
              </li>
              <li>
                <Link
                  href="/listings?status=new_launch"
                  className="block py-1 text-slate-400 hover:text-white transition-colors hover:translate-x-1 transition-transform"
                >
                  New Launches
                </Link>
              </li>
              <li>
                <Link
                  href="/saved"
                  className="flex items-center justify-between py-1 text-slate-400 hover:text-white transition-colors group"
                >
                  <span className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    Saved Homes
                  </span>
                  {isWishlistLoaded && wishlistCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>

            <div className="mt-8">
              <a
                href="tel:+917039529129"
                className="w-full h-10 rounded-xl bg-gradient-to-r from-[#c8a84b] to-[#b3832c] text-[#0a0e1e] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#c8a84b]/20 hover:opacity-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" /> Book Consultation
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. Legal & Bottom Bar ────────────────────────────── */}
      <div className="relative border-t border-white/5 bg-[#04060d]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-center md:text-left">
              <span>© {new Date().getFullYear()} HomeSpace • THE PROPERTIST. All rights reserved.</span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="text-slate-400">
                Direct Developer Real Estate Portal
              </span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="text-[#c8a84b] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> MahaRERA Certified
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Back to top button */}
              <button
                type="button"
                onClick={scrollToTop}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#c8a84b]/15 text-slate-400 hover:text-[#c8a84b] border border-white/10 hover:border-[#c8a84b]/30 transition-all cursor-pointer font-medium"
                aria-label="Back to top"
              >
                <span>Back to Top</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
