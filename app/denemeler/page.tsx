"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelBadge } from "@/components/pixel/PixelBadge";
import { DenemeForm } from "@/components/features/DenemeForm";
import { denemeleriGetir, denemeSil } from "@/server/actions/denemeler";
import toast from "react-hot-toast";

type DenemeDetay = {
  id: string;
  dersAdi: string;
  dogru: number;
  yanlis: number;
  bos: number;
  net: number;
};

type Deneme = {
  id: string;
  tarih: Date;
  tur: "TYT" | "AYT";
  toplam: number;
  dogru: number;
  yanlis: number;
  bos: number;
  net: number;
  dersDetay: DenemeDetay[];
};

function PixelLineChart({ data }: { data: { label: string; value: number }[] }) {
  if (data.length < 2) return null;

  const W = 280;
  const H = 80;
  const pad = 20;
  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const range = max - min || 1;

  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (W - pad * 2),
    y: pad + (1 - (d.value - min) / range) * (H - pad * 2),
    value: d.value,
    label: d.label,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg width={W} height={H} className="overflow-visible" style={{ imageRendering: "pixelated" }}>
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = pad + (1 - pct / 100) * (H - pad * 2);
        return (
          <line key={pct} x1={pad} y1={y} x2={W - pad} y2={y}
            stroke="#A0A8C0" strokeWidth="1" strokeDasharray="4 4" />
        );
      })}
      <path d={pathD} fill="none" stroke="#18C018" strokeWidth="3" strokeLinejoin="miter" />
      {points.map((p, i) => (
        <rect key={i} x={p.x - 4} y={p.y - 4} width="8" height="8"
          fill="#F0D000" stroke="#101010" strokeWidth="2" />
      ))}
    </svg>
  );
}

export default function DenemellerPage() {
  const [denemeler, setDenemeler] = useState<Deneme[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleSil(id: string) {
    await denemeSil(id);
    toast("🗑️ Deneme silindi", { icon: "⚠️" });
    const data = await denemeleriGetir();
    setDenemeler(data as Deneme[]);
  }

  useEffect(() => {
    denemeleriGetir().then((data) => setDenemeler(data as Deneme[]));
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
      <PageHeader icon="📝" title="DENEME KAYITLARI" subtitle="Her deneme bir hasat kaydı!" />

      <div className="p-4 flex flex-col gap-3">
        {!showForm ? (
          <PixelButton onClick={() => setShowForm(true)} variant="primary" className="w-full">
            + Yeni Deneme Ekle
          </PixelButton>
        ) : (
          <DenemeForm onClose={() => { 
            setShowForm(false); 
            denemeleriGetir().then((data) => setDenemeler(data as Deneme[]));
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
              <span className="font-[family-name:var(--font-body)] text-xs text-[#505068]">
                {chartData[0]?.label}
              </span>
              <span className="font-[family-name:var(--font-body)] text-xs text-[#505068]">
                {chartData[chartData.length - 1]?.label}
              </span>
            </div>
          </PixelCard>
        )}

        {denemeler.length === 0 ? (
          <PixelCard className="text-center py-8">
            <p className="font-[family-name:var(--font-body)] text-xl text-[#505068]">
              Henüz deneme kaydı yok.
            </p>
          </PixelCard>
        ) : (
          denemeler.map((d) => (
            <PixelCard key={d.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <PixelBadge variant={d.tur === "TYT" ? "green" : "purple"}>
                      {d.tur}
                    </PixelBadge>
                    <span className="font-[family-name:var(--font-body)] text-base text-[#505068]">
                      {new Date(d.tarih).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-body)] text-sm text-[#101010]">
                    D:{d.dogru} Y:{d.yanlis} B:{d.bos}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-[family-name:var(--font-pixel)] text-sm text-[#18C018]">
                    {d.net.toFixed(2)}
                  </div>
                  <div className="font-[family-name:var(--font-body)] text-xs text-[#505068]">
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
                <div className="mt-3 border-t-4 border-[#101010] pt-3">
                  <div className="grid grid-cols-4 gap-1 font-[family-name:var(--font-body)] text-xs text-[#505068] mb-1">
                    <span>Ders</span>
                    <span className="text-center">D</span>
                    <span className="text-center">Y</span>
                    <span className="text-center">Net</span>
                  </div>
                  {d.dersDetay.map((dd) => (
                    <div key={dd.id} className="grid grid-cols-4 gap-1 font-[family-name:var(--font-body)] text-base">
                      <span className="truncate text-[#101010]">{dd.dersAdi}</span>
                      <span className="text-center text-[#18C018]">{dd.dogru}</span>
                      <span className="text-center text-[#D81818]">{dd.yanlis}</span>
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
