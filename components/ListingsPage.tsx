"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ALL_PROPERTIES } from "@/utilities/masterData";
import { useWishlistItem } from "@/utilities/wishlist";

// ─── Data ────────────────────────────────────────────────────────────────────

// ─── Filter option type ─────────────────────────────────────────────────────
type FilterOption = { key: string; label: string };

// key: "" = "show all" (removes param from URL)
const LOCALITIES: FilterOption[] = [
  { key: "",               label: "All Localities" },
  { key: "bangalore",      label: "Bangalore" },
  { key: "pune",           label: "Pune" },
  { key: "kandivali_east", label: "Kandivali East" },
  { key: "lokhandwala",    label: "Lokhandwala" },
  { key: "andheri_west",   label: "Andheri West" },
  { key: "bandra_west",    label: "Bandra West" },
  { key: "powai",          label: "Powai" },
  { key: "malad_west",     label: "Malad West" },
  { key: "borivali_west",  label: "Borivali West" },
  { key: "goregaon_west",  label: "Goregaon West" },
];

const CONFIGURATIONS: FilterOption[] = [
  { key: "",        label: "All Configurations" },
  { key: "house",    label: "Villas & Houses" },
  { key: "plot",     label: "Plots & Land" },
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
  { key: "prestige",  label: "Prestige Group" },
  { key: "sobha",     label: "Sobha Limited" },
  { key: "kalpataru", label: "Kalpataru" },
  { key: "godrej",    label: "Godrej Properties" },
  { key: "lodha",     label: "Lodha Group" },
  { key: "oberoi",    label: "Oberoi Realty" },
  { key: "rustomjee", label: "Rustomjee" },
];

const BUDGET_OPTIONS: FilterOption[] = [
  { key: "",      label: "All Budgets" },
  { key: "0-1.5", label: "Under ₹1.5 Cr" },
  { key: "1.5-3", label: "₹1.5 - 3 Cr" },
  { key: "3-5",   label: "₹3 - 5 Cr" },
  { key: "5+",    label: "₹5 Cr+" },
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

// Parse comma-separated URL param into array of keys
function parseMultiKeys(paramValue: string | null): string[] {
  if (!paramValue) return [];
  return paramValue
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

// Convert array of keys back to comma-separated string (or "" if empty)
function serializeMultiKeys(keys: string[]): string {
  return Array.from(new Set(keys.filter(Boolean))).join(",");
}

// Toggle a key in a multi-key list
function toggleMultiKey(currentKeys: string[], targetKey: string): string {
  if (!targetKey) return "";
  const exists = currentKeys.includes(targetKey);
  const next = exists
    ? currentKeys.filter((k) => k !== targetKey)
    : [...currentKeys, targetKey];
  return serializeMultiKeys(next);
}

// Match a property against the active config key (key="" means no filter)
function matchConfig(propConfigKeys: string[], filterKey: string): boolean {
  if (!filterKey) return true;
  return propConfigKeys.includes(filterKey);
}

// Match a property against multiple config keys (empty array means no filter)
function matchMultiConfig(propConfigKeys: string[], filterKeys: string[]): boolean {
  if (!filterKeys || filterKeys.length === 0) return true;
  if (!propConfigKeys || !Array.isArray(propConfigKeys)) return false;
  return filterKeys.some((fk) => propConfigKeys.includes(fk));
}

// Match property against multiple budget range keys (empty array means no filter)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function matchMultiBudget(property: any, budgetKeys: string[]): boolean {
  if (!budgetKeys || budgetKeys.length === 0) return true;
  return budgetKeys.some((bk) => matchBudget(property, bk));
}

// Get display label for an active filter key
function getLabel(options: FilterOption[], key: string): string {
  return options.find((o) => o.key === key)?.label ?? key;
}

// Parse property price string (e.g. '₹ 4.95 Cr.+++', '₹ 85 Lakh') to numeric value for accurate sorting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePropertyPrice(property: any): number {
  const str = (property?.priceFrom || property?.priceLabel || property?.price || "").toString();
  const numMatch = str.match(/[\d,.]+/);
  if (!numMatch) return 0;
  const num = parseFloat(numMatch[0].replace(/,/g, ""));
  if (isNaN(num)) return 0;

  const lower = str.toLowerCase();
  if (lower.includes("cr") || lower.includes("crore")) {
    return num * 10000000;
  }
  if (lower.includes("lakh") || lower.includes("lac") || lower.includes("l")) {
    return num * 100000;
  }
  if (lower.includes("k") || lower.includes("thousand")) {
    return num * 1000;
  }
  return num;
}

// Match property against multi-term search query across all records and fields (optionally filtered by mode)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function matchesSearch(property: any, query: string, mode?: string): boolean {
  if (mode) {
    const propMode = property?.mode || "buy";
    if (propMode !== mode) return false;
  }

  if (!query || !query.trim()) return true;

  const terms = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) return true;

  const corpus = [
    property.name,
    property.projectName,
    property.developer,
    property.developer_key,
    property.locality,
    property.locality_key,
    property.locality_label,
    property.address,
    property.config,
    property.config_label,
    property.beds,
    property.status,
    property.status_key,
    property.badge,
    property.mode,
    property.description,
    Array.isArray(property.features) ? property.features.join(" ") : "",
    Array.isArray(property.amenities) ? property.amenities.join(" ") : "",
    Array.isArray(property.config_keys) ? property.config_keys.join(" ") : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const corpusNoSpaces = corpus.replace(/\s+/g, "");

  return terms.every((term) => {
    const cleanTerm = term.replace(/\s+/g, "");
    return corpus.includes(term) || corpusNoSpaces.includes(cleanTerm);
  });
}

// Match property against budget range key
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function matchBudget(property: any, budgetKey: string): boolean {
  if (!budgetKey) return true;
  const price = parsePropertyPrice(property);
  if (budgetKey === "0-1.5") return price > 0 && price <= 15000000;
  if (budgetKey === "1.5-3") return price >= 15000000 && price <= 30000000;
  if (budgetKey === "3-5") return price >= 30000000 && price <= 50000000;
  if (budgetKey === "5+") return price >= 50000000;
  return true;
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: "100%", height: "100%", display: "block" }}>
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

function CheckmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Custom multi-select dropdown with luxury design
function MultiSelectFilter({
  id,
  label,
  options,
  selectedKeys,
  isOpen,
  onToggleOpen,
  onToggleKey,
  onClear,
}: {
  id: string;
  label: string;
  options: FilterOption[];
  selectedKeys: string[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleKey: (key: string) => void;
  onClear: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onToggleOpen();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onToggleOpen();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onToggleOpen]);

  // Meaningful non-empty options
  const filterOptions = options.filter((o) => o.key !== "");
  const hasSelection = selectedKeys.length > 0;

  // Compute trigger label
  let triggerText = `All ${label}s`;
  if (label.toLowerCase() === "status") triggerText = "All Statuses";
  if (label.toLowerCase() === "locality") triggerText = "All Localities";
  if (label.toLowerCase() === "configuration") triggerText = "All BHK";
  if (label.toLowerCase() === "developer") triggerText = "All Developers";
  if (label.toLowerCase() === "budget") triggerText = "All Budgets";

  if (selectedKeys.length === 1) {
    const match = filterOptions.find((o) => o.key === selectedKeys[0]);
    if (match) triggerText = match.label;
  } else if (selectedKeys.length === 2) {
    const l1 = filterOptions.find((o) => o.key === selectedKeys[0])?.label ?? "";
    const l2 = filterOptions.find((o) => o.key === selectedKeys[1])?.label ?? "";
    const short1 = l1.replace(" Group", "").replace(" Realty", "");
    const short2 = l2.replace(" Group", "").replace(" Realty", "");
    const combined = `${short1}, ${short2}`;
    triggerText = combined.length <= 18 ? combined : "2 selected";
  } else if (selectedKeys.length > 2) {
    triggerText = `${selectedKeys.length} selected`;
  }

  return (
    <div className="lp-custom-dropdown" ref={ref} id={`wrap-${id}`}>
      <span className="lp-filter-label">{label}</span>
      <button
        id={id}
        type="button"
        className={`lp-dropdown-btn${isOpen ? " open" : ""}${hasSelection ? " has-value" : ""}`}
        onClick={onToggleOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="lp-dropdown-text" title={hasSelection ? selectedKeys.map((k) => getLabel(options, k)).join(", ") : triggerText}>
          {triggerText}
        </span>
        <div className="lp-dropdown-right">
          {selectedKeys.length > 1 && (
            <span className="lp-dropdown-badge">{selectedKeys.length}</span>
          )}
          <span className="lp-dropdown-chevron">
            <ChevronIcon />
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="lp-dropdown-menu" role="listbox" aria-multiselectable="true">
          <div className="lp-dropdown-header">
            <span>{hasSelection ? `${selectedKeys.length} selected` : "Select options"}</span>
            {hasSelection && (
              <button
                type="button"
                className="lp-dropdown-clear-link"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
              >
                Clear
              </button>
            )}
          </div>
          <div className="lp-dropdown-list">
            <button
              type="button"
              className={`lp-dropdown-item${!hasSelection ? " selected" : ""}`}
              onClick={() => onClear()}
            >
              <span className="lp-dropdown-check">
                {!hasSelection && <CheckmarkIcon />}
              </span>
              <span>All {label === "Configuration" ? "BHK" : label + "s"}</span>
            </button>
            {filterOptions.map((opt) => {
              const isSelected = selectedKeys.includes(opt.key);
              return (
                <button
                  key={opt.key}
                  type="button"
                  className={`lp-dropdown-item${isSelected ? " selected" : ""}`}
                  onClick={() => onToggleKey(opt.key)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="lp-dropdown-check">
                    {isSelected && <CheckmarkIcon />}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Fast typing Search Field with debounced parent emission & Advanced Voice-to-Text
const SearchField = memo(function SearchField({
  id = "lp-search",
  value,
  onSearch,
  onClear,
  isLoading,
  placeholder = "Search all properties...",
}: {
  id?: string;
  value: string;
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  placeholder?: string;
}) {
  const [localText, setLocalText] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const lastEmittedRef = useRef(value);
  const onSearchRef = useRef(onSearch);
  const onClearRef = useRef(onClear);

  useEffect(() => {
    onSearchRef.current = onSearch;
    onClearRef.current = onClear;
  });

  // Sync when parent value changes externally (e.g. Back/Forward, Clear All, HomeSpace)
  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      setLocalText(value);
      lastEmittedRef.current = value;
      setIsDebouncing(false);
    }
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (localText.trim() === lastEmittedRef.current.trim()) {
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    const timer = setTimeout(() => {
      const trimmed = localText.trim();
      lastEmittedRef.current = trimmed;
      setIsDebouncing(false);
      onSearchRef.current(trimmed);
    }, 1000);

    return () => clearTimeout(timer);
  }, [localText]);

  // Auto-dismiss voice feedback after 4 seconds
  useEffect(() => {
    if (!voiceError) return;
    const timer = setTimeout(() => setVoiceError(null), 4000);
    return () => clearTimeout(timer);
  }, [voiceError]);

  // Clean up recognition instance on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice search is not supported by your browser. Try Chrome, Edge, or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang =
        typeof navigator !== "undefined" && navigator.language?.startsWith("en")
          ? navigator.language
          : "en-IN";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0]?.transcript || "";
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }
        const spoken = (final || interim).trim();
        if (spoken) {
          setLocalText(spoken);
        }
        if (final) {
          const cleaned = final.trim();
          lastEmittedRef.current = cleaned;
          setIsDebouncing(false);
          onSearchRef.current(cleaned);
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          setVoiceError("Microphone access denied. Please allow microphone permissions.");
        } else if (e.error !== "no-speech") {
          setVoiceError(`Voice error (${e.error}). Please try again.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Speech recognition error:", err);
      setVoiceError("Could not access microphone. Please check permissions.");
      setIsListening(false);
    }
  }, [isListening, stopListening]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isListening) {
      stopListening();
    }
    setLocalText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isListening) {
        stopListening();
      }
      const trimmed = localText.trim();
      lastEmittedRef.current = trimmed;
      setIsDebouncing(false);
      onSearchRef.current(trimmed);
    }
  };

  const handleClear = () => {
    if (isListening) {
      stopListening();
    }
    setLocalText("");
    lastEmittedRef.current = "";
    setIsDebouncing(false);
    onClearRef.current();
  };

  return (
    <div className={`lp-search-field${isListening ? " is-listening" : ""}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="lp-search-icon">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
      <input
        id={id}
        type="text"
        placeholder={
          isListening
            ? "Listening... Speak now (e.g. '3 BHK in Bandra')"
            : placeholder
        }
        value={localText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck="false"
      />
      {(isDebouncing || isLoading) && (
        <span
          className="lp-search-spinner"
          title="Searching all records..."
        />
      )}
      {localText && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="lp-search-clear"
        >
          ✕
        </button>
      )}

      {/* Voice wave bars when microphone is listening */}
      {isListening && (
        <div className="lp-voice-wave-indicator" title="Listening to voice input...">
          <span className="lp-wave-line" style={{ animationDelay: "0ms" }} />
          <span className="lp-wave-line" style={{ animationDelay: "150ms" }} />
          <span className="lp-wave-line" style={{ animationDelay: "300ms" }} />
          <span className="lp-wave-line" style={{ animationDelay: "450ms" }} />
        </div>
      )}

      {/* Mic button with active pulse */}
      <button
        type="button"
        id={`${id}-mic`}
        onClick={toggleListening}
        className={`lp-search-mic${isListening ? " listening" : ""}`}
        aria-label={isListening ? "Stop voice search" : "Search by voice"}
        title={isListening ? "Listening... Click to stop" : "Search by voice"}
      >
        {isListening && <span className="lp-mic-pulse-ring" />}
        <svg
          viewBox="0 0 24 24"
          fill={isListening ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </button>

      {/* Floating feedback message for voice status / permission denied */}
      {voiceError && (
        <div className="lp-voice-toast" role="alert">
          <span>{voiceError}</span>
          <button type="button" onClick={() => setVoiceError(null)} aria-label="Dismiss message">
            ✕
          </button>
        </div>
      )}
    </div>
  );
});

// ─── Property Card ────────────────────────────────────────────────────────────

type Property = typeof ALL_PROPERTIES[0];

const PropertyCard = memo(function PropertyCard({ property, view }: { property: Property; view: "grid" | "list" }) {
  const { isLiked, toggle } = useWishlistItem(property.id);

  const cardBody = (
    <div className="lp-card-body">
      <div className="lp-card-title">{property.config_label}</div>
      <div className="lp-card-price-main">
        {property.mode === "rent" ? property.priceFrom : `${property.priceFrom} Onwards`}
      </div>
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
        {/* <div className="lp-view-btn">View Details <span>→</span></div> */}
      </div>
    </div>
  );

  return (
    <Link href={`/property/${property.slug}`} className={`lp-card${view === "list" ? " lp-card--list" : ""}`}>
      <div className={`lp-card-img-wrap${view === "list" ? " lp-card-img-wrap--list" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={property?.gallery[0]} alt={property.name} className="lp-card-img" />
        <button
          className="lp-heart"
          onClick={toggle}
          aria-label={isLiked ? "Remove from wishlist" : "Save property"}
        >
          <HeartIcon filled={isLiked} />
        </button>

        {/* Overlay: features left, name+price right */}
        {/* <div className="lp-card-overlay">
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
        </div> */}

        {property.badge && <div className="lp-card-badge-ribbon">{property.badge}</div>}
        {/* <div className="lp-dev-tag">{property.developer}</div> */}
      </div>
      {cardBody}
    </Link>
  );
});

// ─── Property Card Skeleton ───────────────────────────────────────────────────

const PropertyCardSkeleton = memo(function PropertyCardSkeleton({ view }: { view: "grid" | "list" }) {
  return (
    <div className={`lp-card lp-card--skeleton${view === "list" ? " lp-card--list" : ""}`} aria-hidden="true">
      <div className={`lp-card-img-wrap${view === "list" ? " lp-card-img-wrap--list" : ""}`}>
        <div className="lp-skel-img lp-skel-shimmer" />
        <div className="lp-skel-heart" />
        <div className="lp-card-overlay">
          <div className="lp-card-features">
            <div className="lp-skel-line lp-skel-line--xs lp-skel-shimmer" style={{ width: "85px" }} />
            <div className="lp-skel-line lp-skel-line--xs lp-skel-shimmer" style={{ width: "105px" }} />
            <div className="lp-skel-line lp-skel-line--xs lp-skel-shimmer" style={{ width: "70px" }} />
          </div>
          <div className="lp-card-name-area">
            <div className="lp-skel-line lp-skel-line--lg lp-skel-shimmer" style={{ width: "120px" }} />
            <div className="lp-skel-line lp-skel-line--xs lp-skel-shimmer" style={{ width: "75px", marginTop: "4px" }} />
          </div>
        </div>
      </div>
      <div className="lp-card-body">
        <div className="lp-card-title">
          <div className="lp-skel-line lp-skel-line--md lp-skel-shimmer" style={{ width: "70%" }} />
        </div>
        <div className="lp-card-price-main">
          <div className="lp-skel-line lp-skel-line--lg lp-skel-shimmer" style={{ width: "130px" }} />
        </div>
        <div className="lp-card-loc">
          <div className="lp-skel-line lp-skel-line--sm lp-skel-shimmer" style={{ width: "55%" }} />
        </div>
        <div className="lp-card-meta">
          <div className="lp-skel-line lp-skel-line--sm lp-skel-shimmer" style={{ width: "80px" }} />
          <div className="lp-skel-line lp-skel-line--sm lp-skel-shimmer" style={{ width: "65px" }} />
        </div>
        <div className="lp-card-footer">
          <div className="lp-badges-row">
            <div className="lp-skel-badge lp-skel-shimmer" style={{ width: "95px", height: "24px" }} />
            <div className="lp-skel-badge lp-skel-shimmer" style={{ width: "85px", height: "24px" }} />
          </div>
        </div>
      </div>
    </div>
  );
});

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
  const budget    = searchParams.get("budget")   ?? "";
  const type      = searchParams.get("type")     ?? "";
  const sort      = searchParams.get("sort")     ?? "Relevance";
  const view      = (searchParams.get("view")    ?? "grid") as "grid" | "list";

  const selectedLocalities = parseMultiKeys(locality);
  const selectedConfigs    = parseMultiKeys(config);
  const selectedDevelopers = parseMultiKeys(developer);
  const selectedBudgets    = parseMultiKeys(budget);
  const selectedStatuses   = parseMultiKeys(status);

  const urlQ = searchParams.get("q") ?? "";
  const lastSyncedQRef = useRef(urlQ);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(urlQ);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchLoadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [drawer, setDrawer] = useState<DrawerPanel>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Default initial loading skeleton on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup search timer on unmount
  useEffect(() => {
    return () => {
      if (searchLoadingTimerRef.current) {
        clearTimeout(searchLoadingTimerRef.current);
      }
    };
  }, []);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      // key="" removes the param (= "show all"); any other value sets it
      Object.entries(updates).forEach(([k, v]) => { if (v) params.set(k, v); else params.delete(k); });
      startTransition(() => { router.replace(`${pathname}?${params.toString()}`, { scroll: false }); });
    },
    [searchParams, pathname, router]
  );

  // Keep search state in sync ONLY when URL changes from external navigation (e.g. back/forward, HomeSpace)
  useEffect(() => {
    const currentQ = searchParams.get("q") ?? "";
    if (currentQ !== lastSyncedQRef.current) {
      lastSyncedQRef.current = currentQ;
      setDebouncedSearch(currentQ);
      if (currentQ.trim()) {
        if (searchLoadingTimerRef.current) {
          clearTimeout(searchLoadingTimerRef.current);
        }
        setIsSearchLoading(true);
        searchLoadingTimerRef.current = setTimeout(() => {
          setIsSearchLoading(false);
        }, 1500);
      }
    }
  }, [searchParams]);

  const handleSearchCommit = useCallback((query: string) => {
    lastSyncedQRef.current = query;
    setDebouncedSearch(query);
    updateParams({ q: query });

    // Custom 1.5s loading on search
    if (searchLoadingTimerRef.current) {
      clearTimeout(searchLoadingTimerRef.current);
    }
    setIsSearchLoading(true);
    searchLoadingTimerRef.current = setTimeout(() => {
      setIsSearchLoading(false);
    }, 1500);
  }, [updateParams]);

  const handleClearSearch = useCallback(() => {
    if (searchLoadingTimerRef.current) {
      clearTimeout(searchLoadingTimerRef.current);
    }
    setIsSearchLoading(false);
    lastSyncedQRef.current = "";
    setDebouncedSearch("");
    updateParams({ q: "" });
  }, [updateParams]);

  const handleClearAllFilters = useCallback(() => {
    lastSyncedQRef.current = "";
    setDebouncedSearch("");
    updateParams({
      locality: "",
      config: "",
      developer: "",
      budget: "",
      status: "",
      type: "",
      q: "",
      mode: "buy",
    });
  }, [updateParams]);

  const appliedFilters: { key: string; category: string; label: string; onRemove: () => void }[] = [];
  if (debouncedSearch.trim()) {
    appliedFilters.push({
      key: "search",
      category: "Search",
      label: `"${debouncedSearch.trim()}"`,
      onRemove: handleClearSearch,
    });
  }
  if (mode === "rent") {
    appliedFilters.push({
      key: "mode",
      category: "Mode",
      label: "Rent",
      onRemove: () => updateParams({ mode: "buy" }),
    });
  }
  if (type) {
    appliedFilters.push({
      key: "type",
      category: "Type",
      label: type === "plot" ? "Plots & Land" : type === "house" ? "Houses & Villas" : type.charAt(0).toUpperCase() + type.slice(1),
      onRemove: () => updateParams({ type: "" }),
    });
  }

  selectedLocalities.forEach((locKey) => {
    appliedFilters.push({
      key: `loc-${locKey}`,
      category: "Locality",
      label: getLabel(LOCALITIES, locKey),
      onRemove: () => updateParams({ locality: toggleMultiKey(selectedLocalities, locKey) }),
    });
  });

  selectedConfigs.forEach((cfgKey) => {
    appliedFilters.push({
      key: `cfg-${cfgKey}`,
      category: "Config",
      label: getLabel(CONFIGURATIONS, cfgKey),
      onRemove: () => updateParams({ config: toggleMultiKey(selectedConfigs, cfgKey) }),
    });
  });

  selectedDevelopers.forEach((devKey) => {
    appliedFilters.push({
      key: `dev-${devKey}`,
      category: "Developer",
      label: getLabel(DEVELOPERS, devKey),
      onRemove: () => updateParams({ developer: toggleMultiKey(selectedDevelopers, devKey) }),
    });
  });

  selectedBudgets.forEach((bKey) => {
    appliedFilters.push({
      key: `bud-${bKey}`,
      category: "Budget",
      label: getLabel(BUDGET_OPTIONS, bKey),
      onRemove: () => updateParams({ budget: toggleMultiKey(selectedBudgets, bKey) }),
    });
  });

  selectedStatuses.forEach((stKey) => {
    appliedFilters.push({
      key: `st-${stKey}`,
      category: "Status",
      label: getLabel(STATUS_OPTIONS, stKey),
      onRemove: () => updateParams({ status: toggleMultiKey(selectedStatuses, stKey) }),
    });
  });

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
  const activeFilterCount =
    selectedLocalities.length +
    selectedConfigs.length +
    selectedDevelopers.length +
    selectedBudgets.length +
    selectedStatuses.length;

  const hasSearch = Boolean(debouncedSearch.trim());

  // Search from ALL records matching current mode when searching, not just existing filtered results
  const filtered = useMemo(() => {
    return ALL_PROPERTIES.filter((p) => {
      const propMode = p.mode?.toLowerCase() || "buy";
      if (propMode !== mode) return false;

      if (hasSearch) {
        return matchesSearch(p, debouncedSearch, mode);
      }
      if (selectedLocalities.length > 0 && !selectedLocalities.includes(p.locality_key)) return false;
      if (selectedConfigs.length > 0 && !matchMultiConfig(p.config_keys, selectedConfigs)) return false;
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(p.status_key)) return false;
      if (selectedDevelopers.length > 0 && !selectedDevelopers.includes(p.developer_key)) return false;
      if (selectedBudgets.length > 0 && !matchMultiBudget(p, selectedBudgets)) return false;
      if (type && p.type !== type && p.propertyType !== type) return false;
      return true;
    }).sort((a, b) => {
      if (sort === "Price: Low to High") {
        return parsePropertyPrice(a) - parsePropertyPrice(b);
      }
      if (sort === "Price: High to Low") {
        return parsePropertyPrice(b) - parsePropertyPrice(a);
      }
      if (sort === "Newest First") {
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      }
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const aStarts = (a.name || "").toLowerCase().startsWith(q) || (a.projectName || "").toLowerCase().startsWith(q);
        const bStarts = (b.name || "").toLowerCase().startsWith(q) || (b.projectName || "").toLowerCase().startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
      }
      return 0;
    });
  }, [
    hasSearch,
    debouncedSearch,
    mode,
    selectedLocalities,
    selectedConfigs,
    selectedStatuses,
    selectedDevelopers,
    selectedBudgets,
    sort,
    type,
  ]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap');

        .lp-root { font-family: 'Inter', sans-serif; background: #f3f4f6; min-height: 100vh; color: #1a1a2e; }
        .lp-root * { box-sizing: border-box; }

        /* HERO */
        .lp-hero { background: #0a0e1e; position: relative; overflow: hidden; padding: 100px 0 0; }
        .lp-hero-bg { position: absolute; inset: 0; background-image: url('/images/heroBg.png'); background-size: cover; background-position: center top; opacity: 0.18; }
        .lp-hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgb(90 122 250 / 0%) 0%, rgb(20 28 47 / 82%) 55%, rgba(0, 0, 0, 0.55) 100%); }
        .lp-hero-inner { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; padding: 0 32px 44px; text-align: center; }
        .lp-hero-eyebrow { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 22px; }
        .lp-hero-eyebrow-line { width: 52px; height: 1px; background: linear-gradient(90deg, transparent, #c8a84b); }
        .lp-hero-eyebrow-line:last-child { background: linear-gradient(90deg, #c8a84b, transparent); }
        .lp-hero-eyebrow-text { font-size: 10.5px; font-weight: 700; letter-spacing: 3.5px; color: #c8a84b; text-transform: uppercase; }
        .lp-hero-h1 { font-size: clamp(30px, 4.2vw, 54px); font-weight: 800; color: #fff; line-height: 1.08; margin: 0 0 18px; letter-spacing: -1px; }
        .lp-hero-h1 em { font-family: 'Playfair Display', serif; font-style: italic; color: #c8a84b; }
        .lp-hero-sub { color: rgba(255,255,255,0.65); font-size: 15px; line-height: 1.7; max-width: 500px; margin: 0 auto 0px; }
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
        .lp-search-field { position: relative; flex: 1; min-width: 220px; display: flex; align-items: center; gap: 8px; background: #f8f9fb; border: 1.5px solid #eaecf0; border-radius: 10px; height: 48px; padding: 0 10px 0 14px; font-size: 13px; color: #555; transition: border-color .15s, background .15s; }
        .lp-search-field:focus-within { border-color: #c8a84b; }
        .lp-search-field.is-listening { border-color: #ef4444; background: #fffbfb; }
        .lp-search-field input { flex: 1; border: 0; background: transparent; outline: none; font: inherit; color: #222; min-width: 100px; }
        .lp-search-field svg.lp-search-icon { width: 16px; height: 16px; color: #aaa; flex-shrink: 0; }
        @keyframes lp-spin {
          to { transform: rotate(360deg); }
        }
        .lp-search-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid #eaecf0;
          border-top-color: #c8a84b;
          border-radius: 50%;
          animation: lp-spin 0.6s linear infinite;
          flex-shrink: 0;
        }
        .lp-search-clear {
          border: none;
          background: transparent;
          color: #999;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color .15s;
          padding: 4px;
        }
        .lp-search-clear:hover {
          color: #1a1a2e;
        }

        /* VOICE SEARCH MIC & ANIMATIONS */
        .lp-search-mic {
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .18s, color .18s, transform .12s;
          flex-shrink: 0;
          padding: 0;
        }
        .lp-search-mic:hover {
          background: #eaecf0;
          color: #c8a84b;
        }
        .lp-search-mic.listening {
          background: #fee2e2;
          color: #ef4444;
        }
        .lp-search-mic.listening:hover {
          background: #fecaca;
          color: #dc2626;
        }
        .lp-search-mic svg {
          width: 16px;
          height: 16px;
          position: relative;
          z-index: 2;
          color: inherit;
          flex-shrink: 0;
        }
        .lp-search-mic:active svg {
          transform: scale(0.92);
        }

        @keyframes lp-pulse-ring {
          0% { transform: scale(0.85); opacity: 0.9; }
          60% { transform: scale(1.45); opacity: 0.25; }
          100% { transform: scale(1.85); opacity: 0; }
        }
        .lp-mic-pulse-ring {
          position: absolute;
          inset: -2px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.45);
          animation: lp-pulse-ring 1.4s cubic-bezier(0.24, 0, 0.38, 1) infinite;
          z-index: 1;
          pointer-events: none;
        }

        /* Real-time wave bars while listening */
        .lp-voice-wave-indicator {
          display: flex;
          align-items: center;
          gap: 2.5px;
          height: 18px;
          flex-shrink: 0;
          padding: 0 4px;
        }
        @keyframes lp-voice-wave {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .lp-wave-line {
          width: 2.5px;
          height: 6px;
          background: #ef4444;
          border-radius: 2px;
          animation: lp-voice-wave 0.8s ease-in-out infinite;
        }

        /* Voice error & status toast */
        .lp-voice-toast {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          z-index: 100;
          background: #0f172a;
          color: #f8fafc;
          font-size: 12px;
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.22);
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          white-space: nowrap;
          animation: lp-shimmer 0.2s ease-out;
        }
        .lp-voice-toast button {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 11px;
          padding: 2px 4px;
        }
        .lp-voice-toast button:hover {
          color: #fff;
        }

        /* MOBILE TOP-OF-LIST SEARCH BAR (hidden on desktop) */
        .lp-mob-search-bar {
          display: none;
        }

        /* SKELETON SHIMMER & STYLES */
        @keyframes lp-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .lp-skel-shimmer {
          background: linear-gradient(
            90deg,
            #eef1f6 0%,
            #f6f8fb 25%,
            #e2e7f0 50%,
            #f6f8fb 75%,
            #eef1f6 100%
          );
          background-size: 200% 100%;
          animation: lp-shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .lp-card--skeleton {
          pointer-events: none;
          user-select: none;
          border: 1px solid #eaecf0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
        }
        .lp-card--skeleton:hover {
          transform: none;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
        }
        .lp-skel-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .lp-skel-heart {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.7);
          z-index: 3;
        }
        .lp-skel-line {
          border-radius: 5px;
          display: block;
        }
        .lp-skel-line--xs { height: 9px; }
        .lp-skel-line--sm { height: 12px; }
        .lp-skel-line--md { height: 16px; }
        .lp-skel-line--lg { height: 22px; }
        .lp-skel-badge {
          border-radius: 6px;
          display: inline-block;
        }
        .lp-searching-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #b8963c;
          background: #fdf8ec;
          border: 1px solid #ebd9a2;
          border-radius: 20px;
          padding: 4px 14px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(200,168,75,0.12);
        }
        .lp-filter-group { display: flex; flex-direction: column; gap: 4px; }
        .lp-filter-label { font-size: 9.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #aaa; padding-left: 2px; }
        .lp-select-wrap { position: relative; }
        .lp-select { appearance: none; -webkit-appearance: none; background: #f8f9fb; border: 1.5px solid #eaecf0; border-radius: 10px; height: 48px; padding: 0 36px 0 14px; font: 500 13px 'Inter'; color: #222; cursor: pointer; width: 100%; outline: none; transition: border-color .15s; }
        .lp-select-wrap .lp-chevron { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: #aaa; pointer-events: none; }

        /* CUSTOM LUXURY MULTI-SELECT DROPDOWN */
        .lp-custom-dropdown {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 140px;
        }
        .lp-dropdown-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          background: #f8f9fb;
          border: 1.5px solid #eaecf0;
          border-radius: 10px;
          height: 48px;
          padding: 0 12px;
          font: 500 13px 'Inter', sans-serif;
          color: #222;
          cursor: pointer;
          width: 100%;
          outline: none;
          transition: border-color .15s, background .15s, box-shadow .15s;
          user-select: none;
        }
        .lp-dropdown-btn:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }
        .lp-dropdown-btn.open,
        .lp-dropdown-btn.has-value {
          border-color: #c8a84b;
          background: #fdfbf7;
        }
        .lp-dropdown-btn.open {
          box-shadow: 0 0 0 3px rgba(200, 168, 75, 0.15);
        }
        .lp-dropdown-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 110px;
          text-align: left;
        }
        .lp-dropdown-right {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          margin-left: auto;
        }
        .lp-dropdown-badge {
          background: #c8a84b;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 999px;
          padding: 1px 6px;
          line-height: 1.3;
        }
        .lp-dropdown-chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          color: #94a3b8;
          transform-origin: center center;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease;
          flex-shrink: 0;
        }
        .lp-dropdown-chevron svg {
          width: 12px;
          height: 12px;
          display: block;
        }
        .lp-dropdown-btn.open .lp-dropdown-chevron {
          transform: rotate(180deg);
          color: #c8a84b;
        }

        /* Dropdown Popup Menu */
        .lp-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          min-width: 220px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14), 0 2px 8px rgba(15, 23, 42, 0.05);
          z-index: 150;
          overflow: hidden;
          animation: lpMenuIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes lpMenuIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .lp-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 14px;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
        }
        .lp-dropdown-clear-link {
          background: none;
          border: none;
          color: #b8963c;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }
        .lp-dropdown-clear-link:hover {
          text-decoration: underline;
        }
        .lp-dropdown-list {
          max-height: 250px;
          overflow-y: auto;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .lp-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 8px;
          border: 0;
          background: transparent;
          width: 100%;
          font: 500 13px 'Inter', sans-serif;
          color: #334155;
          cursor: pointer;
          text-align: left;
          transition: background .12s, color .12s;
          user-select: none;
        }
        .lp-dropdown-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .lp-dropdown-item.selected {
          background: #fdf8ec;
          color: #1e293b;
          font-weight: 600;
        }
        .lp-dropdown-check {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid #cbd5e1;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          background: #fff;
          transition: all .15s;
        }
        .lp-dropdown-item.selected .lp-dropdown-check {
          background: #c8a84b;
          border-color: #c8a84b;
        }
        .lp-dropdown-check svg {
          width: 11px;
          height: 11px;
          color: #fff;
        }
        .lp-apply-btn { height: 48px; padding: 0 28px; background: #c8a84b; color: #fff; border: 0; border-radius: 10px; font: 700 13.5px 'Inter'; cursor: pointer; display: flex; align-items: center; gap: 8px; white-space: nowrap; transition: background .15s, transform .1s, box-shadow .15s; flex-shrink: 0; box-shadow: 0 4px 14px rgba(200,168,75,0.35); }
        .lp-apply-btn:hover { background: #b8963c; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,168,75,0.45); }
        .lp-apply-btn:active { transform: translateY(0); }

        /* BUY / RENT TOGGLE */
        .lp-mode-toggle { display: inline-flex; border: 1.5px solid #eaecf0; border-radius: 10px; overflow: hidden; background: #f8f9fb; height: 48px; align-self: flex-end; }
        .lp-mode-btn { padding: 0 24px; font: 600 13px 'Inter'; border: 0; background: transparent; cursor: pointer; color: #888; transition: background .15s, color .15s; }
        .lp-mode-btn.active { background: #0d1b2a; color: #fff; }

        /* APPLIED FILTER CHIPS */
        .lp-applied-bar {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 14px;
          margin-top: 6px;
          border-top: 1px solid #f0f2f5;
        }
        .lp-applied-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #94a3b8;
          white-space: nowrap;
        }
        .lp-applied-chips {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .lp-applied-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 6px 4px 12px;
          border-radius: 999px;
          background: #fdf8ec;
          border: 1px solid #ebd9a2;
          color: #927228;
          font: 600 12.5px 'Inter', sans-serif;
          transition: background .15s, border-color .15s;
        }
        .lp-applied-chip:hover {
          background: #faf0d7;
          border-color: #c8a84b;
        }
        .lp-applied-chip-cat {
          font-weight: 500;
          color: #a88a45;
          font-size: 11.5px;
        }
        .lp-applied-chip-text {
          line-height: 1;
        }
        .lp-applied-chip-x {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(200, 168, 75, 0.2);
          border: 0;
          color: #927228;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          display: grid;
          place-items: center;
          line-height: 1;
          padding: 0;
          transition: background .15s, color .15s;
        }
        .lp-applied-chip-x:hover {
          background: #c8a84b;
          color: #fff;
        }
        .lp-applied-clear-all {
          border: 0;
          background: transparent;
          color: #ef4444;
          font: 600 12px 'Inter', sans-serif;
          cursor: pointer;
          padding: 4px 6px;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color .15s;
        }
        .lp-applied-clear-all:hover {
          color: #dc2626;
        }
        .lp-mob-applied-row {
          display: none;
          width: 100%;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e2e8f0;
        }
        @media (max-width: 720px) {
          .lp-mob-applied-row {
            display: flex;
          }
        }

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
        .lp-card-overlay { position: absolute; inset: 0; z-index: 2; display: flex; align-items: stretch; padding: 14px; background: linear-gradient(to right, rgb(175 175 175 / 75%) 0%, rgb(231 231 231 / 40%) 45%, transparent 70%); }
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
          .lp-hero { padding-top: 86px; }
          .lp-grid { grid-template-columns: 1fr; }
          .lp-hero-inner, .lp-results-header, .lp-grid-wrap { padding-left: 16px; padding-right: 16px; }
          .lp-filter-bar-wrap { display: none; }
          .lp-trust-divider { display: none; }
          .lp-trust-item { padding: 0 14px; }
          .lp-trust-row { gap: 8px 0; }
          .lp-grid-wrap { margin-bottom: 100px; }

          /* Mobile Search Bar at Top of List */
          .lp-mob-search-bar {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin: 14px 16px 4px;
            padding: 14px 14px 12px;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02);
            border: 1.5px solid #eaecf0;
          }
          .lp-mob-search-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }
          .lp-mob-mode-toggle {
            display: inline-flex;
            background: #f1f4f9;
            padding: 3px;
            border-radius: 9px;
            gap: 2px;
          }
          .lp-mob-mode-btn {
            padding: 6px 18px;
            font: 600 12.5px 'Inter', sans-serif;
            border: none;
            border-radius: 7px;
            background: transparent;
            color: #64748b;
            cursor: pointer;
            transition: all .15s ease;
          }
          .lp-mob-mode-btn.active {
            background: #0d1b2a;
            color: #ffffff;
            box-shadow: 0 2px 6px rgba(13, 27, 42, 0.2);
          }
          .lp-mob-search-count {
            font-size: 11.5px;
            font-weight: 600;
            color: #64748b;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 4px 10px;
            border-radius: 20px;
            white-space: nowrap;
          }
          .lp-mob-search-count strong {
            color: #c8a84b;
            font-weight: 700;
          }
          .lp-mob-search-bar .lp-search-field {
            width: 100%;
            min-width: 0;
            height: 46px;
            background: #f8f9fb;
            border-color: #eaecf0;
          }
          .lp-mob-search-bar .lp-search-field input {
            font-size: 15px;
          }
          .lp-results-header {
            margin: 12px auto 10px;
          }

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
            {/* <div className="lp-hero-eyebrow" aria-hidden="true">
              <div className="lp-hero-eyebrow-line" />
              <span className="lp-hero-eyebrow-text">The Propertist</span>
              <div className="lp-hero-eyebrow-line" />
            </div> */}
            <h1 className="lp-hero-h1">
              Verified ₹2 Crore+ Homes <em>in Mumbai</em>
            </h1>
            <p className="lp-hero-sub">
              Handpicked properties from Kalpataru, Godrej, Lodha, Oberoi &amp; more.<br />
              Zero brokerage for buyers.
            </p>
            {/* <div className="lp-trust-row" role="list">
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
            </div> */}
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

            <SearchField
              value={debouncedSearch}
              onSearch={handleSearchCommit}
              onClear={handleClearSearch}
              isLoading={isSearchLoading}
            />

            {/* Desktop custom luxury multi-select dropdowns */}
            <MultiSelectFilter
              id="lp-locality"
              label="Locality"
              options={LOCALITIES}
              selectedKeys={selectedLocalities}
              isOpen={openDropdown === "locality"}
              onToggleOpen={() => setOpenDropdown((prev) => (prev === "locality" ? null : "locality"))}
              onToggleKey={(key) => updateParams({ locality: toggleMultiKey(selectedLocalities, key) })}
              onClear={() => updateParams({ locality: "" })}
            />
            <MultiSelectFilter
              id="lp-config"
              label="Configuration"
              options={CONFIGURATIONS}
              selectedKeys={selectedConfigs}
              isOpen={openDropdown === "config"}
              onToggleOpen={() => setOpenDropdown((prev) => (prev === "config" ? null : "config"))}
              onToggleKey={(key) => updateParams({ config: toggleMultiKey(selectedConfigs, key) })}
              onClear={() => updateParams({ config: "" })}
            />
            <MultiSelectFilter
              id="lp-developer"
              label="Developer"
              options={DEVELOPERS}
              selectedKeys={selectedDevelopers}
              isOpen={openDropdown === "developer"}
              onToggleOpen={() => setOpenDropdown((prev) => (prev === "developer" ? null : "developer"))}
              onToggleKey={(key) => updateParams({ developer: toggleMultiKey(selectedDevelopers, key) })}
              onClear={() => updateParams({ developer: "" })}
            />
            <MultiSelectFilter
              id="lp-budget"
              label="Budget"
              options={BUDGET_OPTIONS}
              selectedKeys={selectedBudgets}
              isOpen={openDropdown === "budget"}
              onToggleOpen={() => setOpenDropdown((prev) => (prev === "budget" ? null : "budget"))}
              onToggleKey={(key) => updateParams({ budget: toggleMultiKey(selectedBudgets, key) })}
              onClear={() => updateParams({ budget: "" })}
            />
            <MultiSelectFilter
              id="lp-status"
              label="Status"
              options={STATUS_OPTIONS}
              selectedKeys={selectedStatuses}
              isOpen={openDropdown === "status"}
              onToggleOpen={() => setOpenDropdown((prev) => (prev === "status" ? null : "status"))}
              onToggleKey={(key) => updateParams({ status: toggleMultiKey(selectedStatuses, key) })}
              onClear={() => updateParams({ status: "" })}
            />

            {/* Applied filter chips */}
            {appliedFilters.length > 0 && (
              <div className="lp-applied-bar">
                <span className="lp-applied-title">Applied Filters:</span>
                <div className="lp-applied-chips">
                  {appliedFilters.map((f) => (
                    <span key={f.key} className="lp-applied-chip">
                      <span className="lp-applied-chip-cat">{f.category}:</span>
                      <span className="lp-applied-chip-text">{f.label}</span>
                      <button
                        type="button"
                        className="lp-applied-chip-x"
                        onClick={f.onRemove}
                        aria-label={`Remove filter ${f.label}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {appliedFilters.length > 1 && (
                    <button
                      type="button"
                      className="lp-applied-clear-all"
                      onClick={handleClearAllFilters}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── MOBILE TOP SEARCH BAR (At Top of List) ────── */}
        <div className="lp-mob-search-bar" role="search" aria-label="Mobile property search">
          <div className="lp-mob-search-top">
            <div className="lp-mob-mode-toggle" role="group" aria-label="Listing mode">
              {(["buy", "rent"] as const).map((m) => (
                <button
                  key={m}
                  id={`mob-mode-${m}`}
                  className={`lp-mob-mode-btn${mode === m ? " active" : ""}`}
                  onClick={() => updateParams({ mode: m })}
                >
                  {m === "buy" ? "Buy" : "Rent"}
                </button>
              ))}
            </div>
            <div className="lp-mob-search-count">
              <strong>{filtered.length}</strong> {filtered.length === 1 ? "Property" : "Properties"}
            </div>
          </div>
          <SearchField
            id="lp-mob-search"
            value={debouncedSearch}
            onSearch={handleSearchCommit}
            onClear={handleClearSearch}
            isLoading={isSearchLoading}
            placeholder={mode === "rent" ? "Search rent homes, localities..." : "Search properties, localities..."}
          />
        </div>

        {/* ── RESULTS HEADER ─────────────────────── */}
        <div className="lp-results-header">
          <p className="lp-count">
            {isInitialLoading || isSearchLoading ? (
              <span className="lp-searching-pill">
                <span className="lp-search-spinner" style={{ width: 13, height: 13 }} />
                {isSearchLoading ? (
                  <span>
                    Searching Mumbai properties for &ldquo;<strong>{debouncedSearch || "all records"}</strong>&rdquo;...
                  </span>
                ) : (
                  <span>Loading verified properties...</span>
                )}
              </span>
            ) : (
              <>
                <strong>{filtered.length}</strong> {filtered.length === 1 ? "property" : "properties"} found
                {debouncedSearch && (
                  <span style={{ color: "#475569" }}>
                    {" "}for &ldquo;<strong>{debouncedSearch}</strong>&rdquo;
                    <span style={{ marginLeft: 8, fontSize: 11, background: "#fdf8ec", color: "#b8963c", border: "1px solid #ebd9a2", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
                      All Records
                    </span>
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      style={{
                        marginLeft: 8,
                        background: "none",
                        border: "none",
                        color: "#999",
                        fontSize: 12,
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  </span>
                )}
              </>
            )}
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

          {/* Mobile applied filter chips */}
          {appliedFilters.length > 0 && (
            <div className="lp-mob-applied-row">
              <span className="lp-applied-title">Applied:</span>
              <div className="lp-applied-chips">
                {appliedFilters.map((f) => (
                  <span key={f.key} className="lp-applied-chip">
                    <span className="lp-applied-chip-cat">{f.category}:</span>
                    <span className="lp-applied-chip-text">{f.label}</span>
                    <button
                      type="button"
                      className="lp-applied-chip-x"
                      onClick={f.onRemove}
                      aria-label={`Remove filter ${f.label}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {appliedFilters.length > 1 && (
                  <button
                    type="button"
                    className="lp-applied-clear-all"
                    onClick={handleClearAllFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── PROPERTY GRID ──────────────────────── */}
        <main className="lp-grid-wrap">
          <div className={`lp-grid${view === "list" ? " lp-grid--list" : ""}`}>
            {isInitialLoading || isSearchLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={`skeleton-${i}`} view={view} />
              ))
            ) : filtered.length === 0 ? (
              <div className="lp-empty">
                <div className="lp-empty-icon">{debouncedSearch ? "🔍" : "🏡"}</div>
                {/* <h3>{debouncedSearch ? `No properties found for "${debouncedSearch}"` : "No properties found"}</h3> */}
                <p>
                  {debouncedSearch
                    ? "We searched across all records, localities, and developers in Mumbai. Try checking for typos or searching with broader keywords like 'Bandra', '3 BHK', or 'Godrej'."
                    : "Try adjusting your filters or switch between Buy / Rent."}
                </p>
                {debouncedSearch && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    style={{
                      marginTop: 16,
                      padding: "9px 20px",
                      borderRadius: 8,
                      border: "none",
                      background: "#c8a84b",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(200,168,75,0.3)",
                    }}
                  >
                    Clear Search &amp; View All
                  </button>
                )}
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

              {/* FILTER PANEL — each chip toggles its own key in the multi-select array */}
              {drawer === "filter" && (
                <div>
                  <div className="lp-drawer-group">
                    <div className="lp-drawer-group-label">Locality</div>
                    <div className="lp-drawer-chips">
                      {LOCALITIES.filter((l) => l.key !== "").map((loc) => {
                        const isSel = selectedLocalities.includes(loc.key);
                        return (
                          <button
                            key={loc.key}
                            className={`lp-drawer-chip${isSel ? " selected" : ""}`}
                            onClick={() => updateParams({ locality: toggleMultiKey(selectedLocalities, loc.key) })}
                          >
                            {isSel && <span style={{ marginRight: 4, fontWeight: 700 }}>✓</span>}
                            {loc.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="lp-drawer-group">
                    <div className="lp-drawer-group-label">Configuration</div>
                    <div className="lp-drawer-chips">
                      {CONFIGURATIONS.filter((c) => c.key !== "").map((cfg) => {
                        const isSel = selectedConfigs.includes(cfg.key);
                        return (
                          <button
                            key={cfg.key}
                            className={`lp-drawer-chip${isSel ? " selected" : ""}`}
                            onClick={() => updateParams({ config: toggleMultiKey(selectedConfigs, cfg.key) })}
                          >
                            {isSel && <span style={{ marginRight: 4, fontWeight: 700 }}>✓</span>}
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="lp-drawer-group">
                    <div className="lp-drawer-group-label">Developer</div>
                    <div className="lp-drawer-chips">
                      {DEVELOPERS.filter((d) => d.key !== "").map((dev) => {
                        const isSel = selectedDevelopers.includes(dev.key);
                        return (
                          <button
                            key={dev.key}
                            className={`lp-drawer-chip${isSel ? " selected" : ""}`}
                            onClick={() => updateParams({ developer: toggleMultiKey(selectedDevelopers, dev.key) })}
                          >
                            {isSel && <span style={{ marginRight: 4, fontWeight: 700 }}>✓</span>}
                            {dev.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="lp-drawer-group">
                    <div className="lp-drawer-group-label">Budget</div>
                    <div className="lp-drawer-chips">
                      {BUDGET_OPTIONS.filter((b) => b.key !== "").map((b) => {
                        const isSel = selectedBudgets.includes(b.key);
                        return (
                          <button
                            key={b.key}
                            className={`lp-drawer-chip${isSel ? " selected" : ""}`}
                            onClick={() => updateParams({ budget: toggleMultiKey(selectedBudgets, b.key) })}
                          >
                            {isSel && <span style={{ marginRight: 4, fontWeight: 700 }}>✓</span>}
                            {b.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="lp-drawer-group">
                    <div className="lp-drawer-group-label">Status</div>
                    <div className="lp-drawer-chips">
                      {STATUS_OPTIONS.filter((s) => s.key !== "").map((st) => {
                        const isSel = selectedStatuses.includes(st.key);
                        return (
                          <button
                            key={st.key}
                            className={`lp-drawer-chip${isSel ? " selected" : ""}`}
                            onClick={() => updateParams({ status: toggleMultiKey(selectedStatuses, st.key) })}
                          >
                            {isSel && <span style={{ marginRight: 4, fontWeight: 700 }}>✓</span>}
                            {st.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {drawer === "filter" && (
              <div className="lp-drawer-foot">
                {/* Reset: clears all filter and search params from URL */}
                <button className="lp-drawer-reset" onClick={() => {
                  // setSearch("");
                  updateParams({ locality: "", config: "", status: "", developer: "", budget: "", q: "" });
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
