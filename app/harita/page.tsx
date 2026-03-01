export const dynamic = "force-dynamic";

import Link from "next/link";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";

type DersWithKonular = {
  id: string;
  ad: string;
  renk: string;
  icon: string;
  konular: { id: string; tamamlandi: boolean }[];
};

export default async function HaritaPage() {
  const userId = await requireUserId();
  
  const dersler = await db.ders.findMany({
    where: { userId },
    include: { konular: { select: { id: true, tamamlandi: true } } },
    orderBy: { createdAt: "asc" },
  }) as DersWithKonular[];

  const toplamKonu = dersler.reduce((sum, d) => sum + d.konular.length, 0);
  const tamamlananKonu = dersler.reduce((sum, d) => sum + d.konular.filter(k => k.tamamlandi).length, 0);
  const genelIlerleme = toplamKonu > 0 ? Math.round((tamamlananKonu / toplamKonu) * 100) : 0;

  return (
    <>
      <PageHeader icon="🗺️" title="DÜNYA HARİTASI" subtitle="Bölgeleri fethet!" />
      <PageContainer>
          {/* Genel İlerleme */}
          <PixelCard>
            <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
              🗺️ Genel İlerleme
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-4 border-2 border-[#101010]" style={{ background: "#E8E8E8" }}>
                <div 
                  className="h-full transition-all"
                  style={{ 
                    width: `${genelIlerleme}%`,
                    background: "#18C840"
                  }}
                />
              </div>
              <div className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#18C840" }}>
                %{genelIlerleme}
              </div>
            </div>
            <div className="font-[family-name:var(--font-body)] text-sm text-[#606878] mt-2">
              {tamamlananKonu} / {toplamKonu} konu tamamlandı
            </div>
          </PixelCard>

          {/* Bölgeler (Dersler) */}
          <PixelCard>
            <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
              ⚔️ Bölgeler
            </p>
            
            {dersler.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="font-[family-name:var(--font-body)] text-lg text-[#606878]">
                  Henüz bölge yok
                </p>
                <p className="font-[family-name:var(--font-body)] text-sm text-[#909090] mt-1">
                  Konu ekleyerek haritayı genişlet!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dersler.map((ders) => {
                  const konuSayi = ders.konular.length;
                  const tamamSayi = ders.konular.filter(k => k.tamamlandi).length;
                  const ilerleme = konuSayi > 0 ? Math.round((tamamSayi / konuSayi) * 100) : 0;
                  const tamamlandi = ilerleme === 100;
                  
                  return (
                    <Link
                      key={ders.id}
                      href={`/ders/${ders.id}`}
                      className="block"
                    >
                      <div
                        className={`border-4 p-3 transition-all hover:scale-[1.02] ${
                          tamamlandi ? "cursor-pointer" : "cursor-pointer"
                        }`}
                        style={{
                          borderColor: tamamlandi ? "#FFD000" : ders.renk,
                          background: tamamlandi ? "#FFF8E0" : "#F0E8D0",
                          boxShadow: tamamlandi 
                            ? "4px 4px 0 0 #504000" 
                            : "3px 3px 0 0 #101010",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{ders.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span
                                className="font-[family-name:var(--font-body)] text-lg truncate"
                                style={{ color: "#101010" }}
                              >
                                {ders.ad}
                              </span>
                              {tamamlandi && (
                                <span className="text-lg">👑</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-2 border border-[#D0D0E8]" style={{ background: "#E8E8E8" }}>
                                <div
                                  className="h-full"
                                  style={{ 
                                    width: `${ilerleme}%`,
                                    background: tamamlandi ? "#FFD000" : ders.renk
                                  }}
                                />
                              </div>
                              <span
                                className="font-[family-name:var(--font-pixel)] text-xs whitespace-nowrap"
                                style={{ color: tamamlandi ? "#FFD000" : "#606878" }}
                              >
                                {tamamSayi}/{konuSayi}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </PixelCard>

          {/* Yeni Bölge Ekle */}
          <Link href="/ders">
            <div
              className="border-2 border-dashed border-[#2878F8] px-4 py-4 text-center cursor-pointer"
              style={{ background: "#F0E8D0" }}
            >
              <span className="font-[family-name:var(--font-body)] text-lg text-[#2878F8]">
                + Yeni Bölge Ekle
              </span>
            </div>
          </Link>
      </PageContainer>
    </>
  );
}
