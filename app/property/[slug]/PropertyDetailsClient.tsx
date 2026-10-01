"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, Heart, User, ChevronRight, ChevronLeft, MapPin, 
  Share2, ShieldCheck, PlayCircle, Maximize2, Download, 
  CheckCircle2, Star, Building2, Map, LayoutDashboard, Trees, 
  Dumbbell, Gamepad2, Menu, X, Waves
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";


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

    // Initial GSAP animations
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(".animate-up", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".animate-up",
            start: "top 85%",
          }
        });
      }, containerRef);
      return () => {
        ctx.revert();
        lenis.destroy();
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f3f4f6] font-sans text-[#1a1a2e] selection:bg-[#c8a84b] selection:text-white">
      {/* 1. TOP NAVIGATION */}
      <Header />

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
            <EnquiryForm />
            
            {/* 7. WHY CHOOSE PROPERTY CARD */}
            <WhyChooseCard property={property} />
          </div>
        </div>
      </main>

      {/* 17. SIMILAR PROPERTIES */}
      <SimilarProperties />

      {/* 18. FINAL CTA */}
      <FinalCTA />

      {/* 19. FOOTER */}
      <Footer />

      {/* LIGHTBOX GALLERY MODAL */}
      {isGalleryOpen && (
        <FullscreenGallery onClose={() => setIsGalleryOpen(false)} />
      )}
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-slate-100 h-20 flex items-center transition-all duration-300">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D9A441] to-[#b3832c] flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-black tracking-tight leading-none text-[#101A35]">ZEROBRO</span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#D9A441] uppercase mt-0.5">Properties</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {['Buy', 'Projects', 'About Us', 'Services', 'Contact'].map((item) => (
              <Link key={item} href="#" className="text-sm font-semibold text-slate-600 hover:text-[#c8a84b] transition-colors">
                {item}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#c8a84b] transition-colors" />
            <input 
              type="text" 
              placeholder="Search location, project or builder..." 
              className="w-[280px] h-[42px] bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/20 focus:border-[#c8a84b] transition-all placeholder:text-slate-400"
            />
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="h-[42px] px-6 rounded-full border border-slate-200 text-[#1a1a2e] font-semibold text-sm hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition-all flex items-center gap-2">
            <User className="w-4 h-4" />
            Login / Sign Up
          </button>
        </div>

        <button className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-700">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}

function PropertyGallery({ property, onOpenFullscreen }: { property: any, onOpenFullscreen: () => void }) {
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

        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 hover:text-red-500 hover:scale-110 transition-all shadow-lg z-10" onClick={(e) => { e.stopPropagation(); }}>
          <Heart className="w-5 h-5" />
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
          <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#c8a84b] transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
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
    </div>
  );
}

