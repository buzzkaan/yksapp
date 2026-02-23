"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { SINAV_META } from "@/lib/sinav-data";
import { getSinavTipi } from "@/lib/utils/sinav";
import { hesaplaGunler } from "@/lib/utils/date";
import { SINAV_TARIHLERI, aciliyetRengi, mesaj } from "@/lib/config/sinav-tarihleri";
import type { SinavTipi } from "@/lib/sinav-data";

const CORNER_POSITIONS = [
  "absolute top-[-2px] left-[-2px]",
  "absolute top-[-2px] right-[-2px]",
  "absolute bottom-[-2px] left-[-2px]",
  "absolute bottom-[-2px] right-[-2px]",
];

export function SinavGeriSayim() {
  const [sinav, setSinav] = useState<SinavTipi>("YKS");

  useEffect(() => {
    setSinav(getSinavTipi());
  }, []);

  const gunler = hesaplaGunler(SINAV_TARIHLERI[sinav].tarih);

  const meta = SINAV_META[sinav];
  const tarihBilgi = SINAV_TARIHLERI[sinav];
  const renk = aciliyetRengi(gunler);
  const bitti = gunler <= 0;

  return (
    <div
      className="relative border-4 border-[#101010] overflow-hidden"
      style={{
        background: "#181828",
        boxShadow: "4px 4px 0 0 #101010",
      }}
    >
      {CORNER_POSITIONS.map((pos) => (
        <div
          key={pos}
          className={`${pos} w-[10px] h-[10px] border-2 border-[#101010] z-10`}
          style={{ background: meta.renk }}
        />
      ))}

      {/* Top strip */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-[#2A2A48]">
        <div className="flex items-center gap-2">
          <Image src={meta.icon} alt={meta.isim} width={20} height={20} className="w-5 h-5" />
          <span
            className="font-[family-name:var(--font-pixel)] text-[10px] leading-tight tracking-wider"
            style={{ color: meta.renk }}
          >
            {meta.isim} 2026
          </span>
        </div>
        <span
          className="font-[family-name:var(--font-body)] text-sm border border-[#2A2A48] px-2 py-0.5"
          style={{ color: "#585868" }}
        >
          yaklaşık tarih
        </span>
      </div>

      {/* Main counter */}
      <div className="flex items-center justify-between px-4 py-4 gap-4">
        <div className="flex flex-col items-center flex-shrink-0">
          <span
            className="font-[family-name:var(--font-pixel)] leading-none tabular-nums"
            style={{
              fontSize: bitti ? "28px" : gunler >= 100 ? "36px" : "44px",
              color: renk,
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
              <Image src="/icon/calendar.png" alt="tarih" width={14} height={14} className="inline w-3.5 h-3.5 mr-1" />
              {tarihBilgi.etiket}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom urgency bar */}
      {!bitti && (
        <div className="border-t-2 border-[#2A2A48]">
          <div
            className="h-1.5 transition-all duration-1000"
            style={{
              background: `linear-gradient(to right, ${renk}, ${renk}80)`,
              width: `${Math.min(100, Math.max(2, ((365 - gunler) / 365) * 100))}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
