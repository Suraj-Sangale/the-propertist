"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Fragment, useCallback, useState, useTransition } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

// ─── Filter option type ─────────────────────────────────────────────────────
type FilterOption = { key: string; label: string };

// key: "" = "show all" (removes param from URL)
const LOCALITIES: FilterOption[] = [
  { key: "",               label: "All Localities" },
  { key: "kandivali_east", label: "Kandivali East" },
  { key: "jokhandwala",    label: "Jokhandwala" },
  { key: "andheri_west",   label: "Andheri West" },
  { key: "bandra_west",    label: "Bandra West" },
  { key: "powai",          label: "Powai" },
  { key: "malad_west",     label: "Malad West" },
  { key: "borivali_west",  label: "Borivali West" },
  { key: "goregaon_west",  label: "Goregaon West" },
];

const CONFIGURATIONS: FilterOption[] = [
  { key: "",        label: "All BHK" },
  { key: "1_bhk",   label: "1 BHK" },
  { key: "2_bhk",   label: "2 BHK" },
  { key: "2_3_bhk", label: "2 & 3 BHK" },
  { key: "3_bhk",   label: "3 BHK" },
  { key: "3_4_bhk", label: "3 & 4 BHK" },
  { key: "4_bhk",   label: "4 BHK" },
  { key: "4_5_bhk", label: "4 & 5 BHK" },
  { key: "5_bhk",   label: "5 BHK" },
];

const STATUS_OPTIONS: FilterOption[] = [
  { key: "",                  label: "Any Status" },
  { key: "ready_to_move",     label: "Ready to Move" },
  { key: "under_construction",label: "Under Construction" },
  { key: "new_launch",        label: "New Launch" },
  { key: "upcoming",          label: "Upcoming" },
];

const DEVELOPERS: FilterOption[] = [
  { key: "",          label: "All Developers" },
  { key: "kalpataru", label: "Kalpataru" },
  { key: "godrej",    label: "Godrej Properties" },
  { key: "lodha",     label: "Lodha Group" },
  { key: "oberoi",    label: "Oberoi Realty" },
  { key: "rustomjee", label: "Rustomjee" },
];

