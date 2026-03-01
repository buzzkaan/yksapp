"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type UserAyarlar = {
  xp: number;
  seviye: number;
};

export function UserLevelBadge() {
  const [ayarlar, setAyarlar] = useState<UserAyarlar | null>(null);

  useEffect(() => {
    import("@/server/actions/basarim").then(({ userAyarlariniGetir }) => {
      userAyarlariniGetir().then((a) => {
        setAyarlar(a as UserAyarlar);
      });
    });
  }, []);

  if (!ayarlar) {
    return (
      <div className="animate-pulse flex items-center gap-2 px-3 py-2 border-2" style={{ borderColor: "#FFD000", background: "#181838" }}>
        <div className="w-6 h-6 bg-[#FFD000]/20 rounded" />
        <div className="flex-1 h-8 bg-[#FFD000]/20 rounded" />
      </div>
    );
  }

  const ilerleme = ayarlar.xp % 100;

  return (
    <Link
      href="/basarimlar"
      className="flex items-center gap-2 px-3 py-2 border-2 transition-all hover:scale-[1.02]"
      style={{
        borderColor: "#FFD000",
        background: "#181838",
        boxShadow: "2px 2px 0 0 #504000",
      }}
    >
      <div className="w-6 h-6 relative flex-shrink-0">
        <div
          className="w-full h-full flex items-center justify-center font-[family-name:var(--font-pixel)] text-sm"
          style={{ color: "#FFD000" }}
        >
          ⚔️
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-pixel)] text-[10px]"
            style={{ color: "#FFD000" }}
          >
            SEVİYE {ayarlar.seviye}
          </span>
          <span
            className="font-[family-name:var(--font-body)] text-xs"
            style={{ color: "#8890B8" }}
          >
            {ayarlar.xp} XP
          </span>
        </div>
        <div className="h-1.5 mt-1 border border-[#FFD000]/50" style={{ background: "#101010" }}>
          <div
            className="h-full transition-all"
            style={{ width: `${ilerleme}%`, background: "#FFD000" }}
          />
        </div>
      </div>
    </Link>
  );
}
