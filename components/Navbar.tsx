"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  Heart,
  ChevronDown,
  Menu,
  X,
  User,
  PlusCircle,
  Building2,
} from "lucide-react";
import { NAV_LINKS } from "@/utilities/data";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Buy");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-white/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] border-b border-black/[0.04] py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
            <Home className="w-5 h-5" />
          </div>
          <span
            className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
              isScrolled ? "text-slate-900" : "text-slate-900"
            }`}
          >
            Home<span className="text-blue-600">Space</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                setActiveLink(link.label);
              }}
              className={`flex items-center gap-1.5 text-[15px] font-medium transition-all duration-200 cursor-pointer ${
                activeLink === link.label
                  ? "text-blue-600 font-semibold"
                  : isScrolled
                  ? "text-slate-600 hover:text-blue-600"
                  : "text-slate-800 hover:text-blue-600"
              }`}
            >
              {link.label}
              {link.hasDropdown && (
                <ChevronDown className="w-4 h-4 opacity-70 group-hover:translate-y-0.5 transition-transform" />
              )}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3.5">
          {/* Wishlist Button */}
          <button
            aria-label="Wishlist"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isScrolled
                ? "bg-slate-100/80 hover:bg-rose-50 text-slate-700 hover:text-rose-500"
                : "bg-white/80 hover:bg-rose-50 text-slate-700 hover:text-rose-500 shadow-sm backdrop-blur-md"
            }`}
          >
            <Heart className="w-5 h-5 transition-transform active:scale-90 hover:scale-110" />
          </button>

          {/* List Property Button */}
          <a
            href="#list-property"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-slate-900/10 hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Property</span>
          </a>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 cursor-pointer group">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm transition-transform group-hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-blue-600 group-hover:translate-y-0.5 transition-all" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/80 backdrop-blur-md text-slate-800 shadow-sm border border-black/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-6 py-5 shadow-xl animate-in fade-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.label);
                  setMobileMenuOpen(false);
                }}
                className={`text-lg font-medium py-1.5 ${
                  activeLink === link.label ? "text-blue-600 font-bold" : "text-slate-700"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href="#list-property"
                className="flex-1 text-center py-3 rounded-full bg-blue-600 text-white font-semibold text-sm shadow-md shadow-blue-500/25"
              >
                List Property
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