const ALL_PROPERTIES = [
  {
    id: 1,
    name: "KALPATARU VIAN",
    projectName: "Kalpataru Vian",
    developer: "KALPATARU LIMITED",
    locality: "Jokhandwala",
    locality_key: "jokhandwala",
    locality_label: "JOKHANDWALA",
    config: "3, 4 & 4.5 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3, 4 & 4.5 BHK in KALPATARU VIAN",
    area: "1116 – 2688 sq.ft",
    beds: "3, 4 & 4.5 BHK",
    priceFrom: "₹ 4.95 Cr.+++",
    priceLabel: "From ₹4.95 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "kalpataru",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Expansive Open Views","Premium Lifestyle Amenities","Excellent Connectivity","2, 3, 4 & 5 BHK Lavish Residences"],
  },
  {
    id: 2,
    name: "KALPATARU VIENTA",
    projectName: "Kalpataru Vienta",
    developer: "KALPATARU LIMITED",
    locality: "Kandivali East",
    locality_key: "kandivali_east",
    locality_label: "KANDIVALI EAST",
    config: "2, 3 & 4.5 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2, 3 & 4.5 BHK Duplex in KALPATARU VIENTA",
    area: "1075 – 1689 sq.ft",
    beds: "2, 3 & 4.5 BHK Duplex",
    priceFrom: "₹ 3.82 Cr.++",
    priceLabel: "From ₹3.82 Cr.++",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "kalpataru",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Expansive Open Views","Premium Lifestyle Amenities","Excellent Connectivity","2, 3 & 4.5 BHK Duplex Residences"],
  },
  {
    id: 3,
    name: "GODREJ RESERVE",
    projectName: "Godrej Reserve",
    developer: "GODREJ PROPERTIES",
    locality: "Kandivali East",
    locality_key: "kandivali_east",
    locality_label: "KANDIVALI EAST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in GODREJ RESERVE",
    area: "1470 – 2030 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 5.90 Cr.*",
    priceLabel: "From ₹5.90 Cr.* All Incl.",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "godrej",
    mode: "buy",
    verified: true, rera: true,
    badge: "A NEW BENCHMARK IN WESTERN SUBURBS" as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Expansive Open Views","Premium Lifestyle Amenities","Excellent Connectivity","3 & 4 BHK Luxury Residences"],
  },
  {
    id: 4,
    name: "OBEROI SKY",
    projectName: "Oberoi Sky Heights",
    developer: "OBEROI REALTY",
    locality: "Goregaon West",
    locality_key: "goregaon_west",
    locality_label: "GOREGAON WEST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in OBEROI SKY",
    area: "1350 – 2450 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 6.20 Cr.*",
    priceLabel: "From ₹6.20 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "oberoi",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Panoramic City Views","World-Class Amenities","Metro Connectivity","3 & 4 BHK Premium Homes"],
  },
  {
    id: 5,
    name: "LODHA BELLAVISTA",
    projectName: "Lodha Bellavista",
    developer: "LODHA GROUP",
    locality: "Powai",
    locality_key: "powai",
    locality_label: "POWAI",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in LODHA BELLAVISTA",
    area: "890 – 1680 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.85 Cr.*",
    priceLabel: "From ₹2.85 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "lodha",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Lakeside Living","Premium Club Amenities","Strategic Location","2 & 3 BHK Spacious Homes"],
  },
  {
    id: 6,
    name: "RUSTOMJEE ELANZA",
    projectName: "Rustomjee Elanza",
    developer: "RUSTOMJEE",
    locality: "Malad West",
    locality_key: "malad_west",
    locality_label: "MALAD WEST",
    config: "2 BHK",
    config_keys: ["2_bhk"],
    config_label: "2 BHK in RUSTOMJEE ELANZA",
    area: "780 – 1250 sq.ft",
    beds: "2 BHK",
    priceFrom: "₹ 1.95 Cr.*",
    priceLabel: "From ₹1.95 Cr.*",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "rustomjee",
    mode: "buy",
    verified: true, rera: true,
    badge: "EARLY BIRD OFFER" as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Modern Architecture","Green Spaces","Premium Fittings","2 BHK Smart Homes"],
  },
  {
    id: 7,
    name: "GODREJ PRIME",
    projectName: "Godrej Prime",
    developer: "GODREJ PROPERTIES",
    locality: "Bandra West",
    locality_key: "bandra_west",
    locality_label: "BANDRA WEST",
    config: "3 BHK",
    config_keys: ["3_bhk"],
    config_label: "3 BHK in GODREJ PRIME",
    area: "1200 – 1800 sq.ft",
    beds: "3 BHK",
    priceFrom: "₹ 4.50 Cr.*",
    priceLabel: "From ₹4.50 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "godrej",
    mode: "rent",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Sea-facing Views","Luxury Club House","Vaastu Compliant","3 BHK Spacious Flats"],
  },
  {
    id: 8,
    name: "KALPATARU AURA",
    projectName: "Kalpataru Aura",
    developer: "KALPATARU LIMITED",
    locality: "Andheri West",
    locality_key: "andheri_west",
    locality_label: "ANDHERI WEST",
    config: "1 BHK",
    config_keys: ["1_bhk"],
    config_label: "1 BHK in KALPATARU AURA",
    area: "540 – 750 sq.ft",
    beds: "1 BHK",
    priceFrom: "₹ 1.20 Cr.*",
    priceLabel: "From ₹1.20 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "kalpataru",
    mode: "rent",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Compact & Smart Design","Excellent Connectivity","Premium Interiors","1 BHK Ready Homes"],
  },
  {
    id: 9,
    name: "LODHA ALTAMOUNT",
    projectName: "Lodha Altamount",
    developer: "LODHA GROUP",
    locality: "Bandra West",
    locality_key: "bandra_west",
    locality_label: "BANDRA WEST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in LODHA ALTAMOUNT",
    area: "1560 – 2450 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 5.75 Cr.*",
    priceLabel: "From ₹5.75 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "lodha",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Premium Location","Luxury Amenities","Excellent Connectivity","3 & 4 BHK Luxury Residences"],
  },
  {
    id: 10,
    name: "OBEROI GARDENS",
    projectName: "Oberoi Gardens",
    developer: "OBEROI REALTY",
    locality: "Kandivali East",
    locality_key: "kandivali_east",
    locality_label: "KANDIVALI EAST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in OBEROI GARDENS",
    area: "980 – 1580 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.95 Cr.*",
    priceLabel: "From ₹2.95 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "oberoi",
    mode: "buy",
    verified: true, rera: true,
    badge: "LIMITED INVENTORY" as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Landscaped Gardens","Clubhouse","Modern Interiors","2 & 3 BHK Premium Homes"],
  },
  {
    id: 11,
    name: "KALPATARU GRANDEUR",
    projectName: "Kalpataru Grandeur",
    developer: "KALPATARU LIMITED",
    locality: "Goregaon West",
    locality_key: "goregaon_west",
    locality_label: "GOREGAON WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in KALPATARU GRANDEUR",
    area: "895 – 1540 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.48 Cr.*",
    priceLabel: "From ₹2.48 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "kalpataru",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Spacious Layouts","Fitness Centre","Rooftop Amenities","2 & 3 BHK Residences"],
  },
  {
    id: 12,
    name: "GODREJ URBAN PARK",
    projectName: "Godrej Urban Park",
    developer: "GODREJ PROPERTIES",
    locality: "Malad West",
    locality_key: "malad_west",
    locality_label: "MALAD WEST",
    config: "1 & 2 BHK",
    config_keys: ["1_bhk", "2_bhk", "2_3_bhk"],
    config_label: "1 & 2 BHK in GODREJ URBAN PARK",
    area: "520 – 980 sq.ft",
    beds: "1 & 2 BHK",
    priceFrom: "₹ 1.45 Cr.*",
    priceLabel: "From ₹1.45 Cr.*",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "godrej",
    mode: "buy",
    verified: true, rera: true,
    badge: "NEW LAUNCH" as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Green Open Spaces","Modern Clubhouse","Metro Connectivity","1 & 2 BHK Smart Homes"],
  },
  {
    id: 13,
    name: "RUSTOMJEE PARAMOUNT",
    projectName: "Rustomjee Paramount",
    developer: "RUSTOMJEE",
    locality: "Bandra West",
    locality_key: "bandra_west",
    locality_label: "BANDRA WEST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in RUSTOMJEE PARAMOUNT",
    area: "1450 – 2200 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 5.25 Cr.*",
    priceLabel: "From ₹5.25 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "rustomjee",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Sea Views","Infinity Pool","Premium Clubhouse","3 & 4 BHK Luxury Homes"],
  },
  {
    id: 14,
    name: "LODHA BELMONDO",
    projectName: "Lodha Belmondo",
    developer: "LODHA GROUP",
    locality: "Powai",
    locality_key: "powai",
    locality_label: "POWAI",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in LODHA BELMONDO",
    area: "920 – 1450 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.65 Cr.*",
    priceLabel: "From ₹2.65 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "lodha",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Lakeside Views","Sports Facilities","Luxury Clubhouse","2 & 3 BHK Homes"],
  },
  {
    id: 15,
    name: "OBEROI PARKVIEW",
    projectName: "Oberoi Parkview",
    developer: "OBEROI REALTY",
    locality: "Borivali West",
    locality_key: "borivali_west",
    locality_label: "BORIVALI WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in OBEROI PARKVIEW",
    area: "890 – 1420 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.35 Cr.*",
    priceLabel: "From ₹2.35 Cr.*",
    status: "Upcoming",
    status_key: "upcoming",
    developer_key: "oberoi",
    mode: "buy",
    verified: true, rera: false,
    badge: "COMING SOON" as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Green Views","Modern Amenities","Great Connectivity","2 & 3 BHK Residences"],
  },
  {
    id: 16,
    name: "KALPATARU AVENUE",
    projectName: "Kalpataru Avenue",
    developer: "KALPATARU LIMITED",
    locality: "Andheri West",
    locality_key: "andheri_west",
    locality_label: "ANDHERI WEST",
    config: "1 & 2 BHK",
    config_keys: ["1_bhk", "2_bhk", "2_3_bhk"],
    config_label: "1 & 2 BHK in KALPATARU AVENUE",
    area: "510 – 930 sq.ft",
    beds: "1 & 2 BHK",
    priceFrom: "₹ 1.35 Cr.*",
    priceLabel: "From ₹1.35 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "kalpataru",
    mode: "rent",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Prime Location","Smart Homes","Fitness Centre","1 & 2 BHK Apartments"],
  },
  {
    id: 17,
    name: "GODREJ SKYLINE",
    projectName: "Godrej Skyline",
    developer: "GODREJ PROPERTIES",
    locality: "Powai",
    locality_key: "powai",
    locality_label: "POWAI",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in GODREJ SKYLINE",
    area: "1320 – 2180 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 4.85 Cr.*",
    priceLabel: "From ₹4.85 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "godrej",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Lake Views","Sky Lounge","Premium Amenities","3 & 4 BHK Luxury Homes"],
  },
  {
    id: 18,
    name: "RUSTOMJEE URBANIA",
    projectName: "Rustomjee Urbania",
    developer: "RUSTOMJEE",
    locality: "Goregaon West",
    locality_key: "goregaon_west",
    locality_label: "GOREGAON WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in RUSTOMJEE URBANIA",
    area: "860 – 1380 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.55 Cr.*",
    priceLabel: "From ₹2.55 Cr.*",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "rustomjee",
    mode: "buy",
    verified: true, rera: true,
    badge: "EARLY ACCESS" as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Urban Lifestyle","Clubhouse","Kids Play Area","2 & 3 BHK Homes"],
  },
  {
    id: 19,
    name: "LODHA SERENITY",
    projectName: "Lodha Serenity",
    developer: "LODHA GROUP",
    locality: "Malad West",
    locality_key: "malad_west",
    locality_label: "MALAD WEST",
    config: "1 & 2 BHK",
    config_keys: ["1_bhk", "2_bhk", "2_3_bhk"],
    config_label: "1 & 2 BHK in LODHA SERENITY",
    area: "490 – 890 sq.ft",
    beds: "1 & 2 BHK",
    priceFrom: "₹ 1.18 Cr.*",
    priceLabel: "From ₹1.18 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "lodha",
    mode: "rent",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Peaceful Community","Modern Amenities","Connectivity","1 & 2 BHK Homes"],
  },
  {
    id: 20,
    name: "OBEROI HILLS",
    projectName: "Oberoi Hills",
    developer: "OBEROI REALTY",
    locality: "Goregaon West",
    locality_key: "goregaon_west",
    locality_label: "GOREGAON WEST",
    config: "3, 4 & 5 BHK",
    config_keys: ["3_bhk", "4_bhk", "4_5_bhk", "5_bhk"],
    config_label: "3, 4 & 5 BHK in OBEROI HILLS",
    area: "1480 – 2850 sq.ft",
    beds: "3, 4 & 5 BHK",
    priceFrom: "₹ 6.75 Cr.*",
    priceLabel: "From ₹6.75 Cr.*",
    status: "Upcoming",
    status_key: "upcoming",
    developer_key: "oberoi",
    mode: "buy",
    verified: true, rera: false,
    badge: "PRE-LAUNCH" as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Expansive Views","Luxury Amenities","Large Residences","3, 4 & 5 BHK Homes"],
  },

  {
    id: 21,
    name: "KALPATARU HEIGHTS",
    projectName: "Kalpataru Heights",
    developer: "KALPATARU LIMITED",
    locality: "Kandivali East",
    locality_key: "kandivali_east",
    locality_label: "KANDIVALI EAST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in KALPATARU HEIGHTS",
    area: "850 – 1450 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.28 Cr.*",
    priceLabel: "From ₹2.28 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "kalpataru",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["City Views","Clubhouse","Fitness Centre","2 & 3 BHK Homes"],
  },
  {
    id: 22,
    name: "GODREJ CENTRAL",
    projectName: "Godrej Central",
    developer: "GODREJ PROPERTIES",
    locality: "Kandivali East",
    locality_key: "kandivali_east",
    locality_label: "KANDIVALI EAST",
    config: "2 BHK",
    config_keys: ["2_bhk"],
    config_label: "2 BHK in GODREJ CENTRAL",
    area: "760 – 980 sq.ft",
    beds: "2 BHK",
    priceFrom: "₹ 1.88 Cr.*",
    priceLabel: "From ₹1.88 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "godrej",
    mode: "rent",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Community Living","Swimming Pool","Gymnasium","2 BHK Smart Homes"],
  },
  {
    id: 23,
    name: "RUSTOMJEE REGALIA",
    projectName: "Rustomjee Regalia",
    developer: "RUSTOMJEE",
    locality: "Borivali West",
    locality_key: "borivali_west",
    locality_label: "BORIVALI WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in RUSTOMJEE REGALIA",
    area: "910 – 1510 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.42 Cr.*",
    priceLabel: "From ₹2.42 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "rustomjee",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Premium Finishes","Landscaped Gardens","Clubhouse","2 & 3 BHK Residences"],
  },
  {
    id: 24,
    name: "LODHA VISTA",
    projectName: "Lodha Vista",
    developer: "LODHA GROUP",
    locality: "Andheri West",
    locality_key: "andheri_west",
    locality_label: "ANDHERI WEST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in LODHA VISTA",
    area: "1380 – 2140 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 4.35 Cr.*",
    priceLabel: "From ₹4.35 Cr.*",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "lodha",
    mode: "buy",
    verified: true, rera: true,
    badge: "NEW LAUNCH" as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Elevated Views","Luxury Club","Prime Connectivity","3 & 4 BHK Homes"],
  },
  {
    id: 25,
    name: "OBEROI GRANDE",
    projectName: "Oberoi Grande",
    developer: "OBEROI REALTY",
    locality: "Andheri West",
    locality_key: "andheri_west",
    locality_label: "ANDHERI WEST",
    config: "4 & 5 BHK",
    config_keys: ["4_bhk", "5_bhk", "4_5_bhk"],
    config_label: "4 & 5 BHK in OBEROI GRANDE",
    area: "1980 – 3250 sq.ft",
    beds: "4 & 5 BHK",
    priceFrom: "₹ 7.90 Cr.*",
    priceLabel: "From ₹7.90 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "oberoi",
    mode: "buy",
    verified: true, rera: true,
    badge: "ULTRA LUXURY" as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Grand Residences","Private Elevators","Premium Club","4 & 5 BHK Residences"],
  },

  {
    id: 26,
    name: "KALPATARU PARK",
    projectName: "Kalpataru Park",
    developer: "KALPATARU LIMITED",
    locality: "Malad West",
    locality_key: "malad_west",
    locality_label: "MALAD WEST",
    config: "1 & 2 BHK",
    config_keys: ["1_bhk", "2_bhk", "2_3_bhk"],
    config_label: "1 & 2 BHK in KALPATARU PARK",
    area: "510 – 910 sq.ft",
    beds: "1 & 2 BHK",
    priceFrom: "₹ 1.32 Cr.*",
    priceLabel: "From ₹1.32 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "kalpataru",
    mode: "rent",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Green Spaces","Modern Interiors","Fitness Centre","1 & 2 BHK Homes"],
  },
  {
    id: 27,
    name: "GODREJ GRANDEUR",
    projectName: "Godrej Grandeur",
    developer: "GODREJ PROPERTIES",
    locality: "Bandra West",
    locality_key: "bandra_west",
    locality_label: "BANDRA WEST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in GODREJ GRANDEUR",
    area: "1420 – 2250 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 5.45 Cr.*",
    priceLabel: "From ₹5.45 Cr.*",
    status: "Upcoming",
    status_key: "upcoming",
    developer_key: "godrej",
    mode: "buy",
    verified: true, rera: false,
    badge: "COMING SOON" as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Premium Address","Sea Views","Luxury Amenities","3 & 4 BHK Homes"],
  },
  {
    id: 28,
    name: "RUSTOMJEE CROWN",
    projectName: "Rustomjee Crown",
    developer: "RUSTOMJEE",
    locality: "Bandra West",
    locality_key: "bandra_west",
    locality_label: "BANDRA WEST",
    config: "3, 4 & 5 BHK",
    config_keys: ["3_bhk", "4_bhk", "4_5_bhk", "5_bhk"],
    config_label: "3, 4 & 5 BHK in RUSTOMJEE CROWN",
    area: "1550 – 2900 sq.ft",
    beds: "3, 4 & 5 BHK",
    priceFrom: "₹ 6.10 Cr.*",
    priceLabel: "From ₹6.10 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "rustomjee",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Sea-facing Homes","Infinity Pool","Luxury Clubhouse","3, 4 & 5 BHK Homes"],
  },
  {
    id: 29,
    name: "LODHA IMPERIAL",
    projectName: "Lodha Imperial",
    developer: "LODHA GROUP",
    locality: "Goregaon West",
    locality_key: "goregaon_west",
    locality_label: "GOREGAON WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in LODHA IMPERIAL",
    area: "880 – 1490 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.62 Cr.*",
    priceLabel: "From ₹2.62 Cr.*",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "lodha",
    mode: "buy",
    verified: true, rera: true,
    badge: "EARLY BIRD OFFER" as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Modern Architecture","Rooftop Amenities","Fitness Centre","2 & 3 BHK Homes"],
  },
  {
    id: 30,
    name: "OBEROI SIGNATURE",
    projectName: "Oberoi Signature",
    developer: "OBEROI REALTY",
    locality: "Powai",
    locality_key: "powai",
    locality_label: "POWAI",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in OBEROI SIGNATURE",
    area: "1280 – 2100 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 4.90 Cr.*",
    priceLabel: "From ₹4.90 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "oberoi",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Lake View","Luxury Amenities","Clubhouse","3 & 4 BHK Residences"],
  },

  {
    id: 31,
    name: "KALPATARU ELITE",
    projectName: "Kalpataru Elite",
    developer: "KALPATARU LIMITED",
    locality: "Powai",
    locality_key: "powai",
    locality_label: "POWAI",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in KALPATARU ELITE",
    area: "900 – 1480 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.72 Cr.*",
    priceLabel: "From ₹2.72 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "kalpataru",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Lake Views","Premium Interiors","Clubhouse","2 & 3 BHK Homes"],
  },
  {
    id: 32,
    name: "GODREJ AVENUES",
    projectName: "Godrej Avenues",
    developer: "GODREJ PROPERTIES",
    locality: "Andheri West",
    locality_key: "andheri_west",
    locality_label: "ANDHERI WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in GODREJ AVENUES",
    area: "820 – 1390 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.35 Cr.*",
    priceLabel: "From ₹2.35 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "godrej",
    mode: "rent",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Metro Connectivity","Smart Amenities","Open Views","2 & 3 BHK Homes"],
  },
  {
    id: 33,
    name: "RUSTOMJEE RESERVE",
    projectName: "Rustomjee Reserve",
    developer: "RUSTOMJEE",
    locality: "Kandivali East",
    locality_key: "kandivali_east",
    locality_label: "KANDIVALI EAST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in RUSTOMJEE RESERVE",
    area: "1320 – 2020 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 3.95 Cr.*",
    priceLabel: "From ₹3.95 Cr.*",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "rustomjee",
    mode: "buy",
    verified: true, rera: true,
    badge: "NEW LAUNCH" as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Private Decks","Luxury Amenities","Green Spaces","3 & 4 BHK Residences"],
  },
  {
    id: 34,
    name: "LODHA PRIME",
    projectName: "Lodha Prime",
    developer: "LODHA GROUP",
    locality: "Borivali West",
    locality_key: "borivali_west",
    locality_label: "BORIVALI WEST",
    config: "1 & 2 BHK",
    config_keys: ["1_bhk", "2_bhk", "2_3_bhk"],
    config_label: "1 & 2 BHK in LODHA PRIME",
    area: "510 – 920 sq.ft",
    beds: "1 & 2 BHK",
    priceFrom: "₹ 1.28 Cr.*",
    priceLabel: "From ₹1.28 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "lodha",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Smart Layouts","Clubhouse","Fitness Centre","1 & 2 BHK Homes"],
  },
  {
    id: 35,
    name: "OBEROI METROPOLIS",
    projectName: "Oberoi Metropolis",
    developer: "OBEROI REALTY",
    locality: "Malad West",
    locality_key: "malad_west",
    locality_label: "MALAD WEST",
    config: "2, 3 & 4 BHK",
    config_keys: ["2_bhk", "3_bhk", "3_4_bhk", "4_bhk"],
    config_label: "2, 3 & 4 BHK in OBEROI METROPOLIS",
    area: "980 – 2280 sq.ft",
    beds: "2, 3 & 4 BHK",
    priceFrom: "₹ 3.15 Cr.*",
    priceLabel: "From ₹3.15 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "oberoi",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Large Clubhouse","City Views","Premium Interiors","2, 3 & 4 BHK Homes"],
  },

  {
    id: 36,
    name: "KALPATARU ORCHARD",
    projectName: "Kalpataru Orchard",
    developer: "KALPATARU LIMITED",
    locality: "Goregaon West",
    locality_key: "goregaon_west",
    locality_label: "GOREGAON WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in KALPATARU ORCHARD",
    area: "840 – 1420 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.18 Cr.*",
    priceLabel: "From ₹2.18 Cr.*",
    status: "Upcoming",
    status_key: "upcoming",
    developer_key: "kalpataru",
    mode: "buy",
    verified: true, rera: false,
    badge: "PRE-LAUNCH" as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Garden Living","Premium Clubhouse","Open Spaces","2 & 3 BHK Residences"],
  },
  {
    id: 37,
    name: "GODREJ HORIZON",
    projectName: "Godrej Horizon",
    developer: "GODREJ PROPERTIES",
    locality: "Borivali West",
    locality_key: "borivali_west",
    locality_label: "BORIVALI WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in GODREJ HORIZON",
    area: "850 – 1500 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.52 Cr.*",
    priceLabel: "From ₹2.52 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "godrej",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Panoramic Views","Sports Facilities","Clubhouse","2 & 3 BHK Homes"],
  },
  {
    id: 38,
    name: "RUSTOMJEE PALMS",
    projectName: "Rustomjee Palms",
    developer: "RUSTOMJEE",
    locality: "Malad West",
    locality_key: "malad_west",
    locality_label: "MALAD WEST",
    config: "1 & 2 BHK",
    config_keys: ["1_bhk", "2_bhk", "2_3_bhk"],
    config_label: "1 & 2 BHK in RUSTOMJEE PALMS",
    area: "520 – 940 sq.ft",
    beds: "1 & 2 BHK",
    priceFrom: "₹ 1.38 Cr.*",
    priceLabel: "From ₹1.38 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "rustomjee",
    mode: "rent",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Green Community","Modern Amenities","Prime Location","1 & 2 BHK Homes"],
  },
  {
    id: 39,
    name: "LODHA GRANDE",
    projectName: "Lodha Grande",
    developer: "LODHA GROUP",
    locality: "Kandivali East",
    locality_key: "kandivali_east",
    locality_label: "KANDIVALI EAST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in LODHA GRANDE",
    area: "1350 – 2150 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 4.20 Cr.*",
    priceLabel: "From ₹4.20 Cr.*",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "lodha",
    mode: "buy",
    verified: true, rera: true,
    badge: "LIMITED UNITS" as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Grand Entrance","Luxury Amenities","Sky Lounge","3 & 4 BHK Homes"],
  },
  {
    id: 40,
    name: "OBEROI URBAN",
    projectName: "Oberoi Urban",
    developer: "OBEROI REALTY",
    locality: "Bandra West",
    locality_key: "bandra_west",
    locality_label: "BANDRA WEST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in OBEROI URBAN",
    area: "1440 – 2300 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 5.65 Cr.*",
    priceLabel: "From ₹5.65 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "oberoi",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Premium Address","Luxury Club","Sea Views","3 & 4 BHK Residences"],
  },

  {
    id: 41,
    name: "KALPATARU RESERVE",
    projectName: "Kalpataru Reserve",
    developer: "KALPATARU LIMITED",
    locality: "Bandra West",
    locality_key: "bandra_west",
    locality_label: "BANDRA WEST",
    config: "4 & 5 BHK",
    config_keys: ["4_bhk", "5_bhk", "4_5_bhk"],
    config_label: "4 & 5 BHK in KALPATARU RESERVE",
    area: "1880 – 3100 sq.ft",
    beds: "4 & 5 BHK",
    priceFrom: "₹ 7.25 Cr.*",
    priceLabel: "From ₹7.25 Cr.*",
    status: "Upcoming",
    status_key: "upcoming",
    developer_key: "kalpataru",
    mode: "buy",
    verified: true, rera: false,
    badge: "PRE-LAUNCH" as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Ultra Luxury","Private Lobby","Premium Amenities","4 & 5 BHK Residences"],
  },
  {
    id: 42,
    name: "GODREJ ELITE",
    projectName: "Godrej Elite",
    developer: "GODREJ PROPERTIES",
    locality: "Goregaon West",
    locality_key: "goregaon_west",
    locality_label: "GOREGAON WEST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in GODREJ ELITE",
    area: "1260 – 2050 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 4.15 Cr.*",
    priceLabel: "From ₹4.15 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "godrej",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Premium Lifestyle","Gymnasium","Swimming Pool","3 & 4 BHK Homes"],
  },
  {
    id: 43,
    name: "RUSTOMJEE ROYALE",
    projectName: "Rustomjee Royale",
    developer: "RUSTOMJEE",
    locality: "Andheri West",
    locality_key: "andheri_west",
    locality_label: "ANDHERI WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in RUSTOMJEE ROYALE",
    area: "870 – 1460 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.68 Cr.*",
    priceLabel: "From ₹2.68 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "rustomjee",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Modern Design","Clubhouse","Metro Access","2 & 3 BHK Homes"],
  },
  {
    id: 44,
    name: "LODHA PARKSIDE",
    projectName: "Lodha Parkside",
    developer: "LODHA GROUP",
    locality: "Powai",
    locality_key: "powai",
    locality_label: "POWAI",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in LODHA PARKSIDE",
    area: "900 – 1510 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.78 Cr.*",
    priceLabel: "From ₹2.78 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "lodha",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Lakeside Living","Green Spaces","Sports Club","2 & 3 BHK Homes"],
  },
  {
    id: 45,
    name: "OBEROI ROYALE",
    projectName: "Oberoi Royale",
    developer: "OBEROI REALTY",
    locality: "Kandivali East",
    locality_key: "kandivali_east",
    locality_label: "KANDIVALI EAST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in OBEROI ROYALE",
    area: "1380 – 2250 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 4.65 Cr.*",
    priceLabel: "From ₹4.65 Cr.*",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "oberoi",
    mode: "buy",
    verified: true, rera: true,
    badge: "NEW LAUNCH" as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Luxury Residences","Private Amenities","Open Views","3 & 4 BHK Homes"],
  },

  {
    id: 46,
    name: "KALPATARU CENTRAL",
    projectName: "Kalpataru Central",
    developer: "KALPATARU LIMITED",
    locality: "Borivali West",
    locality_key: "borivali_west",
    locality_label: "BORIVALI WEST",
    config: "1 & 2 BHK",
    config_keys: ["1_bhk", "2_bhk", "2_3_bhk"],
    config_label: "1 & 2 BHK in KALPATARU CENTRAL",
    area: "490 – 900 sq.ft",
    beds: "1 & 2 BHK",
    priceFrom: "₹ 1.22 Cr.*",
    priceLabel: "From ₹1.22 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "kalpataru",
    mode: "rent",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Central Location","Smart Homes","Modern Amenities","1 & 2 BHK Homes"],
  },
  {
    id: 47,
    name: "GODREJ GRANDE",
    projectName: "Godrej Grande",
    developer: "GODREJ PROPERTIES",
    locality: "Powai",
    locality_key: "powai",
    locality_label: "POWAI",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in GODREJ GRANDE",
    area: "1350 – 2190 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 4.72 Cr.*",
    priceLabel: "From ₹4.72 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "godrej",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Lake Views","Premium Club","Landscaped Gardens","3 & 4 BHK Residences"],
  },
  {
    id: 48,
    name: "RUSTOMJEE PARK",
    projectName: "Rustomjee Park",
    developer: "RUSTOMJEE",
    locality: "Goregaon West",
    locality_key: "goregaon_west",
    locality_label: "GOREGAON WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in RUSTOMJEE PARK",
    area: "820 – 1390 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.38 Cr.*",
    priceLabel: "From ₹2.38 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "rustomjee",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Garden Views","Community Hall","Fitness Centre","2 & 3 BHK Homes"],
  },
  {
    id: 49,
    name: "LODHA SIGNATURE",
    projectName: "Lodha Signature",
    developer: "LODHA GROUP",
    locality: "Malad West",
    locality_key: "malad_west",
    locality_label: "MALAD WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in LODHA SIGNATURE",
    area: "850 – 1480 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.48 Cr.*",
    priceLabel: "From ₹2.48 Cr.*",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "lodha",
    mode: "buy",
    verified: true, rera: true,
    badge: "EARLY ACCESS" as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Premium Interiors","Rooftop Lounge","Clubhouse","2 & 3 BHK Homes"],
  },
  {
    id: 50,
    name: "OBEROI RESERVE",
    projectName: "Oberoi Reserve",
    developer: "OBEROI REALTY",
    locality: "Malad West",
    locality_key: "malad_west",
    locality_label: "MALAD WEST",
    config: "4 & 5 BHK",
    config_keys: ["4_bhk", "5_bhk", "4_5_bhk"],
    config_label: "4 & 5 BHK in OBEROI RESERVE",
    area: "1950 – 3200 sq.ft",
    beds: "4 & 5 BHK",
    priceFrom: "₹ 7.15 Cr.*",
    priceLabel: "From ₹7.15 Cr.*",
    status: "Upcoming",
    status_key: "upcoming",
    developer_key: "oberoi",
    mode: "buy",
    verified: true, rera: false,
    badge: "PRE-LAUNCH" as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Private Residences","Luxury Club","Large Balconies","4 & 5 BHK Homes"],
  },

  {
    id: 51,
    name: "KALPATARU ONE",
    projectName: "Kalpataru One",
    developer: "KALPATARU LIMITED",
    locality: "Andheri West",
    locality_key: "andheri_west",
    locality_label: "ANDHERI WEST",
    config: "2 BHK",
    config_keys: ["2_bhk"],
    config_label: "2 BHK in KALPATARU ONE",
    area: "720 – 980 sq.ft",
    beds: "2 BHK",
    priceFrom: "₹ 1.92 Cr.*",
    priceLabel: "From ₹1.92 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "kalpataru",
    mode: "rent",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Prime Location","Modern Interiors","Gymnasium","2 BHK Apartments"],
  },
  {
    id: 52,
    name: "GODREJ LUXE",
    projectName: "Godrej Luxe",
    developer: "GODREJ PROPERTIES",
    locality: "Bandra West",
    locality_key: "bandra_west",
    locality_label: "BANDRA WEST",
    config: "4 & 5 BHK",
    config_keys: ["4_bhk", "5_bhk", "4_5_bhk"],
    config_label: "4 & 5 BHK in GODREJ LUXE",
    area: "1900 – 3050 sq.ft",
    beds: "4 & 5 BHK",
    priceFrom: "₹ 7.45 Cr.*",
    priceLabel: "From ₹7.45 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "godrej",
    mode: "buy",
    verified: true, rera: true,
    badge: "ULTRA LUXURY" as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Sea Views","Private Lobby","Luxury Amenities","4 & 5 BHK Residences"],
  },
  {
    id: 53,
    name: "RUSTOMJEE VISTA",
    projectName: "Rustomjee Vista",
    developer: "RUSTOMJEE",
    locality: "Powai",
    locality_key: "powai",
    locality_label: "POWAI",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in RUSTOMJEE VISTA",
    area: "1300 – 2050 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 4.05 Cr.*",
    priceLabel: "From ₹4.05 Cr.*",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "rustomjee",
    mode: "buy",
    verified: true, rera: true,
    badge: "NEW LAUNCH" as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Lake Views","Premium Club","Green Spaces","3 & 4 BHK Homes"],
  },
  {
    id: 54,
    name: "LODHA GARDEN",
    projectName: "Lodha Garden",
    developer: "LODHA GROUP",
    locality: "Borivali West",
    locality_key: "borivali_west",
    locality_label: "BORIVALI WEST",
    config: "2 & 3 BHK",
    config_keys: ["2_bhk", "3_bhk", "2_3_bhk"],
    config_label: "2 & 3 BHK in LODHA GARDEN",
    area: "830 – 1410 sq.ft",
    beds: "2 & 3 BHK",
    priceFrom: "₹ 2.25 Cr.*",
    priceLabel: "From ₹2.25 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "lodha",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Garden Views","Clubhouse","Sports Facilities","2 & 3 BHK Homes"],
  },
  {
    id: 55,
    name: "OBEROI ICON",
    projectName: "Oberoi Icon",
    developer: "OBEROI REALTY",
    locality: "Andheri West",
    locality_key: "andheri_west",
    locality_label: "ANDHERI WEST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in OBEROI ICON",
    area: "1370 – 2190 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 4.95 Cr.*",
    priceLabel: "From ₹4.95 Cr.*",
    status: "Ready to Move",
    status_key: "ready_to_move",
    developer_key: "oberoi",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-20.webp",
    features: ["Premium Location","Luxury Amenities","Metro Connectivity","3 & 4 BHK Homes"],
  },

  {
    id: 56,
    name: "KALPATARU GRAND",
    projectName: "Kalpataru Grand",
    developer: "KALPATARU LIMITED",
    locality: "Goregaon West",
    locality_key: "goregaon_west",
    locality_label: "GOREGAON WEST",
    config: "3 & 4 BHK",
    config_keys: ["3_bhk", "4_bhk", "3_4_bhk"],
    config_label: "3 & 4 BHK in KALPATARU GRAND",
    area: "1280 – 2080 sq.ft",
    beds: "3 & 4 BHK",
    priceFrom: "₹ 3.88 Cr.*",
    priceLabel: "From ₹3.88 Cr.*",
    status: "Under Construction",
    status_key: "under_construction",
    developer_key: "kalpataru",
    mode: "buy",
    verified: true, rera: true,
    badge: null as string | null,
    image: "/images/projects/Untitled-design-21.webp",
    features: ["Premium Residences","Sky Lounge","Fitness Centre","3 & 4 BHK Homes"],
  },
  {
    id: 57,
    name: "GODREJ BLOOM",
    projectName: "Godrej Bloom",
    developer: "GODREJ PROPERTIES",
    locality: "Malad West",
    locality_key: "malad_west",
    locality_label: "MALAD WEST",
    config: "1 & 2 BHK",
    config_keys: ["1_bhk", "2_bhk", "2_3_bhk"],
    config_label: "1 & 2 BHK in GODREJ BLOOM",
    area: "510 – 920 sq.ft",
    beds: "1 & 2 BHK",
    priceFrom: "₹ 1.35 Cr.*",
    priceLabel: "From ₹1.35 Cr.*",
    status: "New Launch",
    status_key: "new_launch",
    developer_key: "godrej",
    mode: "rent",
    verified: true, rera: true,
    badge: "EARLY BIRD OFFER" as string | null,
    image: "/images/projects/Untitled-design-18.webp",
    features: ["Green Living","Smart Amenities","Modern Homes","1 & 2 BHK Residences"],
  },
  {
    id: 58,
    name: "RUSTOMJEE GRAND",
    projectName: "Rustomjee Grand",
    developer: "RUSTOMJEE",
    locality: "Kandivali East",
    locality_key: "kandivali_east",
    locality_label: "KANDIVALI EAST",
    config: "3, 4 & 5 BHK",
    config_keys: ["3_bhk", "4_bhk", "4_5_bhk", "5_bhk"],
    config_label: "3, 4 & 5 BHK in RUSTOMJEE GRAND",
    area: "1450 – 2750 sq.ft",
    beds: "3, 4 & 5 BHK",
    priceFrom: "₹ 5.25 Cr.*",
    priceLabel: "From ₹5.25 Cr.*",
    status: "Upcoming",
    status_key: "upcoming",
    developer_key: "rustomjee",
    mode: "buy",
    verified: true, rera: false,
    badge: "PRE-LAUNCH" as string | null,
    image: "/images/projects/Untitled-design-19.webp",
    features: ["Grand Residences","Premium Clubhouse","Private Decks","3, 4 & 5 BHK Homes"],
  },
];

