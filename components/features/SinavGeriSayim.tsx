"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { SINAV_META } from "@/lib/sinav-data";
import { getSinavTipi } from "@/lib/utils/sinav";
import { hesaplaGunler } from "@/lib/utils/date";
import { SINAV_TARIHLERI, aciliyetRengi, mesaj } from "@/lib/config/sinav-tarihleri";
import type { SinavTipi } from "@/lib/sinav-data";
import { ICONS } from "@/lib/constants/icons";

const CORNERS = [
  "top-[-2px] left-[-2px]",
  "top-[-2px] right-[-2px]",
  "bottom-[-2px] left-[-2px]",
  "bottom-[-2px] right-[-2px]",
] as const;

export function SinavGeriSayim() {
  const [sinav, setSinav] = useState<SinavTipi>("YKS");

  useEffect(() => {
    setSinav(getSinavTipi());
  }, []);

  const gunler    = hesaplaGunler(SINAV_TARIHLERI[sinav].tarih);
  const meta      = SINAV_META[sinav];
  const tarihBilgi = SINAV_TARIHLERI[sinav];
  const renk      = aciliyetRengi(gunler);
  const bitti     = gunler <= 0;
  const fontSize  = bitti ? "28px" : gunler >= 100 ? "36px" : "44px";

  return (
    <div className="relative border-4 border-black bg-mario-navy shadow-pixel overflow-hidden">
      {/* Corner dots in exam color */}
      {CORNERS.map((pos) => (
        <div
          key={pos}
          className={`absolute ${pos} w-[10px] h-[10px] border-2 border-black z-10`}
          style={{ background: meta.renk }}
        />
      ))}

      {/* Top strip */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-mario-navy-dark">
        <div className="flex items-center gap-2">
          <Image src={meta.icon} alt={meta.isim} width={20} height={20} className="w-5 h-5" />
          <span
            className="font-pixel text-[10px] leading-tight tracking-wider"
            style={{ color: meta.renk }}
          >
            {meta.isim} 2026
          </span>
        </div>
        <span className="font-body text-sm border border-mario-navy-dark px-2 py-0.5 text-mario-slate">
          yaklaşık tarih
        </span>
      </div>

      {/* Main counter */}
      <div className="flex items-center justify-between px-4 py-4 gap-4">
        <div className="flex flex-col items-center shrink-0">
          <span
            className="font-pixel leading-none tabular-nums"
            style={{ fontSize, color: renk, textShadow: `2px 2px 0 ${renk}40` }}
          >
            {bitti ? "✓" : gunler}
          </span>
          {!bitti && (
            <span className="font-body text-base mt-1 tracking-widest text-mario-light">
              GÜN KALDI
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <p className="font-body text-lg leading-snug text-white">
            {mesaj(gunler)}
          </p>
          <span className="font-body text-base border border-mario-navy-dark px-2 py-0.5 leading-tight text-mario-light bg-black inline-flex items-center gap-1 w-fit">
            <Image src={ICONS.calendar} alt="tarih" width={14} height={14} className="w-3.5 h-3.5" />
            {tarihBilgi.etiket}
          </span>
        </div>
      </div>

      {/* Bottom urgency bar */}
      {!bitti && (
        <div className="border-t-2 border-mario-navy-dark">
          <div
            className="h-1.5 transition-all duration-1000"
            style={{
              background: renk,
              width: `${Math.min(100, Math.max(2, ((365 - gunler) / 365) * 100))}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
