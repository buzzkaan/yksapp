"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Client-only localStorage subscription hook built on `useSyncExternalStore`.
 *
 * - SSR-safe: returns `defaultValue` on the server.
 * - No `setState in effect`: React reconciles the snapshot mismatch between
 *   `getServerSnapshot` and `getSnapshot` during hydration internally.
 * - Reactive across components that share the same key: writes through the
 *   returned setter dispatch a synthetic `storage` event so subscribers refresh.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const subscribe = useCallback(
    (callback: () => void) => {
      const handler = (e: StorageEvent) => {
        if (e.key === key || e.key === null) callback();
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    [key],
  );

  const getSnapshot = useCallback(() => localStorage.getItem(key), [key]);
  const getServerSnapshot = useCallback(() => null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<T>(() => {
    if (raw === null) return defaultValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // legacy: key stored as plain string
      return raw as unknown as T;
    }
  }, [raw, defaultValue]);

  const setValue = useCallback(
    (newValue: T) => {
      const serialized =
        typeof newValue === "string" ? newValue : JSON.stringify(newValue);
      localStorage.setItem(key, serialized);
      // Notify subscribers in this tab (native `storage` event only fires cross-tab).
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
    [key],
  );

  return [value, setValue];
}