const OFFERS = [
  {
    title: "Unlock Premium Developer Offers",
    description:
      "Get exclusive early-bird discounts and zero brokerage on selected luxury properties across Mumbai.",
    button: "Claim Offers",
  },
  {
    title: "Get Priority Access to New Launches",
    description:
      "Be among the first to explore premium residences, special launch pricing and limited inventory.",
    button: "Explore New Launches",
  },
  {
    title: "Exclusive Homebuyer Benefits",
    description:
      "Discover special payment plans, limited-period offers and premium upgrades from leading developers.",
    button: "View Benefits",
  },
  {
    title: "Find Your Dream Home",
    description:
      "Tell us what you're looking for and get personalised property recommendations from our experts.",
    button: "Get Recommendations",
  },
];
// ─── Helpers ─────────────────────────────────────────────────────────────────

// Match a property against the active config key (key="" means no filter)
function matchConfig(propConfigKeys: string[], filterKey: string): boolean {
  if (!filterKey) return true;
  return propConfigKeys.includes(filterKey);
}

// Get display label for an active filter key
function getLabel(options: FilterOption[], key: string): string {
  return options.find((o) => o.key === key)?.label ?? key;
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg className="lp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "#e74c3c" : "none"} stroke={filled ? "#e74c3c" : "#666"} strokeWidth={1.8} style={{ width: 18, height: 18 }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#22c55e" style={{ width: 14, height: 14 }}>
      <path d="M12 2l2.4 4.8 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.4.9-5.4L4.2 7.6l5.4-.8z" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={1.7} style={{ width: 13, height: 13 }}>
      <rect x="3" y="3" width="18" height="18" rx="1" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={1.7} style={{ width: 13, height: 13 }}>
      <path d="M3 20V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12" />
      <path d="M3 14h18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={1.8} style={{ width: 13, height: 13, flexShrink: 0 }}>
      <path d="M12 21s-8-5.5-8-11a8 8 0 1 1 16 0c0 5.5-8 11-8 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function RERAIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth={1.7} style={{ width: 14, height: 14 }}>
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "#c8a84b" : "none"} stroke={active ? "#c8a84b" : "#999"} strokeWidth={1.6} style={{ width: 18, height: 18 }}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={active ? "#c8a84b" : "#999"} strokeWidth={1.6} style={{ width: 18, height: 18 }}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

