"use client";

import { useEffect, useState, useCallback } from "react";

export const WISHLIST_KEY = "propertist_wishlist";
export const WISHLIST_EVENT = "propertist_wishlist_updated";

/** Safe reader for localStorage wishlist IDs */
export function getStoredWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item));
    }
    return [];
  } catch {
    return [];
  }
}

/** Check if an ID exists in the wishlist */
export function isIdInWishlist(id: string | number): boolean {
  if (!id) return false;
  const strId = String(id);
  const current = getStoredWishlist();
  return current.includes(strId);
}

/** Toggle property ID in localStorage and notify all listeners */
export function toggleStoredWishlist(id: string | number): boolean {
  if (typeof window === "undefined" || !id) return false;
  const strId = String(id);
  const current = getStoredWishlist();
  const exists = current.includes(strId);
  const updated = exists ? current.filter((item) => item !== strId) : [...current, strId];

  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent(WISHLIST_EVENT, {
        detail: { updated, id: strId, added: !exists },
      })
    );
  } catch (err) {
    console.error("Failed to save wishlist in localStorage:", err);
  }

  return !exists;
}

/** React hook for full wishlist state */
export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const sync = useCallback(() => {
    setWishlist(getStoredWishlist());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    sync();

    const handleCustomUpdate = () => sync();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === WISHLIST_KEY) sync();
    };

    window.addEventListener(WISHLIST_EVENT, handleCustomUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(WISHLIST_EVENT, handleCustomUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [sync]);

  const toggle = useCallback((id: string | number) => {
    return toggleStoredWishlist(id);
  }, []);

  const has = useCallback(
    (id: string | number) => {
      return wishlist.includes(String(id));
    },
    [wishlist]
  );

  return {
    wishlist,
    count: wishlist.length,
    isLoaded,
    toggle,
    has,
  };
}

/** React hook for a single property item */
export function useWishlistItem(id: string | number) {
  const strId = String(id);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(isIdInWishlist(strId));

    const handleUpdate = () => {
      setIsLiked(isIdInWishlist(strId));
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === WISHLIST_KEY) {
        setIsLiked(isIdInWishlist(strId));
      }
    };

    window.addEventListener(WISHLIST_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(WISHLIST_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [strId]);

  const toggle = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      return toggleStoredWishlist(strId);
    },
    [strId]
  );

  return { isLiked, toggle };
}
