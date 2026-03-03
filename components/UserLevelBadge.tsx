"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type UserAyarlar = { xp: number; seviye: number };

export function UserLevelBadge() {
  const [ayarlar, setAyarlar] = useState<UserAyarlar | null>(null);

  useEffect(() => {
    import("@/server/actions/basarim").then(({ userAyarlariniGetir }) => {
      userAyarlariniGetir().then((a) => setAyarlar(a as UserAyarlar));
    });
  }, []);

  if (!ayarlar) {
    return (
      <div className="animate-pulse flex items-center gap-2 px-3 py-2 border-2 border-mario-gold bg-mario-navy-dark">
        <div className="w-6 h-6 bg-mario-gold/20 rounded" />
        <div className="flex-1 h-8 bg-mario-gold/20 rounded" />
      </div>
    );
  }

  const ilerleme = ayarlar.xp % 100;

  return (
    <Link
      href="/basarimlar"
      className="flex items-center gap-2 px-3 py-2 border-2 border-mario-gold bg-mario-navy-dark shadow-pixel-sm-gold transition-all hover:scale-[1.02]"
    >
      <div className="w-6 h-6 shrink-0 flex items-center justify-center font-pixel text-sm">
        ⚔️
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-pixel text-[10px] text-mario-gold">
            SEVİYE {ayarlar.seviye}
          </span>
          <span className="font-body text-xs text-mario-light">
            {ayarlar.xp} XP
          </span>
        </div>
        <div className="h-1.5 mt-1 border-2 border-black bg-mario-navy">
          <div
            className="h-full bg-mario-gold transition-all"
            style={{ width: `${ilerleme}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
