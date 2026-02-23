"use client";
import { useState, useEffect } from "react";
import { LS_SINAV_KEY, SINAV_META, type SinavTipi } from "@/lib/sinav-data";

// Yaklaşık sınav tarihleri (ÖSYM resmi duyurusuna göre değişebilir)
const SINAV_TARIHLERI: Record<SinavTipi, { tarih: Date; etiket: string }> = {
  YKS:  { tarih: new Date(2026, 5, 6),  etiket: "TYT · 6 Haziran 2026" },
  DGS:  { tarih: new Date(2026, 6, 26), etiket: "26 Temmuz 2026" },
  KPSS: { tarih: new Date(2026, 6, 5),  etiket: "GY/GK · 5 Temmuz 2026" },
};

function hesaplaGunler(hedef: Date): number {
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  return Math.ceil((hedef.getTime() - bugun.getTime()) / 86400000);
}

function aciliyetRengi(gun: number): string {
  if (gun <= 0)  return "#A0A8C0";
  if (gun <= 30) return "#D81818";
  if (gun <= 90) return "#F0D000";
  return "#7EC850";
}

function mesaj(gun: number): string {
  if (gun <= 0)   return "Sınav gününüz! Başarılar! 🎉";
  if (gun === 1)  return "Yarın sınav! Her şeyden hazırsın! 🔥";
  if (gun <= 7)   return "Son hafta! Her dakika değerli! 🔥";
  if (gun <= 30)  return "Son sprint! Kopmadan devam! ⚡";
  if (gun <= 60)  return "İki ay kaldı, odaklan! 💪";
  if (gun <= 90)  return "Üç ay var, ritmi koru! 🌱";
  if (gun <= 180) return "Altı ay var, temelleri sağlam at! 📖";
  return "Zaman var ama en iyi an şimdi başlamak! 🎯";
}

export function SinavGeriSayim() {
  const [sinav, setSinav]       = useState<SinavTipi>("YKS");
  const [gunler, setGunler]     = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LS_SINAV_KEY) as SinavTipi | null;
    const tip: SinavTipi =
      stored && ["YKS", "DGS", "KPSS"].includes(stored) ? stored : "YKS";
    setSinav(tip);
    setGunler(hesaplaGunler(SINAV_TARIHLERI[tip].tarih));
  }, []);

  if (gunler === null) return null; // SSR/hydration sırasında gösterme

  const meta     = SINAV_META[sinav];
  const tarihBilgi = SINAV_TARIHLERI[sinav];
  const renk     = aciliyetRengi(gunler);
  const bitti    = gunler <= 0;

  return (
    <div
      className="relative border-4 border-[#101010] overflow-hidden"
      style={{
        background:  "#181828",
        boxShadow:   "4px 4px 0 0 #101010",
      }}
    >
      {/* Köşe kareleri — sinav rengiyle */}
      {[
        "absolute top-[-2px] left-[-2px]",
        "absolute top-[-2px] right-[-2px]",
        "absolute bottom-[-2px] left-[-2px]",
        "absolute bottom-[-2px] right-[-2px]",
      ].map((pos, i) => (
        <div
          key={i}
          className={`${pos} w-[10px] h-[10px] border-2 border-[#101010] z-10`}
          style={{ background: meta.renk }}
        />
      ))}

      {/* Üst şerit — sınav adı */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b-2 border-[#2A2A48]"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{meta.icon}</span>
          <span
            className="font-[family-name:var(--font-pixel)] text-[10px] leading-tight tracking-wider"
            style={{ color: meta.renk }}
          >
            {meta.isim} 2026
          </span>
        </div>
        <span
          className="font-[family-name:var(--font-body)] text-sm border border-[#2A2A48] px-2 py-0.5"
          style={{ color: "#505068" }}
        >
          yaklaşık tarih
        </span>
      </div>

      {/* Ana sayac */}
      <div className="flex items-center justify-between px-4 py-4 gap-4">
        {/* Büyük sayı */}
        <div className="flex flex-col items-center flex-shrink-0">
          <span
            className="font-[family-name:var(--font-pixel)] leading-none tabular-nums"
            style={{
              fontSize:   bitti ? "28px" : gunler >= 100 ? "36px" : "44px",
              color:      renk,
              textShadow: `2px 2px 0 ${renk}40`,
            }}
          >
            {bitti ? "✓" : gunler}
          </span>
          {!bitti && (
            <span
              className="font-[family-name:var(--font-body)] text-base mt-1 tracking-widest"
              style={{ color: "#A0A8C0" }}
            >
              GÜN KALDI
            </span>
          )}
        </div>

        {/* Sağ taraf — mesaj + tarih */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <p
            className="font-[family-name:var(--font-body)] text-lg leading-snug"
            style={{ color: "#F8F8F8" }}
          >
            {mesaj(gunler)}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="font-[family-name:var(--font-body)] text-base border border-[#2A2A48] px-2 py-0.5 leading-tight"
              style={{ color: "#A0A8C0", background: "#101010" }}
            >
              📅 {tarihBilgi.etiket}
            </span>
          </div>
        </div>
      </div>

      {/* Alt şerit — urgency bar */}
      {!bitti && (
        <div className="border-t-2 border-[#2A2A48]">
          <div
            className="h-1.5 transition-all duration-1000"
            style={{
              background: `linear-gradient(to right, ${renk}, ${renk}80)`,
              // Kalan gün sayısına göre 0-365 aralığında
              width: `${Math.min(100, Math.max(2, ((365 - gunler) / 365) * 100))}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
