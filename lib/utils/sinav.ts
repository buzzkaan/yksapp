import { LS_SINAV_KEY, type SinavTipi } from "@/lib/sinav-data";

const VALID_SINAV: SinavTipi[] = ["YKS", "DGS", "KPSS"];

export function getSinavTipi(): SinavTipi {
  if (typeof window === "undefined") return "YKS";
  const stored = localStorage.getItem(LS_SINAV_KEY) as SinavTipi | null;
  return stored && VALID_SINAV.includes(stored) ? stored : "YKS";
}

export function setSinavTipi(v: SinavTipi): void {
  localStorage.setItem(LS_SINAV_KEY, v);
}
