"use client";
import { useCallback, useSyncExternalStore } from "react";
import { LS_SINAV_KEY, type SinavTipi } from "@/lib/sinav-data";

const VALID_SINAV: SinavTipi[] = ["YKS", "DGS", "KPSS"];
const DEFAULT_SINAV: SinavTipi = "YKS";

function subscribe(callback: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === LS_SINAV_KEY || e.key === null) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getSnapshot(): SinavTipi {
  const stored = localStorage.getItem(LS_SINAV_KEY) as SinavTipi | null;
  return stored && VALID_SINAV.includes(stored) ? stored : DEFAULT_SINAV;
}

function getServerSnapshot(): SinavTipi {
  return DEFAULT_SINAV;
}

/**
 * Reactive hook for the current exam type (YKS/DGS/KPSS).
 *
 * Uses `useSyncExternalStore` so it's SSR-safe and updates across every
 * consumer in the app as soon as `setSinavTipi()` is called.
 */
export function useSinavTipi(): [SinavTipi, (value: SinavTipi) => void] {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback((newValue: SinavTipi) => {
    localStorage.setItem(LS_SINAV_KEY, newValue);
    // Notify same-tab subscribers (native `storage` event only fires cross-tab).
    window.dispatchEvent(new StorageEvent("storage", { key: LS_SINAV_KEY }));
  }, []);

  return [value, setValue];
}