// Desktop dropdown — emits the selected option's key
function SelectFilter({ id, label, options, value, onChange }: {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;           // current active key from URL
  onChange: (key: string) => void;
}) {
  return (
    <div className="lp-filter-group">
      <label htmlFor={id} className="lp-filter-label">{label}</label>
      <div className="lp-select-wrap">
        <select
          id={id}
          className="lp-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
        <ChevronIcon />
      </div>
    </div>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────────

type Property = typeof ALL_PROPERTIES[0];

function PropertyCard({ property, view }: { property: Property; view: "grid" | "list" }) {
  const [hearted, setHearted] = useState(false);

  const cardBody = (
    <div className="lp-card-body">
      <div className="lp-card-title">{property.config_label}</div>
      <div className="lp-card-price-main">{property.priceFrom} Onwards</div>
      <div className="lp-card-loc"><PinIcon />{property.projectName}</div>
      <div className="lp-card-meta">
        <span><AreaIcon />{property.area}</span>
        <span><BedIcon />{property.beds}</span>
      </div>
      <div className="lp-card-footer">
        <div className="lp-badges-row">
          {property.verified && <span className="lp-badge lp-badge--green"><VerifiedIcon /> Verified Project</span>}
          {property.rera && <span className="lp-badge lp-badge--outline"><RERAIcon /> RERA Approved</span>}
        </div>
        <button className="lp-view-btn">View Details <span>→</span></button>
      </div>
    </div>
  );

  return (
    <article className={`lp-card${view === "list" ? " lp-card--list" : ""}`}>
      <div className={`lp-card-img-wrap${view === "list" ? " lp-card-img-wrap--list" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={property.image} alt={property.name} className="lp-card-img" />
        <button className="lp-heart" onClick={() => setHearted((h) => !h)} aria-label="Save property">
          <HeartIcon filled={hearted} />
        </button>

        {/* Overlay: features left, name+price right */}
        <div className="lp-card-overlay">
          <div className="lp-card-features">
            {property.features.map((f) => (
              <div key={f} className="lp-feat-item">
                <span className="lp-feat-dot" />
                {f}
              </div>
            ))}
          </div>
          <div className="lp-card-name-area">
            <div className="lp-card-name">{property.name}</div>
            <div className="lp-card-locality">{property.locality_label}</div>
            <div className="lp-card-price-badge">{property.priceLabel}</div>
          </div>
        </div>

        {property.badge && <div className="lp-card-badge-ribbon">{property.badge}</div>}
        {/* <div className="lp-dev-tag">{property.developer}</div> */}
      </div>
      {cardBody}
    </article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type DrawerPanel = "view" | "sort" | "filter" | null;

export default function ListingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const mode      = searchParams.get("mode")     ?? "buy";
  const locality  = searchParams.get("locality") ?? "";
  const config    = searchParams.get("config")   ?? "";
  const status    = searchParams.get("status")   ?? "";
  const developer = searchParams.get("developer")  ?? "";
  const sort      = searchParams.get("sort")     ?? "Relevance";
  const view      = (searchParams.get("view")    ?? "grid") as "grid" | "list";

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [drawer, setDrawer] = useState<DrawerPanel>(null);
  const [isClosing, setIsClosing] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      // key="" removes the param (= "show all"); any other value sets it
      Object.entries(updates).forEach(([k, v]) => { if (v) params.set(k, v); else params.delete(k); });
      startTransition(() => { router.replace(`${pathname}?${params.toString()}`, { scroll: false }); });
    },
    [searchParams, pathname, router]
  );

  // Trigger close animation then unmount
  const closeDrawer = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => { setDrawer(null); setIsClosing(false); }, 320);
  }, []);

  const openDrawer = useCallback((panel: DrawerPanel) => {
    if (drawer === panel) { closeDrawer(); }
    else { setIsClosing(false); setDrawer(panel); }
  }, [drawer, closeDrawer]);

  // Mobile filter Apply just closes the drawer (each chip already updated URL)
  const applyFilters = () => { closeDrawer(); };

  // Count active (non-empty) filter params for the badge
  const activeFilterCount = [locality, config, developer, status].filter(Boolean).length;

  const filtered = ALL_PROPERTIES.filter((p) => {
    if (p.mode !== mode) return false;
    if (locality  && p.locality_key  !== locality)             return false;
    if (config    && !matchConfig(p.config_keys, config))      return false;
    if (status    && p.status_key    !== status)               return false;
    if (developer && p.developer_key !== developer)            return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())
               && !p.locality.toLowerCase().includes(search.toLowerCase())
               && !p.developer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap');

        .lp-root { font-family: 'Inter', sans-serif; background: #f3f4f6; min-height: 100vh; color: #1a1a2e; }
        .lp-root * { box-sizing: border-box; }

        /* HERO */
        .lp-hero { background: #0a0e1e; position: relative; overflow: hidden; padding: 56px 0 0; }
        .lp-hero-bg { position: absolute; inset: 0; background-image: url('/images/heroBg.png'); background-size: cover; background-position: center top; opacity: 0.18; }
        .lp-hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(8,12,28,0.97) 0%, rgba(10,18,38,0.82) 55%, rgba(0,0,0,0.55) 100%); }
        .lp-hero-inner { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; padding: 0 32px 44px; text-align: center; }
        .lp-hero-eyebrow { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 22px; }
        .lp-hero-eyebrow-line { width: 52px; height: 1px; background: linear-gradient(90deg, transparent, #c8a84b); }
        .lp-hero-eyebrow-line:last-child { background: linear-gradient(90deg, #c8a84b, transparent); }
        .lp-hero-eyebrow-text { font-size: 10.5px; font-weight: 700; letter-spacing: 3.5px; color: #c8a84b; text-transform: uppercase; }
        .lp-hero-h1 { font-size: clamp(30px, 4.2vw, 54px); font-weight: 800; color: #fff; line-height: 1.08; margin: 0 0 18px; letter-spacing: -1px; }
        .lp-hero-h1 em { font-family: 'Playfair Display', serif; font-style: italic; color: #c8a84b; }
        .lp-hero-sub { color: rgba(255,255,255,0.65); font-size: 15px; line-height: 1.7; max-width: 500px; margin: 0 auto 36px; }
        .lp-trust-row { display: flex; justify-content: center; gap: 0; flex-wrap: wrap; }
        .lp-trust-item { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.8); font-size: 13px; padding: 0 36px; }
        .lp-trust-icon { width: 40px; height: 40px; border-radius: 50%; background: rgba(200,168,75,0.15); border: 1px solid rgba(200,168,75,0.35); display: grid; place-items: center; flex-shrink: 0; }
        .lp-trust-icon svg { width: 20px; height: 20px; color: #c8a84b; }
        .lp-trust-text b { display: block; font-size: 13.5px; font-weight: 600; color: #fff; }
        .lp-trust-text span { font-size: 11.5px; color: rgba(255,255,255,0.5); }
        .lp-trust-divider { width: 1px; height: 44px; background: rgba(255,255,255,0.1); }

        /* FILTER BAR */
        .lp-filter-bar-wrap { max-width: 1280px; margin: -26px auto 0; padding: 0 32px; position: relative; z-index: 10; }
        .lp-filter-bar { background: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.13), 0 1px 6px rgba(0,0,0,0.05); padding: 18px 22px; display: flex; align-items: flex-end; gap: 14px; flex-wrap: wrap; }
        .lp-search-field { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 10px; background: #f8f9fb; border: 1.5px solid #eaecf0; border-radius: 10px; height: 48px; padding: 0 14px; font-size: 13px; color: #555; transition: border-color .15s; }
        .lp-search-field:focus-within { border-color: #c8a84b; }
        .lp-search-field input { flex: 1; border: 0; background: transparent; outline: none; font: inherit; color: #222; }
        .lp-search-field svg { width: 16px; height: 16px; color: #aaa; flex-shrink: 0; }
        .lp-filter-group { display: flex; flex-direction: column; gap: 4px; }
        .lp-filter-label { font-size: 9.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #aaa; padding-left: 2px; }
        .lp-select-wrap { position: relative; }
        .lp-select { appearance: none; -webkit-appearance: none; background: #f8f9fb; border: 1.5px solid #eaecf0; border-radius: 10px; height: 48px; padding: 0 36px 0 14px; font: 500 13px 'Inter'; color: #222; cursor: pointer; width: 100%; outline: none; transition: border-color .15s; }
        .lp-select:focus { border-color: #c8a84b; }
        .lp-chevron { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: #aaa; pointer-events: none; }
        .lp-apply-btn { height: 48px; padding: 0 28px; background: #c8a84b; color: #fff; border: 0; border-radius: 10px; font: 700 13.5px 'Inter'; cursor: pointer; display: flex; align-items: center; gap: 8px; white-space: nowrap; transition: background .15s, transform .1s, box-shadow .15s; flex-shrink: 0; box-shadow: 0 4px 14px rgba(200,168,75,0.35); }
        .lp-apply-btn:hover { background: #b8963c; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,168,75,0.45); }
        .lp-apply-btn:active { transform: translateY(0); }

        /* BUY / RENT TOGGLE */
        .lp-mode-toggle { display: inline-flex; border: 1.5px solid #eaecf0; border-radius: 10px; overflow: hidden; background: #f8f9fb; height: 48px; align-self: flex-end; }
        .lp-mode-btn { padding: 0 24px; font: 600 13px 'Inter'; border: 0; background: transparent; cursor: pointer; color: #888; transition: background .15s, color .15s; }
        .lp-mode-btn.active { background: #0d1b2a; color: #fff; }

        /* RESULTS HEADER */
        .lp-results-header { max-width: 1280px; margin: 30px auto 16px; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .lp-count { font-size: 14.5px; color: #666; }
        .lp-count strong { color: #1a1a2e; font-weight: 800; font-size: 17px; }
        .lp-sort-row { display: flex; align-items: center; gap: 10px; }
        .lp-sort-label { font-size: 13px; color: #999; }
        .lp-sort-select { appearance: none; -webkit-appearance: none; background: #fff; border: 1.5px solid #eaecf0; border-radius: 8px; height: 36px; padding: 0 14px; font: 500 13px 'Inter'; color: #222; cursor: pointer; outline: none; }
        .lp-view-toggle { display: none; }
        .lp-view-btn-icon { width: 36px; height: 36px; border-radius: 8px; border: 1.5px solid #eaecf0; background: #fff; display: grid; place-items: center; cursor: pointer; transition: border-color .15s, background .15s; }
        .lp-view-btn-icon.active { border-color: #c8a84b; background: #fdf8ec; }

        /* PROPERTY GRID */
        .lp-grid-wrap { max-width: 1280px; margin: 0 auto 70px; padding: 0 32px; }
        .lp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
        .lp-grid--list { grid-template-columns: repeat(3, 1fr); }

        /* PROPERTY CARD */
        .lp-card { background: #fff; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 14px rgba(0,0,0,0.07); transition: transform .28s cubic-bezier(0.2,0.8,0.2,1), box-shadow .28s; display: flex; flex-direction: column; }
        .lp-card:hover { transform: translateY(-7px); box-shadow: 0 18px 50px rgba(0,0,0,0.14); }
        .lp-card--list { flex-direction: row; }
        .lp-card-img-wrap { position: relative; overflow: hidden; height: 235px; flex-shrink: 0; }
        .lp-card-img-wrap--list { width: 360px; height: auto; }
        .lp-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .45s; }
        .lp-card:hover .lp-card-img { transform: scale(1.05); }
        .lp-heart { position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.93); border: 0; cursor: pointer; display: grid; place-items: center; z-index: 3; box-shadow: 0 2px 10px rgba(0,0,0,0.15); transition: transform .15s; }
        .lp-heart:hover { transform: scale(1.12); }

        /* Card image overlay */
        .lp-card-overlay { position: absolute; inset: 0; z-index: 2; display: flex; align-items: stretch; padding: 14px; background: linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 45%, transparent 70%); }
        .lp-card-features { display: flex; flex-direction: column; gap: 5px; flex: 1; padding-top: 2px; }
        .lp-feat-item { display: flex; align-items: flex-start; gap: 6px; font-size: 10px; color: rgba(255,255,255,0.9); line-height: 1.35; }
        .lp-feat-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; flex-shrink: 0; margin-top: 3px; }
        .lp-card-name-area { display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; flex-shrink: 0; max-width: 50%; }
        .lp-card-name { font-size: 21px; font-weight: 900; color: #fff; text-align: right; line-height: 1.08; text-shadow: 0 2px 14px rgba(0,0,0,0.7); letter-spacing: -0.3px; }
        .lp-card-locality { font-size: 10px; font-weight: 700; letter-spacing: 1.8px; color: rgba(255,255,255,0.65); text-align: right; margin-top: 4px; }
        .lp-card-price-badge { margin-top: 8px; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.28); border-radius: 6px; padding: 4px 10px; font-size: 11.5px; font-weight: 700; color: #fff; backdrop-filter: blur(6px); text-align: right; white-space: nowrap; }
        .lp-card-badge-ribbon { position: absolute; bottom: 38px; left: 0; right: 0; z-index: 3; background: #1a1a7e; color: #fff; font-size: 9px; font-weight: 800; letter-spacing: 1.2px; text-align: center; padding: 5px 10px; text-transform: uppercase; }
        .lp-dev-tag { position: absolute; bottom: 0; left: 0; right: 0; z-index: 3; background: rgba(0,0,0,0.85); color: rgba(255,255,255,0.85); font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 7px 14px; }

        /* Card body */
        .lp-card-body { padding: 16px 18px 20px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .lp-card-title { font-size: 13.5px; font-weight: 600; color: #1a1a2e; line-height: 1.4; }
        .lp-card-price-main { font-size: 18px; font-weight: 800; color: #c8a84b; line-height: 1.2; margin-top: 2px; }
        .lp-card-loc { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #777; margin-top: 2px; }
        .lp-card-meta { display: flex; gap: 18px; margin-top: 8px; padding-top: 10px; border-top: 1px solid #f0f2f7; flex-wrap: wrap; }
        .lp-card-meta span { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #666; }
        .lp-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; flex-wrap: wrap; gap: 8px; }
        .lp-badges-row { display: flex; gap: 7px; flex-wrap: wrap; }
        .lp-badge { display: flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 500; padding: 4px 8px; border-radius: 6px; white-space: nowrap; }
        .lp-badge--green { background: #f0fdf4; color: #15803d; }
        .lp-badge--outline { background: #f8fafc; color: #555; border: 1px solid #e2e8f0; }
        .lp-view-btn { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 8px; border: 1.5px solid #1a1a2e; background: #fff; font: 600 12px 'Inter'; color: #1a1a2e; cursor: pointer; transition: background .15s, color .15s; white-space: nowrap; }
        .lp-view-btn:hover { background: #1a1a2e; color: #fff; }

        /* PROMO BANNER */
        .lp-promo-banner {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #0a0e1e, #1a1a2e);
          border-radius: 18px;
          padding: 32px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin: 10px 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }
        .lp-promo-banner::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url('/images/heroBg.png');
          background-size: cover;
          background-position: center;
          opacity: 0.15;
          z-index: 0;
        }
        .lp-promo-content { position: relative; z-index: 1; }
        .lp-promo-banner h3 { color: #fff; font-size: 24px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.5px; }
        .lp-promo-banner p { color: #a0a5b5; font-size: 15px; margin: 0; max-width: 600px; line-height: 1.5; }
        .lp-promo-btn {
          position: relative;
          z-index: 1;
          background: #c8a84b;
          color: #1a1a2e;
          font: 700 15px 'Inter';
          padding: 14px 28px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.2s, background 0.2s;
        }
        .lp-promo-btn:hover { background: #d4b55b; transform: translateY(-2px); }

        /* DESKTOP & TABLET LIST VIEW STYLES */
        @media (min-width: 721px) {
          .lp-card--list .lp-card-body {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto 1fr auto;
            gap: 6px 30px;
            padding: 24px 30px;
          }
          .lp-card--list .lp-card-title { grid-column: 1; grid-row: 1; font-size: 18px; margin-bottom: 2px; }
          .lp-card--list .lp-card-loc { grid-column: 1; grid-row: 2; font-size: 14px; margin-bottom: 8px; }
          .lp-card--list .lp-card-meta { grid-column: 1; grid-row: 3; align-self: start; border: none; padding: 0; margin: 0; }
          .lp-card--list .lp-card-meta span { font-size: 13.5px; }
          
          .lp-card--list .lp-card-price-main { grid-column: 2; grid-row: 1 / span 2; font-size: 24px; text-align: right; margin: 0; align-self: start; }
          
          .lp-card--list .lp-card-footer { grid-column: 1 / -1; grid-row: 4; border-top: 1px solid #f0f2f7; padding-top: 18px; margin-top: 12px; }
        }

        /* EMPTY STATE */
        .lp-empty { grid-column: 1 / -1; text-align: center; padding: 80px 24px; }
        .lp-empty-icon { font-size: 52px; margin-bottom: 16px; }
        .lp-empty h3 { font-size: 20px; font-weight: 700; color: #333; margin-bottom: 8px; }
        .lp-empty p { color: #888; font-size: 14px; }

        /* DESKTOP: hide apply btn */
        .lp-apply-btn { display: none; }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .lp-grid { grid-template-columns: repeat(2, 1fr); }
          .lp-grid.lp-grid--list { grid-template-columns: 1fr; }
        }

        /* ── MOBILE (≤720px) ─────────────────────── */
        @media (max-width: 720px) {
          .lp-grid { grid-template-columns: 1fr; }
          .lp-hero-inner, .lp-results-header, .lp-grid-wrap { padding-left: 16px; padding-right: 16px; }
          .lp-filter-bar-wrap { display: none; }
          .lp-trust-divider { display: none; }
          .lp-trust-item { padding: 0 14px; }
          .lp-trust-row { gap: 8px 0; }
          .lp-grid-wrap { margin-bottom: 100px; }

          /* Mobile Promo Banner */
          .lp-promo-banner { flex-direction: column; align-items: flex-start; padding: 24px; }
          .lp-promo-banner h3 { font-size: 20px; }
          .lp-promo-btn { width: 100%; text-align: center; }

          /* Proper Mobile List View */
          .lp-card--list { flex-direction: row; min-height: 135px; }
          .lp-card-img-wrap--list { width: 135px; height: auto; }
          .lp-card--list .lp-card-overlay,
          .lp-card--list .lp-dev-tag,
          .lp-card--list .lp-card-badge-ribbon { display: none; }
          .lp-card--list .lp-heart { top: 8px; left: 8px; right: auto; width: 28px; height: 28px; }
          .lp-card--list .lp-card-body { padding: 12px; justify-content: center; gap: 4px; }
          .lp-card--list .lp-card-title { font-size: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3; }
          .lp-card--list .lp-card-price-main { font-size: 15px; margin-top: 0; }
          .lp-card--list .lp-card-loc { font-size: 10px; margin-top: 0; }
          .lp-card--list .lp-card-meta { margin-top: 4px; padding-top: 8px; gap: 8px; }
          .lp-card--list .lp-card-meta span { font-size: 10px; }
          .lp-card--list .lp-badges-row { display: none; }
          .lp-card--list .lp-card-footer { margin-top: 6px; }
          .lp-card--list .lp-view-btn { padding: 6px 12px; font-size: 10.5px; }

          /* Sticky mobile footer toolbar */
          .lp-mob-toolbar {
            display: flex !important;
          }
          /* Bottom-sheet drawer */
          .lp-drawer-backdrop { display: block !important; }
          .lp-drawer { display: flex !important; }
        }

        /* ── MOBILE TOOLBAR ─────────────────────── */
        .lp-mob-toolbar {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
          background: #fff;
          border-top: 1px solid #e8eaed;
          box-shadow: 0 -4px 24px rgba(0,0,0,0.10);
          height: 64px;
        }
        .lp-mob-tab {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 2px;
          background: transparent; border: 0;
          cursor: pointer;
          padding: 10px 8px 8px;
          position: relative;
          transition: background .12s;
        }
        .lp-mob-tab:not(:last-child) { border-right: 1px solid #e8eaed; }
        .lp-mob-tab.active { background: #fdf8ec; }
        .lp-mob-tab-label {
          font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; color: #333;
          display: flex; align-items: center; gap: 3px;
        }
        .lp-mob-tab-label svg { width: 8px; height: 8px; color: #555; }
        .lp-mob-tab-sub {
          font-size: 11.5px; font-weight: 500; color: #1a88d4;
        }
        .lp-mob-tab-badge {
          position: absolute; top: 8px; right: calc(50% - 22px);
          min-width: 16px; height: 16px; border-radius: 999px;
          background: #c8a84b; color: #fff;
          font-size: 9px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
        }

        /* ── BOTTOM SHEET DRAWER ─────────────────── */
        .lp-drawer-backdrop {
          display: none;
          position: fixed; inset: 0; z-index: 300;
          background: rgba(0,0,0,0.45);
          animation: lpFadeIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }
        .lp-drawer-backdrop.closing {
          animation: lpFadeOut 0.3s cubic-bezier(0.4,0,1,1) both;
        }
        @keyframes lpFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lpFadeOut { from { opacity: 1; } to { opacity: 0; } }

        .lp-drawer {
          display: none;
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 301;
          height: 70%;
          background: #fff;
          border-radius: 20px 20px 0 0;
          flex-direction: column;
          overflow: hidden;
          /* Open: spring curve — feels physical */
          animation: lpSlideUp 0.42s cubic-bezier(0.16,1,0.3,1) both;
          will-change: transform;
        }
        .lp-drawer.closing {
          animation: lpSlideDown 0.32s cubic-bezier(0.4,0,0.6,1) both;
        }
        @keyframes lpSlideUp {
          from { transform: translateY(105%); }
          to   { transform: translateY(0); }
        }
        @keyframes lpSlideDown {
          from { transform: translateY(0); }
          to   { transform: translateY(105%); }
        }
        .lp-drawer-handle {
          width: 40px; height: 4px; border-radius: 99px;
          background: #d1d5db; margin: 12px auto 0;
          flex-shrink: 0;
        }
        .lp-drawer-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px 12px;
          border-bottom: 1px solid #f0f2f5;
          flex-shrink: 0;
        }
        .lp-drawer-title {
          font-size: 15px; font-weight: 700; color: #1a1a2e;
        }
        .lp-drawer-close {
          width: 30px; height: 30px; border-radius: 50%;
          background: #f3f4f6; border: 0; cursor: pointer;
          display: grid; place-items: center; color: #555;
          font-size: 16px; line-height: 1;
        }
        .lp-drawer-body {
          flex: 1; overflow-y: auto; padding: 16px 20px 24px;
        }
        /* Drawer option list */
        .lp-drawer-options { display: flex; flex-direction: column; gap: 6px; }
        .lp-drawer-opt {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px; border-radius: 12px;
          border: 1.5px solid #eaecf0; background: #fff;
          font: 500 14px 'Inter'; color: #333; cursor: pointer;
          transition: border-color .15s, background .15s;
        }
        .lp-drawer-opt.selected {
          border-color: #c8a84b; background: #fdf8ec; color: #1a1a2e; font-weight: 600;
        }
        .lp-drawer-opt-check {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid #d1d5db;
          display: grid; place-items: center; flex-shrink: 0;
        }
        .lp-drawer-opt.selected .lp-drawer-opt-check {
          border-color: #c8a84b; background: #c8a84b;
        }
        .lp-drawer-opt.selected .lp-drawer-opt-check::after {
          content: '';
          width: 5px; height: 9px;
          border-right: 2px solid #fff; border-bottom: 2px solid #fff;
          transform: rotate(45deg) translateY(-1px);
          display: block;
        }
        /* Drawer filter groups */
        .lp-drawer-group { margin-bottom: 20px; }
        .lp-drawer-group-label {
          font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; color: #aaa; margin-bottom: 10px;
        }
        .lp-drawer-chips {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .lp-drawer-chip {
          padding: 8px 16px; border-radius: 999px;
          border: 1.5px solid #eaecf0; background: #fff;
          font: 500 13px 'Inter'; color: #333; cursor: pointer;
          transition: border-color .12s, background .12s;
        }
        .lp-drawer-chip.selected {
          border-color: #c8a84b; background: #fdf8ec;
          color: #b8963c; font-weight: 600;
        }
        /* Drawer footer */
        .lp-drawer-foot {
          padding: 12px 20px 20px; flex-shrink: 0;
          border-top: 1px solid #f0f2f5;
          display: flex; gap: 10px;
        }
        .lp-drawer-reset {
          flex: 1; height: 48px; border-radius: 10px;
          border: 1.5px solid #ddd; background: #fff;
          font: 600 14px 'Inter'; color: #555; cursor: pointer;
        }
        .lp-drawer-apply {
          flex: 2; height: 48px; border-radius: 10px;
          border: 0; background: #c8a84b; color: #fff;
          font: 700 14px 'Inter'; cursor: pointer;
          box-shadow: 0 4px 14px rgba(200,168,75,.35);
        }
      `}</style>

      <div className="lp-root">
        {/* ── HERO ──────────────────────────────── */}
        <section className="lp-hero">
          <div className="lp-hero-bg" aria-hidden="true" />
          <div className="lp-hero-overlay" aria-hidden="true" />
          <div className="lp-hero-inner">
            <div className="lp-hero-eyebrow" aria-hidden="true">
              <div className="lp-hero-eyebrow-line" />
              <span className="lp-hero-eyebrow-text">The Propertist</span>
              <div className="lp-hero-eyebrow-line" />
            </div>
            <h1 className="lp-hero-h1">
              Verified ₹2 Crore+ Homes <em>in Mumbai</em>
            </h1>
            <p className="lp-hero-sub">
              Handpicked properties from Kalpataru, Godrej, Lodha, Oberoi &amp; more.<br />
              Zero brokerage for buyers.
            </p>
            <div className="lp-trust-row" role="list">
              <div className="lp-trust-item" role="listitem">
                <div className="lp-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="lp-trust-text">
                  <b>Verified Projects</b>
                  <span>RERA Approved</span>
                </div>
              </div>
              <div className="lp-trust-divider" aria-hidden="true" />
              <div className="lp-trust-item" role="listitem">
                <div className="lp-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="lp-trust-text">
                  <b>Trusted by 10,000+ Buyers</b>
                  <span>Across Mumbai</span>
                </div>
              </div>
              <div className="lp-trust-divider" aria-hidden="true" />
              <div className="lp-trust-item" role="listitem">
                <div className="lp-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                </div>
                <div className="lp-trust-text">
                  <b>Zero Brokerage</b>
                  <span>Direct from Developers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FILTER BAR ────────────────────────── */}
        <div className="lp-filter-bar-wrap">
          <div className="lp-filter-bar" role="search">
            <div className="lp-mode-toggle" role="group" aria-label="Listing type">
              {(["buy", "rent"] as const).map((m) => (
                <button
                  key={m}
                  id={`toggle-${m}`}
                  className={`lp-mode-btn${mode === m ? " active" : ""}`}
                  onClick={() => updateParams({ mode: m })}
                >
                  {m === "buy" ? "Buy" : "Rent"}
                </button>
              ))}
            </div>

            <div className="lp-search-field">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
              </svg>
              <input
                id="lp-search"
                type="text"
                placeholder="Search by project, locality or developer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>

            {/* Desktop dropdowns: each change updates ONLY that one URL param */}
            <SelectFilter
              id="lp-locality" label="Locality"
              options={LOCALITIES} value={locality}
              onChange={(key) => updateParams({ locality: key })}
            />
            <SelectFilter
              id="lp-config" label="Configuration"
              options={CONFIGURATIONS} value={config}
              onChange={(key) => updateParams({ config: key })}
            />
            <SelectFilter
              id="lp-developer" label="Developer"
              options={DEVELOPERS} value={developer}
              onChange={(key) => updateParams({ developer: key })}
            />
            <SelectFilter
              id="lp-status" label="Status"
              options={STATUS_OPTIONS} value={status}
              onChange={(key) => updateParams({ status: key })}
            />
          </div>
        </div>

        {/* ── RESULTS HEADER ─────────────────────── */}
        <div className="lp-results-header">
          <p className="lp-count">
            <strong>{filtered.length}</strong> properties found
          </p>
          <div className="lp-sort-row">
            <span className="lp-sort-label">Sort by</span>
            <select
              id="lp-sort"
              className="lp-sort-select"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
            >
              {["Relevance", "Price: Low to High", "Price: High to Low", "Newest First"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="lp-view-toggle">
              <button id="lp-view-grid" className={`lp-view-btn-icon${view === "grid" ? " active" : ""}`} onClick={() => updateParams({ view: "grid" })} aria-label="Grid view">
                <GridIcon active={view === "grid"} />
              </button>
              <button id="lp-view-list" className={`lp-view-btn-icon${view === "list" ? " active" : ""}`} onClick={() => updateParams({ view: "list" })} aria-label="List view">
                <ListIcon active={view === "list"} />
              </button>
            </div>
          </div>
        </div>

        {/* ── PROPERTY GRID ──────────────────────── */}
        <main className="lp-grid-wrap">
          <div className={`lp-grid${view === "list" ? " lp-grid--list" : ""}`}>
            {filtered.length === 0 ? (
              <div className="lp-empty">
                <div className="lp-empty-icon">🏡</div>
                <h3>No properties found</h3>
                <p>Try adjusting your filters or switch between Buy / Rent.</p>
              </div>
            ) : (
              filtered.map((p, index) => (
  <Fragment key={p.id}>
    <PropertyCard property={p} view={view} />

    {(index + 1) % 6 === 0 && index !== filtered.length - 1 && (() => {
      const offerIndex = (index + 1) / 6 - 1;
      const offer = OFFERS[offerIndex % OFFERS.length];

      return (
        <div className="lp-promo-banner">
          <div className="lp-promo-content">
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
          </div>

          <button className="lp-promo-btn">
            {offer.button}
          </button>
        </div>
      );
    })()}
  </Fragment>
))
            )}
          </div>
        </main>

        {/* ── MOBILE STICKY TOOLBAR ─────────────── */}
        <nav className="lp-mob-toolbar" aria-label="Filter toolbar">
          {/* VIEW */}
          <button
            id="mob-tab-view"
            className={`lp-mob-tab${drawer === "view" ? " active" : ""}`}
            onClick={() => openDrawer("view")}
          >
            <span className="lp-mob-tab-label">
              VIEW
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m6 9 6 6 6-6" /></svg>
            </span>
            <span className="lp-mob-tab-sub">{view === "grid" ? "Grid View" : "List View"}</span>
          </button>
          {/* SORT */}
          <button
            id="mob-tab-sort"
            className={`lp-mob-tab${drawer === "sort" ? " active" : ""}`}
            onClick={() => openDrawer("sort")}
          >
            <span className="lp-mob-tab-label">
              SORT
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m6 9 6 6 6-6" /></svg>
            </span>
            <span className="lp-mob-tab-sub">{sort.split(":")[0].trim()}</span>
          </button>
          {/* FILTER */}
          <button
            id="mob-tab-filter"
            className={`lp-mob-tab${drawer === "filter" ? " active" : ""}`}
            onClick={() => openDrawer("filter")}
          >
            {activeFilterCount > 0 && (
              <span className="lp-mob-tab-badge">{activeFilterCount}</span>
            )}
            <span className="lp-mob-tab-label">
              FILTER
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m6 9 6 6 6-6" /></svg>
            </span>
            <span className="lp-mob-tab-sub">{activeFilterCount === 0 ? "0 applied" : `${activeFilterCount} applied`}</span>
          </button>
        </nav>

        {/* ── BOTTOM SHEET BACKDROP ─────────────── */}
        {drawer && (
          <div
            className={`lp-drawer-backdrop${isClosing ? " closing" : ""}`}
            onClick={closeDrawer}
            aria-hidden="true"
          />
        )}

        {/* ── BOTTOM SHEET DRAWER ───────────────── */}
        {drawer && (
          <div className={`lp-drawer${isClosing ? " closing" : ""}`} role="dialog" aria-modal="true" aria-label={`${drawer} options`}>
            <div className="lp-drawer-handle" />
            <div className="lp-drawer-head">
              <span className="lp-drawer-title">
                {drawer === "view" && "View"}
                {drawer === "sort" && "Sort By"}
                {drawer === "filter" && "Filters"}
              </span>
              <button className="lp-drawer-close" onClick={closeDrawer} aria-label="Close">✕</button>
            </div>

            <div className="lp-drawer-body">
              {/* VIEW PANEL */}
              {drawer === "view" && (
                <div className="lp-drawer-options">
                  {(["grid", "list"] as const).map((v) => (
                    <button
                      key={v}
                      className={`lp-drawer-opt${view === v ? " selected" : ""}`}
                      onClick={() => { updateParams({ view: v }); closeDrawer(); }}
                    >
                      {v === "grid" ? "Grid View" : "List View"}
                      <span className="lp-drawer-opt-check" />
                    </button>
                  ))}
                </div>
              )}

              {/* SORT PANEL */}
              {drawer === "sort" && (
                <div className="lp-drawer-options">
                  {["Relevance", "Price: Low to High", "Price: High to Low", "Newest First"].map((s) => (
                    <button
                      key={s}
                      className={`lp-drawer-opt${sort === s ? " selected" : ""}`}
                      onClick={() => { updateParams({ sort: s }); closeDrawer(); }}
                    >
                      {s}
                      <span className="lp-drawer-opt-check" />
                    </button>
                  ))}
                </div>
              )}

              {/* FILTER PANEL — each chip immediately updates its own URL param */}
              {drawer === "filter" && (
                <div>
                  <div className="lp-drawer-group">
                    <div className="lp-drawer-group-label">Locality</div>
                    <div className="lp-drawer-chips">
                      {LOCALITIES.map((loc) => (
                        <button
                          key={loc.key}
                          className={`lp-drawer-chip${locality === loc.key ? " selected" : ""}`}
                          onClick={() => updateParams({ locality: loc.key })}
                        >{loc.label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="lp-drawer-group">
                    <div className="lp-drawer-group-label">Configuration</div>
                    <div className="lp-drawer-chips">
                      {CONFIGURATIONS.map((cfg) => (
                        <button
                          key={cfg.key}
                          className={`lp-drawer-chip${config === cfg.key ? " selected" : ""}`}
                          onClick={() => updateParams({ config: cfg.key })}
                        >{cfg.label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="lp-drawer-group">
                    <div className="lp-drawer-group-label">Status</div>
                    <div className="lp-drawer-chips">
                      {STATUS_OPTIONS.map((st) => (
                        <button
                          key={st.key}
                          className={`lp-drawer-chip${status === st.key ? " selected" : ""}`}
                          onClick={() => updateParams({ status: st.key })}
                        >{st.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {drawer === "filter" && (
              <div className="lp-drawer-foot">
                {/* Reset: clears all four filter params from URL */}
                <button className="lp-drawer-reset" onClick={() => {
                  updateParams({ locality: "", config: "", status: "", developer: "" });
                }}>Reset</button>
                <button className="lp-drawer-apply" onClick={applyFilters}>Done</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
