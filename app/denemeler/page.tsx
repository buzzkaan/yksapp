"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
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

  return (
    <div>
      <PageHeader icon="📊" title="DENEME KAYITLARI" subtitle="Her deneme bir boss fight!" />

      <div className="p-4 flex flex-col gap-3 max-w-4xl mx-auto">
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
              <span className="font-[family-name:var(--font-body)] text-xs text-[#585868]">
                {chartData[0]?.label}
              </span>
              <span className="font-[family-name:var(--font-body)] text-xs text-[#585868]">
                {chartData[chartData.length - 1]?.label}
              </span>
            </div>
          </PixelCard>
        )}

        {denemeler.length === 0 ? (
          <PixelCard className="text-center py-8">
            <p className="font-[family-name:var(--font-body)] text-xl text-[#585868]">
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
                    <span className="font-[family-name:var(--font-body)] text-base text-[#585868]">
                      {new Date(d.tarih).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-body)] text-sm text-[#101010]">
                    D:{d.dogru} Y:{d.yanlis} B:{d.bos}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-[family-name:var(--font-pixel)] text-sm text-[#48B848]">
                    {d.net.toFixed(2)}
                  </div>
                  <div className="font-[family-name:var(--font-body)] text-xs text-[#585868]">
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
                  <div className="grid grid-cols-4 gap-1 font-[family-name:var(--font-body)] text-xs text-[#585868] mb-1">
                    <span>Ders</span>
                    <span className="text-center">D</span>
                    <span className="text-center">Y</span>
                    <span className="text-center">Net</span>
                  </div>
                  {d.dersDetay.map((dd) => (
                    <div key={dd.id} className="grid grid-cols-4 gap-1 font-[family-name:var(--font-body)] text-base">
                      <span className="text-[#101010] truncate">{dd.dersAdi}</span>
                      <span className="text-center text-[#48B848]">{dd.dogru}</span>
                      <span className="text-center text-[#E04048]">{dd.yanlis}</span>
                      <span className="text-center text-[#101010]">{dd.net.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}
            </PixelCard>
          ))
        )}
      </div>
    </div>
  );
}
