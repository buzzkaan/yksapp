import type { SinavTipi } from "@/lib/sinav-data";

export const SINAV_TARIHLERI: Record<SinavTipi, { tarih: Date; etiket: string }> = {
  YKS: { tarih: new Date(2026, 5, 6), etiket: "TYT · 6 Haziran 2026" },
  DGS: { tarih: new Date(2026, 6, 26), etiket: "26 Temmuz 2026" },
  KPSS: { tarih: new Date(2026, 6, 5), etiket: "GY/GK · 5 Temmuz 2026" },
};

// Returns Mario palette hex values for urgency indicators
export function aciliyetRengi(gun: number): string {
  if (gun <= 0)  return "#A8A8A8"; // mario-stone  (done)
  if (gun <= 30) return "#E40000"; // mario-red    (urgent)
  if (gun <= 90) return "#FFD000"; // mario-gold   (warning)
  return "#00A800";                // mario-green  (safe)
}

export function mesaj(gun: number): string {
  if (gun <= 0) return "Sınav gününüz! Başarılar! 🎉";
  if (gun === 1) return "Yarın sınav! Son boss! 🔥";
  if (gun <= 7) return "Son hafta! Final dungeon! 🔥";
  if (gun <= 30) return "Son sprint! Elite Four! ⚡";
  if (gun <= 60) return "İki ay kaldı, level up! 💪";
  if (gun <= 90) return "Üç ay var, XP kas! ⭐";
  if (gun <= 180) return "Altı ay var, build'ini yap! 📖";
  return "Zaman var, maceraya başla! 🎯";
}
