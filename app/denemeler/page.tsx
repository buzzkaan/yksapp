"use client";
import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelBadge } from "@/components/pixel/PixelBadge";
import { PixelLineChart } from "@/components/pixel/PixelLineChart";
import { DenemeForm } from "@/components/features/DenemeForm";
import { denemeleriGetir, denemeSil } from "@/server/actions/denemeler";
import type { DenemeWithDetay } from "@/lib/types";
import toast from "react-hot-toast";

export default function DenemellerPage() {
  const [denemeler, setDenemeler] = useState<DenemeWithDetay[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [analizExpanded, setAnalizExpanded] = useState(true);

  async function handleSil(id: string) {
    await denemeSil(id);
    toast("🗑️ Deneme silindi", { icon: "⚠️" });
    setDenemeler(await denemeleriGetir());
  }

  useEffect(() => {
    denemeleriGetir().then(setDenemeler);
  }, []);

  const chartData = [...denemeler]
    .reverse()
    .slice(-10)
    .map((d) => ({
      label: new Date(d.tarih).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" }),
      value: d.net,
    }));

  const analiz = useMemo(() => {
    if (denemeler.length === 0) return null;
    
    const dersIstatistik: Record<string, { toplamNet: number; sayi: number; dogru: number; yanlis: number }> = {};
    
    denemeler.forEach(d => {
      d.dersDetay.forEach(dd => {
        if (!dersIstatistik[dd.dersAdi]) {
          dersIstatistik[dd.dersAdi] = { toplamNet: 0, sayi: 0, dogru: 0, yanlis: 0 };
        }
        dersIstatistik[dd.dersAdi].toplamNet += dd.net;
        dersIstatistik[dd.dersAdi].dogru += dd.dogru;
        dersIstatistik[dd.dersAdi].yanlis += dd.yanlis;
        dersIstatistik[dd.dersAdi].sayi += 1;
      });
    });
    
    const dersler = Object.entries(dersIstatistik).map(([ad, ist]) => ({
      ad,
      ortalamaNet: ist.sayi > 0 ? ist.toplamNet / ist.sayi : 0,
      toplamDogru: ist.dogru,
      toplamYanlis: ist.yanlis,
      sayi: ist.sayi,
    })).sort((a, b) => b.ortalamaNet - a.ortalamaNet);
    
    const ortalamalar = {
      net: denemeler.reduce((sum, d) => sum + d.net, 0) / denemeler.length,
      dogru: denemeler.reduce((sum, d) => sum + d.dogru, 0) / denemeler.length,
      yanlis: denemeler.reduce((sum, d) => sum + d.yanlis, 0) / denemeler.length,
    };
    
    return { dersler, ortalamalar };
  }, [denemeler]);

  return (
    <>
      <PageHeader icon="📝" title="DENEME KAYITLARI" subtitle="Her deneme bir boss fight!" />
      <PageContainer>
        {!showForm ? (
          <PixelButton onClick={() => setShowForm(true)} variant="primary" className="w-full">
            + Yeni Deneme Ekle
          </PixelButton>
        ) : (
          <DenemeForm onClose={() => {
            setShowForm(false);
            denemeleriGetir().then(setDenemeler);
          }} />
        )}

        {chartData.length >= 2 && (
          <PixelCard>
            <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
              Net Trendi (son {chartData.length} deneme)
            </p>
            <div className="overflow-x-auto">
              <PixelLineChart data={chartData} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-[family-name:var(--font-body)] text-xs text-[#484858]">
                {chartData[0]?.label}
              </span>
              <span className="font-[family-name:var(--font-body)] text-xs text-[#484858]">
                {chartData[chartData.length - 1]?.label}
              </span>
            </div>
          </PixelCard>
        )}

        {/* Deneme Analizi */}
        {analiz && (
          <PixelCard>
            <button 
              onClick={() => setAnalizExpanded(!analizExpanded)}
              className="w-full flex items-center justify-between"
            >
              <p className="font-[family-name:var(--font-body)] text-lg text-[#101010]">
                📊 Deneme Analizi
              </p>
              <span className="font-[family-name:var(--font-body)] text-lg text-[#2878F8]">
                {analizExpanded ? "▲" : "▼"}
              </span>
            </button>
            
            {analizExpanded && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="border-2 border-[#D0D0E8] px-2 py-2 text-center" style={{ background: "#F0E8D0" }}>
                    <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">ORTALAMA NET</div>
                    <div className="font-[family-name:var(--font-pixel)] text-xl text-[#2878F8]">
                      {analiz.ortalamalar.net.toFixed(1)}
                    </div>
                  </div>
                  <div className="border-2 border-[#D0D0E8] px-2 py-2 text-center" style={{ background: "#F0E8D0" }}>
                    <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">ORT. DOĞRU</div>
                    <div className="font-[family-name:var(--font-pixel)] text-xl text-[#18C840]">
                      {analiz.ortalamalar.dogru.toFixed(1)}
                    </div>
                  </div>
                  <div className="border-2 border-[#D0D0E8] px-2 py-2 text-center" style={{ background: "#F0E8D0" }}>
                    <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">ORT. YANLIŞ</div>
                    <div className="font-[family-name:var(--font-pixel)] text-xl text-[#E01828]">
                      {analiz.ortalamalar.yanlis.toFixed(1)}
                    </div>
                  </div>
                </div>

                {analiz.dersler.length > 0 && (
                  <div>
                    <p className="font-[family-name:var(--font-body)] text-base text-[#101010] mb-2">
                      Ders Bazlı Ortalama:
                    </p>
                    <div className="space-y-1">
                      {analiz.dersler.map((ders, i) => (
                        <div key={ders.ad} className="flex items-center gap-2 border border-[#D0D0E8] px-2 py-1" style={{ background: i === 0 ? "#D4ECC8" : i === analiz.dersler.length - 1 ? "#F4E0E0" : "#F8F4F0" }}>
                          <span className="font-[family-name:var(--font-pixel)] text-[9px] text-[#606878] w-4">
                            #{i + 1}
                          </span>
                          <span className="flex-1 font-[family-name:var(--font-body)] text-base text-[#101010] truncate">
                            {ders.ad}
                          </span>
                          <span className="font-[family-name:var(--font-pixel)] text-sm" style={{ color: ders.ortalamaNet > 10 ? "#18C840" : ders.ortalamaNet > 5 ? "#F89000" : "#E01828" }}>
                            {ders.ortalamaNet.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </PixelCard>
        )}

        {denemeler.length === 0 ? (
          <PixelCard className="text-center py-8">
            <p className="font-[family-name:var(--font-body)] text-xl text-[#484858]">
              Henüz deneme kaydı yok.
            </p>
          </PixelCard>
        ) : (
          denemeler.map((d) => (
            <PixelCard key={d.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <PixelBadge variant={d.tur === "TYT" ? "blue" : "purple"}>
                      {d.tur}
                    </PixelBadge>
                    <span className="font-[family-name:var(--font-body)] text-base text-[#484858]">
                      {new Date(d.tarih).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-body)] text-sm text-[#101010]">
                    D:{d.dogru} Y:{d.yanlis} B:{d.bos}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-[family-name:var(--font-pixel)] text-sm text-[#18C840]">
                    {d.net.toFixed(2)}
                  </div>
                  <div className="font-[family-name:var(--font-body)] text-xs text-[#484858]">
                    net
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <PixelButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                >
                  {expandedId === d.id ? "▲ Gizle" : "▼ Detay"}
                </PixelButton>
                <PixelButton
                  variant="danger"
                  size="sm"
                  onClick={() => handleSil(d.id)}
                >
                  Sil
                </PixelButton>
              </div>

              {expandedId === d.id && (
                <div className="border-t-4 border-[#101010] mt-3 pt-3">
                  <div className="grid grid-cols-4 gap-1 font-[family-name:var(--font-body)] text-xs text-[#484858] mb-1">
                    <span>Ders</span>
                    <span className="text-center">D</span>
                    <span className="text-center">Y</span>
                    <span className="text-center">Net</span>
                  </div>
                  {d.dersDetay.map((dd) => (
                    <div key={dd.id} className="grid grid-cols-4 gap-1 font-[family-name:var(--font-body)] text-base">
                      <span className="text-[#101010] truncate">{dd.dersAdi}</span>
                      <span className="text-center text-[#18C840]">{dd.dogru}</span>
                      <span className="text-center text-[#E01828]">{dd.yanlis}</span>
                      <span className="text-center text-[#101010]">{dd.net.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}
            </PixelCard>
          ))
        )}
      </PageContainer>
    </>
  );
}
