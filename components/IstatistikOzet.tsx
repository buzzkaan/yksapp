"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PixelCard } from "@/components/pixel/PixelCard";

type OzetIstatistik = {
  bugunGorev: { toplam: number; tamamlanan: number };
  haftaGorev: { toplam: number; tamamlanan: number };
  ayGorev: { toplam: number; tamamlanan: number };
  haftaPomodoro: number;
};

export function IstatistikOzet() {
  const [veri, setVeri] = useState<OzetIstatistik | null>(null);

  useEffect(() => {
    import("@/server/actions/istatistik").then(({ getOzetIstatistik }) => {
      getOzetIstatistik().then(setVeri);
    });
  }, []);

  if (!veri) {
    return (
      <PixelCard variant="dark">
        <div className="animate-pulse flex gap-4">
          <div className="flex-1 h-16 bg-[#2878F8]/20 rounded" />
          <div className="flex-1 h-16 bg-[#00A800]/20 rounded" />
        </div>
      </PixelCard>
    );
  }

  return (
    <PixelCard>
      <p className="font-body text-lg text-[#000000] mb-3">
        📊 İstatistik Özeti
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="border-2 border-[#000000] px-3 py-2 text-center" style={{ background: "#A8A8A8" }}>
          <div className="font-pixel text-[8px] text-[#6878A8]">BUGÜN GÖREV</div>
          <div className="font-pixel text-2xl" style={{ color: "#2878F8" }}>
            {veri.bugunGorev.tamamlanan}/{veri.bugunGorev.toplam}
          </div>
        </div>
        <div className="border-2 border-[#000000] px-3 py-2 text-center" style={{ background: "#A8A8A8" }}>
          <div className="font-pixel text-[8px] text-[#6878A8]">HAFTA POMODORO</div>
          <div className="font-pixel text-2xl" style={{ color: "#E01828" }}>
            {veri.haftaPomodoro}
          </div>
        </div>
        <div className="border-2 border-[#000000] px-3 py-2 text-center" style={{ background: "#A8A8A8" }}>
          <div className="font-pixel text-[8px] text-[#6878A8]">HAFTA GÖREV</div>
          <div className="font-pixel text-2xl" style={{ color: "#00A800" }}>
            {veri.haftaGorev.tamamlanan}/{veri.haftaGorev.toplam}
          </div>
        </div>
        <div className="border-2 border-[#000000] px-3 py-2 text-center" style={{ background: "#A8A8A8" }}>
          <div className="font-pixel text-[8px] text-[#6878A8]">AY GÖREV</div>
          <div className="font-pixel text-2xl" style={{ color: "#F89000" }}>
            {veri.ayGorev.tamamlanan}/{veri.ayGorev.toplam}
          </div>
        </div>
      </div>
    </PixelCard>
  );
}
