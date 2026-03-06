export const dynamic = "force-dynamic";

import Image from "next/image";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { basarimlariGetir, userAyarlariniGetir } from "@/server/actions/basarim";
import { ICONS } from "@/lib/constants/icons";

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
                <Image src={ICONS.flag} alt="seviye" fill className="object-contain" unoptimized />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-pixel text-sm" style={{ color: "#FFD000" }}>
                    SEVİYE {ayarlar.seviye}
                  </span>
                  <span className="font-body text-sm" style={{ color: "#606878" }}>
                    {ayarlar.xp % 100} / 100 XP
                  </span>
                </div>
                <div className="h-4 border-2 border-[#FFD000]" style={{ background: "#000058" }}>
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
              <p className="font-body text-lg text-[#000000] mb-3">
                🏆 Kazanılan ({kazanilan.length})
              </p>
              <div className="flex flex-col gap-2">
                {kazanilan.map(b => (
                  <div 
                    key={b.id}
                    className="flex items-center gap-3 border-2 px-3 py-2"
                    style={{ borderColor: "#00A800", background: "#006800" }}
                  >
                    <span className="text-2xl">🏅</span>
                    <div className="flex-1">
                      <div className="font-body text-xl text-[#FFD000]">
                        {b.ad}
                      </div>
                      <div className="font-body text-sm text-[#A8C8F8]">
                        {b.aciklama}
                      </div>
                    </div>
                    <span className="font-pixel text-sm text-[#00A800]">
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
              <p className="font-body text-lg text-[#000000] mb-3">
                🔒 Kilitli ({kazanilmamis.length})
              </p>
              <div className="flex flex-col gap-2">
                {kazanilmamis.map(b => (
                  <div 
                    key={b.id}
                    className="flex items-center gap-3 border-2 px-3 py-2 opacity-60"
                    style={{ borderColor: "#000000", background: "#505050" }}
                  >
                    <span className="text-2xl">🔒</span>
                    <div className="flex-1">
                      <div className="font-body text-xl text-[#A8A8A8]">
                        {b.ad}
                      </div>
                      <div className="font-body text-sm text-[#808080]">
                        {b.aciklama}
                      </div>
                    </div>
                    <span className="font-pixel text-sm text-[#808080]">
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
