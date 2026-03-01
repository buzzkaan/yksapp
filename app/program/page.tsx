"use client";

import { useState, useEffect, useTransition } from "react";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";

const GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

type Program = {
  id: string;
  gun: number;
  ders: string;
  baslangic: string;
  bitis: string;
  aktif: boolean;
};

export default function ProgramPage() {
  const [program, setProgram] = useState<Program[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [yeniDers, setYeniDers] = useState({ gun: 0, ders: "", baslangic: "09:00", bitis: "10:00" });
  const [isPending, startT] = useTransition();

  useEffect(() => {
    // Load program from localStorage for now
    const saved = localStorage.getItem("haftalikProgram");
    if (saved) {
      setProgram(JSON.parse(saved));
    }
  }, []);

  function kaydetProgram(yeniProgram: Program[]) {
    localStorage.setItem("haftalikProgram", JSON.stringify(yeniProgram));
    setProgram(yeniProgram);
  }

  function ekle() {
    if (!yeniDers.ders.trim()) return;
    
    startT(() => {
      const yeni: Program = {
        id: Date.now().toString(),
        gun: yeniDers.gun,
        ders: yeniDers.ders,
        baslangic: yeniDers.baslangic,
        bitis: yeniDers.bitis,
        aktif: true,
      };
      const updated = [...program, yeni];
      kaydetProgram(updated);
      setShowForm(false);
      setYeniDers({ gun: 0, ders: "", baslangic: "09:00", bitis: "10:00" });
    });
  }

  function sil(id: string) {
    startT(() => {
      const updated = program.filter(p => p.id !== id);
      kaydetProgram(updated);
    });
  }

  function toggleAktif(id: string) {
    startT(() => {
      const updated = program.map(p => p.id === id ? { ...p, aktif: !p.aktif } : p);
      kaydetProgram(updated);
    });
  }

  return (
    <>
      <PageHeader icon="📅" title="HAFTALIK PROGRAM" subtitle="Ders çizelgen" />
      <PageContainer>
          {!showForm ? (
            <PixelButton onClick={() => setShowForm(true)} variant="primary" className="w-full">
              + Ders Ekle
            </PixelButton>
          ) : (
            <PixelCard variant="dark">
              <p className="font-[family-name:var(--font-pixel)] text-[10px] mb-3" style={{ color: "#FFD000" }}>
                ▶ YENİ DERS
              </p>
              
              <div className="flex flex-col gap-3">
                <select
                  value={yeniDers.gun}
                  onChange={(e) => setYeniDers({ ...yeniDers, gun: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border-2 font-[family-name:var(--font-body)] text-xl"
                  style={{ background: "#101010", borderColor: "#303058", color: "#FFD000" }}
                >
                  {GUNLER.map((g, i) => (
                    <option key={i} value={i}>{g}</option>
                  ))}
                </select>
                
                <input
                  type="text"
                  placeholder="Ders adı (örn: Matematik)"
                  value={yeniDers.ders}
                  onChange={(e) => setYeniDers({ ...yeniDers, ders: e.target.value })}
                  className="w-full px-3 py-2 border-2 font-[family-name:var(--font-body)] text-xl"
                  style={{ background: "#101010", borderColor: "#303058", color: "#B0C0D8" }}
                />
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="font-[family-name:var(--font-body)] text-sm text-[#606878]">Başlangıç</label>
                    <input
                      type="time"
                      value={yeniDers.baslangic}
                      onChange={(e) => setYeniDers({ ...yeniDers, baslangic: e.target.value })}
                      className="w-full px-3 py-2 border-2 font-[family-name:var(--font-body)] text-xl"
                      style={{ background: "#101010", borderColor: "#303058", color: "#B0C0D8" }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="font-[family-name:var(--font-body)] text-sm text-[#606878]">Bitiş</label>
                    <input
                      type="time"
                      value={yeniDers.bitis}
                      onChange={(e) => setYeniDers({ ...yeniDers, bitis: e.target.value })}
                      className="w-full px-3 py-2 border-2 font-[family-name:var(--font-body)] text-xl"
                      style={{ background: "#101010", borderColor: "#303058", color: "#B0C0D8" }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <PixelButton onClick={ekle} variant="primary" className="flex-1" disabled={isPending}>
                    Kaydet
                  </PixelButton>
                  <PixelButton onClick={() => setShowForm(false)} variant="ghost" className="flex-1">
                    İptal
                  </PixelButton>
                </div>
              </div>
            </PixelCard>
          )}

          {/* Program Listesi */}
          {program.length === 0 ? (
            <PixelCard className="text-center py-8">
              <p className="font-[family-name:var(--font-body)] text-xl text-[#484858]">
                Henüz program eklenmedi.
              </p>
            </PixelCard>
          ) : (
            GUNLER.map((gunAd, gunIndex) => {
              const gunProgram = program.filter(p => p.gun === gunIndex);
              if (gunProgram.length === 0) return null;
              
              return (
                <PixelCard key={gunIndex}>
                  <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
                    {gunAd}
                  </p>
                  <div className="flex flex-col gap-2">
                    {gunProgram.map(p => (
                      <div 
                        key={p.id}
                        className="flex items-center gap-2 border-2 px-3 py-2"
                        style={{ 
                          borderColor: p.aktif ? "#18C840" : "#D0D0E8",
                          background: p.aktif ? "#E8F4E0" : "#F0F0F0",
                          opacity: p.aktif ? 1 : 0.6
                        }}
                      >
                        <span className="font-[family-name:var(--font-pixel)] text-sm text-[#606878] w-20">
                          {p.baslangic}-{p.bitis}
                        </span>
                        <span className="flex-1 font-[family-name:var(--font-body)] text-xl text-[#101010]">
                          {p.ders}
                        </span>
                        <button
                          onClick={() => toggleAktif(p.id)}
                          className="px-2 py-1 border-2 font-[family-name:var(--font-pixel)] text-[8px]"
                          style={{ borderColor: p.aktif ? "#18C840" : "#D0D0E8", color: p.aktif ? "#18C840" : "#909090" }}
                        >
                          {p.aktif ? "AKTİF" : "PASİF"}
                        </button>
                        <button
                          onClick={() => sil(p.id)}
                          className="text-[#E01828] font-[family-name:var(--font-body)] text-xl"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </PixelCard>
              );
            })
          )}
      </PageContainer>
    </>
  );
}