function EnquiryForm() {
  return (
    <div className="bg-[#1a1a2e] rounded-3xl p-7 shadow-xl shadow-[#1a1a2e]/20 text-white relative overflow-hidden animate-up group hover:-translate-y-1 transition-transform duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
      <div className="relative z-10">
        <h3 className="text-[22px] font-bold mb-2 text-[#c8a84b]">Interested in this Property?</h3>
        <p className="text-white/80 text-sm font-medium mb-6">Get exclusive offers, price details and a site visit.</p>
        
        <form className="flex flex-col gap-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <input type="text" placeholder="Your Name" className="w-full h-[50px] bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 text-sm font-medium text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/50 transition-all" />
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white/60">+91</span>
            <input type="tel" placeholder="Phone Number" className="w-full h-[50px] bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 text-sm font-medium text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/50 transition-all" />
          </div>
          <button type="button" className="w-full h-[50px] bg-[#c8a84b] text-[#1a1a2e] font-bold text-[15px] rounded-xl hover:bg-[#b5953e] transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg mt-2">
            Enquire Now <ChevronRight className="w-4 h-4" />
          </button>
        </form>
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
        <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg border border-white/30 group-hover:bg-[#c8a84b] group-hover:text-white transition-all">
          <PlayCircle className="w-6 h-6 ml-0.5" />
        </div>
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
    { id: 'gallery', label: 'Gallery' },
    { id: 'brochure', label: 'Brochure' },
    { id: 'developer', label: 'Developer' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="bg-white rounded-2xl p-2 shadow-[0_4px_20px_rgba(20,35,70,0.04)] border border-slate-100 sticky top-[96px] z-30 animate-up overflow-hidden">
      <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
  return (
    <section className="animate-up scroll-mt-32" id="price">
      <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Floor Plan</h2>
      
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(20,35,70,0.03)]">
        <div className="flex gap-2 mb-6">
          {['2 BHK', '3 BHK', 'All'].map((tab, i) => (
            <button key={tab} className={`px-5 py-2 text-sm font-bold rounded-full transition-colors ${i===0 ? 'bg-[#1a1a2e] text-[#c8a84b]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-8 items-center bg-[#f3f4f6] rounded-2xl p-6">
          <div className="w-full sm:w-[40%] bg-white rounded-xl p-4 shadow-sm border border-slate-100 relative group cursor-pointer">
            <div className="aspect-[4/3] relative">
              <Image src="/images/projects/Untitled-design-21.webp" alt="Floor Plan" fill className="object-contain opacity-50 group-hover:opacity-80 transition-opacity" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-[#1a1a2e] px-4 py-2 rounded-full shadow-lg text-[#c8a84b] font-bold text-xs flex items-center gap-2 group-hover:scale-105 transition-transform">
                 <Maximize2 className="w-3.5 h-3.5" /> Enlarge
               </div>
            </div>
          </div>
          
          <div className="w-full sm:w-[60%] flex flex-col gap-5">
            <h3 className="text-xl font-bold text-[#1a1a2e]">2 BHK - Type A</h3>
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Super Built-up Area</span>
                <span className="text-base font-bold text-[#1a1a2e]">1075 sq.ft</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Carpet Area</span>
                <span className="text-base font-bold text-[#1a1a2e]">820 sq.ft</span>
              </div>
            </div>
            <div className="flex flex-col pt-2">
               <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Price</span>
               <span className="text-2xl font-black text-[#1a1a2e]">₹ 2.3 Cr* <span className="text-sm font-medium text-slate-500 ml-1">Onwards</span></span>
            </div>
            <button className="w-fit mt-2 border border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-[#c8a84b] transition-colors font-bold text-sm px-6 py-2.5 rounded-full flex items-center gap-2">
              View Floor Plan <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
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
          <Image src="/images/projects/Untitled-design-19.webp" alt="Map" fill className="object-cover opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#1a1a2e] px-4 py-2 rounded-full shadow-xl flex items-center gap-2 group-hover:-translate-y-2 transition-transform">
              <div className="w-3 h-3 rounded-full bg-[#FF3B30] animate-pulse" />
              <span className="text-sm font-bold text-[#c8a84b]">{property.projectName}</span>
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
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              <div className="relative h-[200px] rounded-xl overflow-hidden mb-4">
                <Image src={`/images/projects/Untitled-design-1${7+i}.webp`} alt="Property" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-[#1a1a2e] px-2 py-1 rounded text-[10px] font-bold tracking-wide text-[#c8a84b]">
                  NEW LAUNCH
                </div>
              </div>
              <div className="px-2 pb-2">
                <h3 className="font-bold text-[#1a1a2e] text-base mb-1 truncate">Godrej Reserve</h3>
                <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1"><MapPin className="w-3 h-3"/> Kandivali East</p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mb-4 pb-4 border-b border-slate-50">
                   <span>2, 3 BHK</span>
                   <span className="w-1 h-1 rounded-full bg-slate-300"/>
                   <span>890 sq.ft</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#1a1a2e] text-lg">₹ 1.8 Cr*</span>
                  <button className="text-xs font-bold text-[#c8a84b] group-hover:underline">View Details</button>
                </div>
              </div>
            </div>
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
          <button className="bg-[#c8a84b] text-[#1a1a2e] font-bold text-[15px] px-8 py-4 rounded-xl hover:bg-[#b5953e] transition-colors shadow-lg shadow-[#c8a84b]/20">
            Explore Properties
          </button>
          <button className="bg-white/10 text-white border border-white/20 font-bold text-[15px] px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
            Talk to an Expert
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0f0f1c] text-slate-400 py-16 text-sm font-medium border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D9A441] to-[#b3832c] flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-black tracking-tight leading-none text-white">ZEROBRO</span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#D9A441] uppercase mt-0.5">Properties</span>
              </div>
            </Link>
            <p className="max-w-xs mb-6 text-slate-500">Premium real estate portal for finding verified zero brokerage homes directly from top developers.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Properties</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="hover:text-white transition-colors">Mumbai</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pune</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Bangalore</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">RERA Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-xs text-slate-600 font-semibold">
          © 2026 ZeroBro Properties. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FullscreenGallery({ onClose }: { onClose: () => void }) {
  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col">
      <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
        <div className="text-white font-bold tracking-wide">Gallery (1/16)</div>
        <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 relative flex items-center justify-center p-8">
        <button className="absolute left-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors z-10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl">
           <Image src="/images/projects/Untitled-design-20.webp" alt="Main" fill className="object-contain" />
        </div>
        <button className="absolute right-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors z-10">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div className="h-32 px-6 pb-6 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
        {[18,19,20,21].map((img, i) => (
          <div key={i} className={`relative h-full aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${i===2 ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}>
            <Image src={`/images/projects/Untitled-design-${img}.webp`} alt="thumb" fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
