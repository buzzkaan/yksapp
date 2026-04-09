import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function netHesapla(dogru: number, yanlis: number): number {
  return Math.round((dogru - yanlis / 4) * 100) / 100;
}

export function formatSure(dakika: number): string {
  if (dakika === 0) return "0dk";
  if (dakika < 60) return `${dakika}dk`;
  const h = Math.floor(dakika / 60);
  const m = dakika % 60;
  return m > 0 ? `${h}s ${m}dk` : `${h}s`;
}
