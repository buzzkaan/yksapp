"use client";
import { useEffect, useState } from "react";
import { PixelCard } from "@/components/pixel/PixelCard";

type GirisBonusu = {
  yeniGiris: boolean;
  xpKazan: number;
};

export function DailyLoginBonus() {
  const [bonus, setBonus] = useState<GirisBonusu | null>(null);
  const [goster, setGoster] = useState(false);

  useEffect(() => {
    import("@/server/actions/basarim").then(({ girisYapildi }) => {
      girisYapildi().then((b) => {
        setBonus(b);
        if (b.yeniGiris) {
          setGoster(true);
          setTimeout(() => setGoster(false), 5000);
        }
      });
    });
  }, []);

  if (!bonus || !goster) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none">
        <div className="animate-bounce">
          <div className="text-8xl">🎁</div>
        </div>
      </div>
      <div className="fixed inset-0 z-[102] flex items-center justify-center p-4">
        <PixelCard className="max-w-sm w-full text-center animate-[bounce_0.5s_ease-out]">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-[family-name:var(--font-pixel)] text-2xl text-[#FFD000] mb-2">
            GÜNLÜK GİRİŞ!
          </h2>
          <p className="font-[family-name:var(--font-body)] text-xl text-[#101010] mb-4">
            Hoş geldin! +{bonus.xpKazan} XP kazandın!
          </p>
          <div
            className="inline-block px-4 py-2 border-2 border-[#FFD000]"
            style={{ background: "#FFD000", boxShadow: "3px 3px 0 0 #504000" }}
          >
            <span className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#101010" }}>
              +{bonus.xpKazan} XP
            </span>
          </div>
          <button
            onClick={() => setGoster(false)}
            className="mt-4 w-full py-2 font-[family-name:var(--font-body)] text-lg"
            style={{ color: "#606878" }}
          >
            Teşekkürler!
          </button>
        </PixelCard>
      </div>
    </>
  );
}
