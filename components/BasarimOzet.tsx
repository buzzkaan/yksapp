"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PixelCard } from "@/components/pixel/PixelCard";

type Basarim = {
  id: string;
  ad: string;
  aciklama: string;
  puan: number;
  kazanildi: boolean;
};

type UserAyarlar = {
  xp: number;
  seviye: number;
};

export function BasarimOzet() {
  const [basarimlar, setBasarimlar] = useState<Basarim[]>([]);
  const [ayarlar, setAyarlar] = useState<UserAyarlar | null>(null);

  useEffect(() => {
    import("@/server/actions/basarim").then(({ basarimlariGetir, userAyarlariniGetir }) => {
      Promise.all([basarimlariGetir(), userAyarlariniGetir()]).then(([b, a]) => {
        setBasarimlar(b as Basarim[]);
        setAyarlar(a as UserAyarlar);
      });
    });
  }, []);

  if (!ayarlar) {
    return (
      <PixelCard variant="dark">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFD000]/20 rounded" />
          <div className="flex-1 h-10 bg-[#FFD000]/20 rounded" />
        </div>
      </PixelCard>
    );
  }

  const kazanilan = basarimlar.filter(b => b.kazanildi).length;
  const toplam = basarimlar.length;
  const ilerleme = toplam > 0 ? Math.round((kazanilan / toplam) * 100) : 0;

  return (
    <PixelCard>
      <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
        🏆 Başarımlar
      </p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 relative flex-shrink-0">
          <Image src="/icon/flag.png" alt="seviye" fill className="object-contain" unoptimized />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-[family-name:var(--font-pixel)] text-sm" style={{ color: "#FFD000" }}>
              SEVİYE {ayarlar.seviye}
            </span>
            <span className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#606878" }}>
              {ayarlar.xp} XP
            </span>
          </div>
          <div className="h-3 border-2 border-[#FFD000]" style={{ background: "#101010" }}>
            <div 
              className="h-full transition-all"
              style={{ width: `${ayarlar.xp % 100}%`, background: "#FFD000" }}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#18C840" }}>
          {kazanilan}/{toplam} başarım
        </span>
        <span className="font-[family-name:var(--font-pixel)] text-sm" style={{ color: "#18C840" }}>
          %{ilerleme}
        </span>
      </div>
    </PixelCard>
  );
}
