"use client";

import React from "react";
import {
  Home,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Globe,
  Share2,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Company Brand Col */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Home<span className="text-blue-500">Space</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              India&apos;s leading tech-driven real estate platform for buying, renting,
              and investing in luxury verified properties with zero hassle.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Social Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Chat support"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Luxury Apartments
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Independent Villas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Premium Plots
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Commercial Spaces
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  New Projects 2026
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Top Cities
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Mumbai Real Estate
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Bangalore Tech Corridor
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pune Premium Living
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Gurgaon Cyber City
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Hyderabad Financial Dist.
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Stay Updated
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get curated luxury market insights & new launches.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>© {new Date().getFullYear()} HomeSpace Technologies Inc. All rights reserved. RERA Certified.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
