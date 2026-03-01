export const dynamic = "force-dynamic";

import Image from "next/image";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { basarimlariGetir, userAyarlariniGetir } from "@/server/actions/basarim";

type Basarim = {
  id: string;
  tur: string;
  anahtar: string;
  ad: string;
  aciklama: string;
  puan: number;
  kazanildi: boolean;
  kazanildiTarih: Date | null;
};

type UserAyarlar = {
  xp: number;
  seviye: number;
  hedefUni: string | null;
  hedefBolum: string | null;
  hedefNet: number | null;
};

export default async function BasarimlarPage() {
  const [basarimlar, ayarlar]: [Basarim[], UserAyarlar] = await Promise.all([
    basarimlariGetir() as Promise<Basarim[]>,
    userAyarlariniGetir() as Promise<UserAyarlar>,
  ]);

  const kazanilan = basarimlar.filter(b => b.kazanildi);
  const kazanilmamis = basarimlar.filter(b => !b.kazanildi);

  return (
    <>
      <PageHeader icon="🎖️" title="BAŞARIMLAR" subtitle={`XP: ${ayarlar.xp} · Seviye ${ayarlar.seviye}`} />
      <PageContainer>
          {/* İlerleme */}
          <PixelCard variant="dark">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 relative">
                <Image src="/icon/flag.png" alt="seviye" fill className="object-contain" unoptimized />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-[family-name:var(--font-pixel)] text-sm" style={{ color: "#FFD000" }}>
                    SEVİYE {ayarlar.seviye}
                  </span>
                  <span className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#606878" }}>
                    {ayarlar.xp % 100} / 100 XP
                  </span>
                </div>
                <div className="h-4 border-2 border-[#FFD000]" style={{ background: "#101010" }}>
                  <div 
                    className="h-full transition-all"
                    style={{ 
                      width: `${ayarlar.xp % 100}%`,
                      background: "#FFD000"
                    }}
                  />
                </div>
              </div>
            </div>
          </PixelCard>

          {/* Kazanılan Başarımlar */}
          {kazanilan.length > 0 && (
            <PixelCard>
              <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
                🏆 Kazanılan ({kazanilan.length})
              </p>
              <div className="flex flex-col gap-2">
                {kazanilan.map(b => (
                  <div 
                    key={b.id}
                    className="flex items-center gap-3 border-2 px-3 py-2"
                    style={{ borderColor: "#18C840", background: "#E8F4E0" }}
                  >
                    <span className="text-2xl">🏅</span>
                    <div className="flex-1">
                      <div className="font-[family-name:var(--font-body)] text-xl text-[#101010]">
                        {b.ad}
                      </div>
                      <div className="font-[family-name:var(--font-body)] text-sm text-[#606878]">
                        {b.aciklama}
                      </div>
                    </div>
                    <span className="font-[family-name:var(--font-pixel)] text-sm text-[#18C840]">
                      +{b.puan} XP
                    </span>
                  </div>
                ))}
              </div>
            </PixelCard>
          )}

          {/* Kilitli Başarımlar */}
          {kazanilmamis.length > 0 && (
            <PixelCard>
              <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
                🔒 Kilitli ({kazanilmamis.length})
              </p>
              <div className="flex flex-col gap-2">
                {kazanilmamis.map(b => (
                  <div 
                    key={b.id}
                    className="flex items-center gap-3 border-2 px-3 py-2 opacity-60"
                    style={{ borderColor: "#D0D0E8", background: "#F0F0F0" }}
                  >
                    <span className="text-2xl">🔒</span>
                    <div className="flex-1">
                      <div className="font-[family-name:var(--font-body)] text-xl text-[#606878]">
                        {b.ad}
                      </div>
                      <div className="font-[family-name:var(--font-body)] text-sm text-[#909090]">
                        {b.aciklama}
                      </div>
                    </div>
                    <span className="font-[family-name:var(--font-pixel)] text-sm text-[#909090]">
                      +{b.puan} XP
                    </span>
                  </div>
                ))}
              </div>
            </PixelCard>
          )}
      </PageContainer>
    </>
  );
}
