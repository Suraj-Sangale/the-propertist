"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, Heart, User, ChevronRight, ChevronLeft, MapPin, 
  Share2, ShieldCheck, PlayCircle, Maximize2, Download, 
  CheckCircle2, Star, Building2, Map, LayoutDashboard, Trees, 
  Dumbbell, Gamepad2, Menu, X, Waves, Mail, Loader2, Sparkles, Phone
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useWishlist, useWishlistItem } from "@/utilities/wishlist";
import { ALL_PROPERTIES } from "@/utilities/masterData";


gsap.registerPlugin(ScrollTrigger);

export default function PropertyDetailsClient({ property }: { property: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP animations (safe without trapping opacity)
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        const animEls = containerRef.current?.querySelectorAll(".animate-up");
        if (animEls && animEls.length > 0) {
          gsap.fromTo(
            animEls,
            { y: 15 },
            {
              y: 0,
              duration: 0.5,
              stagger: 0.05,
              ease: "power2.out",
              clearProps: "all",
            }
          );
        }
      }, containerRef);
      return () => {
        ctx.revert();
        lenis.destroy();
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f3f4f6] text-[#1a1a2e] selection:bg-[#c8a84b] selection:text-white">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-28">
        
        {/* 2. BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#c8a84b] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/listings" className="hover:text-[#c8a84b] transition-colors">Mumbai</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/listings?locality=${property.locality_key}`} className="hover:text-[#c8a84b] transition-colors">{property.locality}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1a1a2e] capitalize">{property.projectName}</span>
        </nav>

        {/* 3. MAIN PROPERTY HERO AREA */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Left: Gallery (65%) */}
          <div className="w-full lg:w-[65%]">
            <PropertyGallery property={property} onOpenFullscreen={() => setIsGalleryOpen(true)} />
          </div>

          {/* Right: Summary Card (35%) */}
          <div className="w-full lg:w-[35%] flex flex-col gap-6">
            <PropertySummary property={property} />
          </div>
        </div>

        {/* Sticky Layout for Details & Enquiry */}
        <div className="flex flex-col-reverse lg:flex-row gap-8 relative items-start">
          
          {/* Left Main Content */}
          <div className="w-full lg:w-[65%] flex flex-col gap-12">
            
            {/* 9. PROPERTY NAVIGATION TABS */}
            <PropertyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex flex-col gap-16">
              {/* 10. PROJECT OVERVIEW */}
              <ProjectOverview property={property} />

              {/* 11. AMENITIES */}
              <AmenitiesSection />

              {/* 12. FLOOR PLAN SECTION */}
              <FloorPlanSection property={property} />

              {/* 13. LOCATION SECTION */}
              <LocationSection property={property} />

              {/* 14. BROCHURE SECTION */}
              <BrochureCard />

              {/* 15. DEVELOPER SECTION */}
              <DeveloperSection property={property} />

              {/* 16. REVIEWS SECTION */}
              <ReviewsSection />
            </div>
          </div>

          {/* Right Sticky Column */}
          <div className="w-full lg:w-[35%] lg:sticky lg:top-[120px] flex flex-col gap-6">
            {/* 6. ENQUIRY FORM */}
            <div id="enquiry-form" className="scroll-mt-28">
              <EnquiryForm property={property} />
            </div>
            
            {/* 7. WHY CHOOSE PROPERTY CARD */}
            <WhyChooseCard property={property} />
          </div>
        </div>
      </main>

      {/* 17. SIMILAR PROPERTIES */}
      <SimilarProperties />

      {/* 18. FINAL CTA */}
      <FinalCTA />

      {/* LIGHTBOX GALLERY MODAL */}
      {isGalleryOpen && (
        <FullscreenGallery property={property} onClose={() => setIsGalleryOpen(false)} />
      )}
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================



function PropertyGallery({ property, onOpenFullscreen }: { property: any, onOpenFullscreen: () => void }) {
  const { isLiked, toggle } = useWishlistItem(property?.id ?? property?.slug ?? "");
  const gallery = property?.gallery || [];
  const imageCount = gallery.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageCount > 0) {
      setCurrentIndex((prev) => (prev + 1) % imageCount);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageCount > 0) {
      setCurrentIndex((prev) => (prev - 1 + imageCount) % imageCount);
    }
  };

  return (
    <div className="w-full h-[400px] sm:h-[500px]">
      <div 
        className="relative h-full rounded-2xl overflow-hidden cursor-pointer group shadow-[0_8px_30px_rgba(20,35,70,0.08)] animate-up"
        onClick={onOpenFullscreen}
      >
        <Image 
          src={gallery[currentIndex] || property?.image || "/images/projects/Untitled-design-20.webp"} 
          alt={`${property?.projectName} Hero`} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        
        <div className="absolute top-4 left-4 bg-[#FF3B30] text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wide shadow-lg">
          <ShieldCheck className="w-3.5 h-3.5" />
          Offers
        </div>

        <button 
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg z-10 ${isLiked ? "text-red-500" : "text-slate-700 hover:text-red-500"}`} 
          onClick={toggle}
        >
          <Heart 
            className="w-5 h-5" 
            fill={isLiked ? "#ef4444" : "none"} 
            stroke={isLiked ? "#ef4444" : "currentColor"} 
          />
        </button>

        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Map className="w-3.5 h-3.5" />
          {imageCount > 0 ? currentIndex + 1 : 1} / {imageCount || 1}
        </div>

        {imageCount > 1 && (
          <>
            <button 
              className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all hover:bg-white z-10 shadow-lg"
              onClick={prevImage}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all hover:bg-white z-10 shadow-lg"
              onClick={nextImage}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PropertySummary({ property }: { property: any }) {
  const { isLiked, toggle: toggleSave } = useWishlistItem(property?.id ?? property?.slug ?? "");

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-7 shadow-[0_8px_30px_rgba(20,35,70,0.05)] border border-slate-100 flex flex-col h-full justify-between animate-up">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center overflow-hidden">
               <Image src={property.image || "/images/projects/Untitled-design-20.webp"} width={40} height={40} alt="Logo" className="object-cover" />
            </div>
            <div className="flex items-center gap-1.5 bg-[#F0FDF4] text-[#15803D] px-2.5 py-1 rounded-full border border-[#15803D]/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">RERA Approved</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={toggleSave}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all px-3 py-1.5 rounded-full border ${
                isLiked 
                  ? "border-red-200 bg-red-50 text-red-600" 
                  : "border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-500"
              }`}
            >
              <Heart className="w-4 h-4" fill={isLiked ? "#ef4444" : "none"} stroke={isLiked ? "#ef4444" : "currentColor"} />
              <span>{isLiked ? "Saved" : "Save"}</span>
            </button>
            {/* <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#c8a84b] transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button> */}
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-[#1a1a2e] tracking-tight mb-2 capitalize">{property.projectName}</h1>
        <p className="flex items-center gap-1.5 text-slate-500 text-sm font-medium mb-5">
          <MapPin className="w-4 h-4 text-[#c8a84b]" />
          {property.locality_label}, Mumbai
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {['Premium Project', 'High Rise Towers', 'Modern Amenities'].map(pill => (
            <span key={pill} className="bg-[#f3f4f6] text-[#1a1a2e] px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-100 flex items-center gap-1">
              <Star className="w-3 h-3 text-[#D9A441] fill-[#D9A441]" /> {pill}
            </span>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-6 mb-6 flex items-end justify-between">
          <div>
            <div className="text-3xl font-black text-[#1a1a2e] tracking-tight leading-none mb-1">
              {property.priceFrom}
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-bold text-[#c8a84b] hover:underline">
            Price List <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 flex gap-3 items-center hover:bg-slate-50 transition-colors">
           <Building2 className="w-5 h-5 text-slate-400" />
           <div className="flex flex-col">
             <span className="text-[13px] font-bold text-[#1a1a2e]">{property.beds}</span>
             <span className="text-[11px] font-medium text-slate-500">Configurations</span>
           </div>
        </div>
        <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 flex gap-3 items-center hover:bg-slate-50 transition-colors">
           <Map className="w-5 h-5 text-slate-400" />
           <div className="flex flex-col">
             <span className="text-[13px] font-bold text-[#1a1a2e]">{property.area}</span>
             <span className="text-[11px] font-medium text-slate-500">Super Built-up sq.ft</span>
           </div>
        </div>
        <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 flex gap-3 items-center hover:bg-slate-50 transition-colors">
           <LayoutDashboard className="w-5 h-5 text-slate-400" />
           <div className="flex flex-col">
             <span className="text-[13px] font-bold text-[#1a1a2e]">Dec 2026</span>
             <span className="text-[11px] font-medium text-slate-500">Possession</span>
           </div>
        </div>
      </div>

      {/* Quick Enquiry CTA */}
      <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("enquiry-form");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              const firstInput = el.querySelector("input");
              if (firstInput) (firstInput as HTMLInputElement).focus();
            }
          }}
          className="flex-1 h-12 py-3 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#b3832c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:opacity-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" /> Instant VIP Enquiry
        </button>
        <a
          href="tel:+919876543210"
          className="h-12 px-5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <Phone className="w-4 h-4 text-[#D9A441]" /> Call Advisor
        </a>
      </div>
    </div>
  );
}

function EnquiryForm({ property }: { property: any }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    const cleanedPhone = phone.trim().replace(/\D/g, "");
    if (!cleanedPhone || cleanedPhone.length < 8) {
      setErrorMsg("Please enter a valid phone number (at least 8-10 digits).");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          propertyTitle: property?.projectName || property?.name || "Luxury Residence",
          propertyLocality: property?.locality_label || property?.locality || "Mumbai",
          propertyPrice: property?.priceFrom || property?.priceLabel || "Price on Request",
          propertySlug: property?.slug || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry. Please try again.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1a2e] rounded-3xl p-7 shadow-xl shadow-[#1a1a2e]/20 text-white relative overflow-hidden group transition-all duration-300 border border-[#c8a84b]/20">
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#c8a84b]/15 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c8a84b]/15 border border-[#c8a84b]/30 text-[#ebd9a2] text-[11px] font-bold tracking-wider uppercase mb-3">
          <Sparkles className="w-3 h-3 text-[#c8a84b]" /> Zero Brokerage Direct
        </div>
        <h3 className="text-[22px] font-bold mb-1.5 text-white">Interested in this Property?</h3>
        <p className="text-slate-300 text-xs sm:text-sm font-medium mb-5 leading-relaxed">
          Request official brochure, pricing sheets, and arrange a private VIP site visit.
        </p>

        {submitted ? (
          <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-5 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Enquiry Sent Successfully!</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                A confirmation has been sent to <strong className="text-[#c8a84b]">{email}</strong>. Our senior property advisor will reach out to you shortly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setPhone("");
                setErrorMsg(null);
              }}
              className="text-xs font-bold text-[#c8a84b] hover:underline mt-1"
            >
              Submit another enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {errorMsg && (
              <div className="bg-red-500/15 border border-red-500/40 text-red-300 text-xs px-3.5 py-2.5 rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            {/* Name Field */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full h-[48px] bg-white/10 border border-white/15 rounded-xl pl-11 pr-4 text-sm font-medium text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/50 focus:border-[#c8a84b] transition-all"
              />
            </div>

            {/* Email Field (Added as requested) */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full h-[48px] bg-white/10 border border-white/15 rounded-xl pl-11 pr-4 text-sm font-medium text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/50 focus:border-[#c8a84b] transition-all"
              />
            </div>

            {/* Phone Number Field */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/60">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                required
                maxLength={10}
                className="w-full h-[48px] bg-white/10 border border-white/15 rounded-xl pl-12 pr-4 text-sm font-medium text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/50 focus:border-[#c8a84b] transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[50px] bg-gradient-to-r from-[#c8a84b] via-[#d4b55b] to-[#b5953e] text-[#0a0e1e] font-extrabold text-[15px] rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c8a84b]/25 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending Details...
                </>
              ) : (
                <>
                  Get Instant Details <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center mt-1">
              🔒 Your contact information is safe. Zero spam guaranteed.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function WhyChooseCard({ property }: { property: any }) {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg h-[280px] group animate-up cursor-pointer hover:-translate-y-1 transition-transform duration-300">
      <Image src={property.image || "/images/projects/Untitled-design-18.webp"} alt="Why choose" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/95 via-[#1a1a2e]/80 to-transparent p-7 flex flex-col justify-center">
        <h4 className="text-white font-bold text-lg mb-4">Why Choose {property.projectName}?</h4>
        <ul className="flex flex-col gap-2.5">
          {['Prime location in Western Suburbs', 'Excellent connectivity', 'World-class amenities', 'Reputed developer', 'High investment potential'].map((point, i) => (
            <li key={i} className="flex items-center gap-2 text-white/90 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#c8a84b]" /> {point}
            </li>
          ))}
        </ul>
        {/* <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg border border-white/30 group-hover:bg-[#c8a84b] group-hover:text-white transition-all">
          <PlayCircle className="w-6 h-6 ml-0.5" />
        </div> */}
      </div>
    </div>
  );
}

function PropertyTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'price', label: 'Price & Floor Plan' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'location', label: 'Location' },
    { id: 'brochure', label: 'Brochure' },
    { id: 'developer', label: 'Developer' },
    { id: 'reviews', label: 'Reviews' },
  ];
  const onClickTab =(tab:any)=>{
    setActiveTab(tab.id);
    const el = document.getElementById(tab.id);
      if (el) {
    const headerHeight = 96;
    const extraGap = 70;
      const rect = el.getBoundingClientRect();
      const scrollTop =
      window.scrollY + rect.top - headerHeight - extraGap;
      window.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  }

  return (
    <div className="bg-white rounded-2xl p-2 shadow-[0_4px_20px_rgba(20,35,70,0.04)] border border-slate-100 sticky top-[96px] z-30 animate-up overflow-hidden">
      <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => onClickTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#1a1a2e] text-[#c8a84b]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectOverview({ property }: { property: any }) {
  return (
    <section className="animate-up scroll-mt-32" id="overview">
      <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Project Overview</h2>
      <p className="text-slate-600 leading-relaxed font-medium mb-8">
        {property.projectName} is a premium residential project in {property.locality_label}, Mumbai, offering luxurious {property.beds} apartments with world-class amenities and excellent connectivity. Designed for modern families, it combines comfort, elegance, and convenience in a serene environment.
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
        {[
          { icon: Map, label: 'Land Parcel', value: '5 Acres' },
          { icon: Building2, label: 'Total Towers', value: '4 Towers' },
          { icon: LayoutDashboard, label: 'Total Units', value: '450 Units' },
          { icon: MapPin, label: 'Unit Variants', value: property.beds },
          { icon: CheckCircle2, label: 'Possession', value: 'Dec 2026' }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <stat.icon className="w-4 h-4" /> {stat.label}
            </div>
            <div className="text-base font-bold text-[#1a1a2e]">{stat.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AmenitiesSection() {
  const amenities = [
    { icon: Trees, label: 'Club House' },
    { icon: Waves, label: 'Swimming Pool' },
    { icon: Dumbbell, label: 'Gymnasium' },
    { icon: Gamepad2, label: 'Kids Play Area' },
    { icon: Trees, label: 'Landscape Garden' },
    { icon: MapPin, label: 'Jogging Track' },
    { icon: LayoutDashboard, label: 'Indoor Games' },
    { icon: ShieldCheck, label: '24/7 Security' }
  ];

  return (
    <section className="animate-up scroll-mt-32" id="amenities">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1a1a2e]">Amenities</h2>
        <button className="text-[#c8a84b] text-sm font-semibold hover:underline flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {amenities.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_15px_rgba(20,35,70,0.03)] flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 rounded-full bg-[#1a1a2e]/5 text-[#c8a84b] flex items-center justify-center">
              <item.icon className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <span className="text-[13px] font-bold text-[#1a1a2e] text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FloorPlanSection({ property }: { property: any }) {
  // Build tabs from property config keys
  const configKeys: string[] = property?.config_keys || [];
  const bhkLabels = configKeys
    .map((k: string) => {
      const match = k.match(/^(\d(?:_\d)*)_bhk$/);
      if (!match) return null;
      const nums = match[1].split('_');
      return nums.map(n => `${n} BHK`);
    })
    .flat()
    .filter(Boolean);

  // Deduplicate and keep insertion order
  const tabs: string[] = bhkLabels.length
    ? Array.from(new Set(bhkLabels as string[]))
    : ['All'];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);

  // Derive per-tab details from property data (approximate from area string)
  const areaString: string = property?.area || '1000 – 2000 sq.ft';
  const areaParts = areaString.replace(/sq\.ft/gi, '').trim().split('–').map((s: string) => s.trim());
  const minArea = parseInt(areaParts[0]) || 1000;
  const maxArea = parseInt(areaParts[1] || areaParts[0]) || 2000;
  const totalTabs = tabs.length;

  function getTabDetails(tab: string, idx: number) {
    const step = totalTabs > 1 ? (maxArea - minArea) / (totalTabs - 1) : 0;
    const superArea = Math.round(minArea + step * idx);
    const carpetArea = Math.round(superArea * 0.76);
    return {
      label: `${tab} - Type A`,
      superArea: `${superArea} sq.ft`,
      carpetArea: `${carpetArea} sq.ft`,
      price: property?.priceFrom || 'On Request',
    };
  }

  const activeIdx = tabs.indexOf(activeTab);
  const details = getTabDetails(activeTab, activeIdx);
  const floorPlanImage = property?.floorPlans?.[activeIdx]?.image || '/images/projects/floor_plan-2.jpg';

  // Lock scroll + Escape key when modal open
  useEffect(() => {
    if (!floorPlanOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFloorPlanOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKey);
    };
  }, [floorPlanOpen]);

  return (
    <>
      <section className="animate-up scroll-mt-32" id="price">
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Floor Plan</h2>
        
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(20,35,70,0.03)]">
          {/* Tab toggle */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-sm font-bold rounded-full transition-colors ${
                  activeTab === tab
                    ? 'bg-[#1a1a2e] text-[#c8a84b]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-center bg-[#f3f4f6] rounded-2xl p-6">
            {/* Thumbnail — click to enlarge */}
            <div
              className="w-full sm:w-[40%] bg-white rounded-xl p-4 shadow-sm border border-slate-100 relative group cursor-pointer"
              onClick={() => setFloorPlanOpen(true)}
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={floorPlanImage}
                  alt="Floor Plan"
                  fill
                  className="object-contain opacity-50 group-hover:opacity-80 transition-opacity"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-[#1a1a2e] px-4 py-2 rounded-full shadow-lg text-[#c8a84b] font-bold text-xs flex items-center gap-2 group-hover:scale-105 transition-transform">
                   <Maximize2 className="w-3.5 h-3.5" /> Enlarge
                 </div>
              </div>
            </div>
            
            <div className="w-full sm:w-[60%] flex flex-col gap-5">
              <h3 className="text-xl font-bold text-[#1a1a2e]">{details.label}</h3>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Super Built-up Area</span>
                  <span className="text-base font-bold text-[#1a1a2e]">{details.superArea}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Carpet Area</span>
                  <span className="text-base font-bold text-[#1a1a2e]">{details.carpetArea}</span>
                </div>
              </div>
              <div className="flex flex-col pt-2">
                 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Price</span>
                 <span className="text-2xl font-black text-[#1a1a2e]">{details.price} <span className="text-sm font-medium text-slate-500 ml-1">Onwards</span></span>
              </div>
              <button
                onClick={() => setFloorPlanOpen(true)}
                className="w-fit mt-2 border border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-[#c8a84b] transition-colors font-bold text-sm px-6 py-2.5 rounded-full flex items-center gap-2"
              >
                View Floor Plan <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floor Plan Lightbox */}
      {floorPlanOpen && (
        <div
          className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setFloorPlanOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span className="font-bold text-[#1a1a2e] text-sm">{details.label} — Floor Plan</span>
              <button
                onClick={() => setFloorPlanOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Full floor plan image */}
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={floorPlanImage}
                alt={`${details.label} Floor Plan`}
                fill
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LocationSection({ property }: { property: any }) {
  const locations = [
    { name: 'Oberoi Mall', time: '5 mins' },
    { name: 'Western Express Highway', time: '10 mins' },
    { name: 'Goregaon Station', time: '15 mins' },
    { name: 'International Airport', time: '25 mins' }
  ];

  return (
    <section className="animate-up scroll-mt-32" id="location">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1a1a2e]">Location</h2>
        <button className="text-[#c8a84b] text-sm font-semibold hover:underline flex items-center gap-1">
          View on Maps <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-slate-100 shadow-[0_4px_25px_rgba(20,35,70,0.03)] rounded-3xl p-6 flex flex-col sm:flex-row gap-8">
        <div className="w-full sm:w-[45%] flex flex-col justify-center gap-4">
          {locations.map((loc, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#c8a84b]" />
                </div>
                <span className="font-semibold text-[14px] text-slate-700">{loc.name}</span>
              </div>
              <span className="text-[13px] font-bold text-slate-400">{loc.time}</span>
            </div>
          ))}
        </div>
       <div className="w-full sm:w-[55%] relative h-[250px] rounded-2xl overflow-hidden bg-slate-100 group">
  <iframe
    src="https://www.google.com/maps?q=Mumbai,Maharashtra,India&output=embed"
    className="w-full h-full border-0"
    loading="lazy"
    allowFullScreen
    referrerPolicy="no-referrer-when-downgrade"
  />

  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
  <div className="relative flex flex-col items-center group-hover:-translate-y-2 transition-transform duration-300">

    {/* Pulse */}
    <div className="absolute top-[38px] w-12 h-12 rounded-full bg-[#FF3B30]/30 animate-ping" />

    {/* Label */}
    <div className="relative z-10 bg-[#1a1a2e] px-3 py-1.5 rounded-lg shadow-xl border border-[#c8a84b]/30 mb-2">
      <span className="text-xs sm:text-sm font-bold text-[#c8a84b] whitespace-nowrap">
        {property.projectName}
      </span>

      {/* Label arrow */}
      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#1a1a2e] rotate-45 border-r border-b border-[#c8a84b]/30" />
    </div>

    {/* Pin */}
    <div className="relative z-10">
      <div className="w-10 h-10 bg-[#FF3B30] rounded-full rounded-br-none rotate-45 shadow-[0_5px_15px_rgba(0,0,0,0.35)] flex items-center justify-center">
        <div className="w-3.5 h-3.5 bg-white rounded-full -rotate-45 shadow-inner" />
      </div>
    </div>

  </div>
</div>
</div>
      </div>
    </section>
  );
}

function BrochureCard() {
  return (
    <section className="animate-up scroll-mt-32" id="brochure">
       <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgba(20,35,70,0.04)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(20,35,70,0.08)] transition-all">
         <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-[#c8a84b]/10 to-transparent pointer-events-none" />
         <div className="flex items-start gap-5 relative z-10">
           <div className="w-16 h-16 rounded-2xl bg-[#1a1a2e] text-[#c8a84b] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
             <Download className="w-7 h-7" />
           </div>
           <div>
             <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Brochure & Price List</h3>
             <p className="text-slate-500 text-sm font-medium">Download project brochure, price list and floor plan details.</p>
           </div>
         </div>
         <button className="flex-shrink-0 bg-white border-2 border-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-[#c8a84b] text-[#1a1a2e] font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-sm z-10">
           Download Now <Download className="w-4 h-4" />
         </button>
       </div>
    </section>
  );
}

function DeveloperSection({ property }: { property: any }) {
  return (
    <section className="animate-up scroll-mt-32" id="developer">
      <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">About the Developer</h2>
      <div className="bg-white border border-slate-100 shadow-[0_4px_25px_rgba(20,35,70,0.03)] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="w-20 h-20 bg-[#f3f4f6] rounded-2xl flex items-center justify-center border border-slate-100">
             <Image src="/images/projects/Untitled-design-20.webp" width={50} height={50} alt="Dev logo" className="rounded-lg object-cover" />
           </div>
           <div>
             <h3 className="text-lg font-bold text-[#1a1a2e]">{property.developer}</h3>
             <div className="flex items-center gap-4 mt-2">
               <div className="flex flex-col">
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Experience</span>
                 <span className="text-sm font-bold text-[#1a1a2e]">50+ Years</span>
               </div>
               <div className="w-px h-6 bg-slate-200" />
               <div className="flex flex-col">
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Projects</span>
                 <span className="text-sm font-bold text-[#1a1a2e]">105 Delivered</span>
               </div>
             </div>
           </div>
        </div>
        <button className="text-[#c8a84b] font-bold text-sm px-6 py-2.5 rounded-full bg-[#1a1a2e] hover:bg-[#c8a84b] hover:text-[#1a1a2e] transition-colors">
          View Developer
        </button>
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="animate-up scroll-mt-32" id="reviews">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1a1a2e]">Resident & Buyer Reviews</h2>
        <div className="flex items-center gap-2 bg-[#FFFAF0] text-[#D9A441] px-4 py-1.5 rounded-full border border-[#D9A441]/20">
          <Star className="w-4 h-4 fill-[#D9A441]" />
          <span className="font-bold text-sm">4.5 / 5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex gap-1 mb-3">
               {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 text-[#D9A441] fill-[#D9A441]" />)}
            </div>
            <p className="text-sm text-slate-600 font-medium italic mb-4 leading-relaxed">
              "Amazing project with excellent connectivity. The amenities provided are top-notch and exactly as promised during the booking phase."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-[#1a1a2e]">Amit Sharma</span>
                <span className="text-[11px] font-semibold text-slate-400">Verified Buyer • 2 weeks ago</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SimilarProperties() {
  return (
    <section className="bg-white border-t border-slate-100 py-20 animate-up">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Similar Properties you may like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALL_PROPERTIES.slice(0,4).map((x, i) => (
            <Link key={i} href={`/property/${x.slug}`} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              <div className="relative h-[200px] rounded-xl overflow-hidden mb-4">
                <Image src={x.gallery[0]} alt="Property" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-[#1a1a2e] px-2 py-1 rounded text-[10px] font-bold tracking-wide text-[#c8a84b]">
                  {x.status}
                </div>
              </div>
              <div className="px-2 pb-2">
                <h3 className="font-bold text-[#1a1a2e] text-base mb-1 truncate">{x.name}</h3>
                <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1"><MapPin className="w-3 h-3"/> {x.locality}</p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mb-4 pb-4 border-b border-slate-50">
                   <span>{x.config}</span>
                   <span className="w-1 h-1 rounded-full bg-slate-300"/>
                   <span>{x.area}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#1a1a2e] text-lg">{x.priceLabel}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-[#1a1a2e] py-24 relative overflow-hidden animate-up">
      <div className="absolute inset-0 opacity-10">
        <Image src="/images/heroBg.png" alt="BG" fill className="object-cover" />
      </div>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight max-w-2xl">Find Your Dream Home in Mumbai</h2>
        <p className="text-lg text-slate-400 font-medium mb-10 max-w-xl">Explore verified properties and get personalized assistance from our expert consultants with zero brokerage.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="bg-[#c8a84b] text-[#1a1a2e] font-bold text-[15px] px-8 py-4 rounded-xl hover:bg-[#b5953e] transition-colors shadow-lg shadow-[#c8a84b]/20">
            Explore Properties
          </Link>
          <a href="tel:+917039529129" className="bg-white/10 text-white border border-white/20 font-bold text-[15px] px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
            Talk to an Expert
          </a>
        </div>
      </div>
    </section>
  );
}



function FullscreenGallery({ property, onClose }: { property: any; onClose: () => void }) {
  const gallery: string[] = property?.gallery || [];
  const imageCount = gallery.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i - 1 + imageCount) % imageCount);
  const next = () => setActiveIndex((i) => (i + 1) % imageCount);

  // Lock scroll + keyboard navigation + hide headers
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Hide ALL headers (local + global layout header)
    const headers = Array.from(document.querySelectorAll<HTMLElement>('header'));
    headers.forEach(h => { h.style.visibility = 'hidden'; });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = 'auto';
      headers.forEach(h => { h.style.visibility = ''; });
      window.removeEventListener('keydown', handleKey);
    };
  }, [imageCount]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/97 backdrop-blur-xl flex flex-col">
      {/* Close button — top right, no full header */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white hover:text-black rounded-full flex items-center justify-center text-white transition-colors z-10 shadow-lg"
        aria-label="Close gallery"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-5 text-white/70 text-sm font-semibold z-10">
        {activeIndex + 1} / {imageCount || 1}
      </div>

      {/* Main image */}
      <div className="flex-1 relative flex items-center justify-center px-20 py-8">
        {imageCount > 1 && (
          <button
            onClick={prev}
            className="absolute left-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors z-10 shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div className="relative w-full max-w-5xl h-full rounded-xl overflow-hidden shadow-2xl">
          <Image
            src={gallery[activeIndex] || property?.image || ''}
            alt={`${property?.projectName} – Photo ${activeIndex + 1}`}
            fill
            className="object-contain"
          />
        </div>

        {imageCount > 1 && (
          <button
            onClick={next}
            className="absolute right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors z-10 shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {imageCount > 1 && (
        <div className="h-28 px-6 pb-5 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
          {gallery.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative h-full aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                i === activeIndex ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <Image src={src} alt={`Thumb ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
