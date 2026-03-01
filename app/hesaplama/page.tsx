"use client";

import { useState } from "react";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";

type SinavTuru = "TYT" | "AYT";

interface NetSonuc {
  net: number;
  puan: number;
}

function hesaplaTYT(dogru: number, yanlis: number): NetSonuc {
  const net = Math.max(0, dogru - yanlis / 4);
  const puan = 100 + net * 3.316;
  return { net, puan: Math.round(puan * 10) / 10 };
}

function hesaplaAYT(dogru: number, yanlis: number, tur: string): NetSonuc {
  const net = Math.max(0, dogru - yanlis / 4);
  let katsayi = 3.0;
  if (tur === "sayisal") katsayi = 3.0;
  else if (tur === "sozel") katsayi = 2.8;
  else if (tur === "esit") katsayi = 2.8;
  else if (tur === "dil") katsayi = 3.0;
  
  const puan = 100 + net * katsayi;
  return { net, puan: Math.round(puan * 10) / 10 };
}

export default function HesaplamaPage() {
  const [sinavTuru, setSinavTuru] = useState<SinavTuru>("TYT");
  const [dersler, setDersler] = useState<{ ad: string; dogru: number; yanlis: number }[]>([
    { ad: "Türkçe", dogru: 0, yanlis: 0 },
    { ad: "Sosyal", dogru: 0, yanlis: 0 },
    { ad: "Matematik", dogru: 0, yanlis: 0 },
    { ad: "Fen", dogru: 0, yanlis: 0 },
  ]);
  const [aytTur, setAytTur] = useState<"sayisal" | "sozel" | "esit" | "dil">("sayisal");
  const [sonuclar, setSonuclar] = useState<NetSonuc | null>(null);

  const tytDersler = [
    { ad: "Türkçe", adKey: "turkce" },
    { ad: "Sosyal Bilimler", adKey: "sosyal" },
    { ad: "Matematik", adKey: "matematik" },
    { ad: "Fen Bilimleri", adKey: "fen" },
  ];

  const aytDersler = [
    { ad: "Matematik", adKey: "matematik" },
    { ad: "Fizik", adKey: "fizik" },
    { ad: "Kimya", adKey: "kimya" },
    { ad: "Biyoloji", adKey: "biyoloji" },
  ];

  const aytSozelDersler = [
    { ad: "Türk Dili ve Edebiyatı", adKey: "turkce" },
    { ad: "Tarih", adKey: "tarih" },
    { ad: "Coğrafya", adKey: "cografya" },
    { ad: "Felsefe", adKey: "felsefe" },
  ];

  const aytEsitDersler = [
    { ad: "Matematik", adKey: "matematik" },
    { ad: "Türk Dili ve Edebiyatı", adKey: "turkce" },
    { ad: "Tarih", adKey: "tarih" },
    { ad: "Coğrafya", adKey: "cografya" },
  ];

  const aytDilDersler = [
    { ad: "Dil", adKey: "dil" },
  ];

  function getAytDersler() {
    switch (aytTur) {
      case "sayisal": return aytDersler;
      case "sozel": return aytSozelDersler;
      case "esit": return aytEsitDersler;
      case "dil": return aytDilDersler;
    }
  }

  const currentDersler = sinavTuru === "TYT" ? tytDersler : getAytDersler();

  function handleDersChange(index: number, alan: "dogru" | "yanlis", deger: number) {
    const yeniDersler = [...dersler];
    yeniDersler[index] = { ...yeniDersler[index], [alan]: deger };
    setDersler(yeniDersler);
  }

  function hesapla() {
    const toplamDogru = dersler.reduce((sum, d) => sum + d.dogru, 0);
    const toplamYanlis = dersler.reduce((sum, d) => sum + d.yanlis, 0);
    
    if (sinavTuru === "TYT") {
      setSonuclar(hesaplaTYT(toplamDogru, toplamYanlis));
    } else {
      setSonuclar(hesaplaAYT(toplamDogru, toplamYanlis, aytTur));
    }
  }

  function sifirla() {
    setDersler(currentDersler.map(d => ({ ad: d.ad, dogru: 0, yanlis: 0 })));
    setSonuclar(null);
  }

  return (
    <>
      <PageHeader icon="🧮" title="NET HESAPLA" subtitle="Puanını hesapla" />
      <PageContainer>
          {/* Sınav Türü Seçimi */}
          <PixelCard variant="dark">
            <p className="font-[family-name:var(--font-pixel)] text-[10px] mb-3" style={{ color: "#FFD000" }}>
              ▶ SINAV TÜRÜ
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { setSinavTuru("TYT"); setDersler(tytDersler.map(d => ({ ad: d.ad, dogru: 0, yanlis: 0 }))); setSonuclar(null); }}
                className="flex-1 py-2 px-3 border-2 font-[family-name:var(--font-body)] text-xl transition-all"
                style={{ 
                  borderColor: sinavTuru === "TYT" ? "#FFD000" : "#303058",
                  background: sinavTuru === "TYT" ? "#101010" : "transparent",
                  color: sinavTuru === "TYT" ? "#FFD000" : "#606878"
                }}
              >
                TYT
              </button>
              <button
                onClick={() => { setSinavTuru("AYT"); setSonuclar(null); }}
                className="flex-1 py-2 px-3 border-2 font-[family-name:var(--font-body)] text-xl transition-all"
                style={{ 
                  borderColor: sinavTuru === "AYT" ? "#FFD000" : "#303058",
                  background: sinavTuru === "AYT" ? "#101010" : "transparent",
                  color: sinavTuru === "AYT" ? "#FFD000" : "#606878"
                }}
              >
                AYT
              </button>
            </div>
          </PixelCard>

          {/* AYT Türü Seçimi */}
          {sinavTuru === "AYT" && (
            <PixelCard variant="dark">
              <p className="font-[family-name:var(--font-pixel)] text-[10px] mb-3" style={{ color: "#FFD000" }}>
                ▶ AYT PUAN TÜRÜ
              </p>
              <div className="grid grid-cols-4 gap-2">
                {(["sayisal", "sozel", "esit", "dil"] as const).map(tur => (
                  <button
                    key={tur}
                    onClick={() => { 
                      setAytTur(tur); 
                      const yeniDersler = tur === "sayisal" ? aytDersler : 
                                         tur === "sozel" ? aytSozelDersler : 
                                         tur === "esit" ? aytEsitDersler : aytDilDersler;
                      setDersler(yeniDersler.map(d => ({ ad: d.ad, dogru: 0, yanlis: 0 }))); 
                      setSonuclar(null); 
                    }}
                    className="py-2 px-2 border-2 font-[family-name:var(--font-pixel)] text-[8px] transition-all"
                    style={{ 
                      borderColor: aytTur === tur ? "#FFD000" : "#303058",
                      background: aytTur === tur ? "#101010" : "transparent",
                      color: aytTur === tur ? "#FFD000" : "#606878"
                    }}
                  >
                    {tur === "sayisal" ? "SAYISAL" : tur === "sozel" ? "SÖZEL" : tur === "esit" ? "EŞİT AĞIRLIK" : "DİL"}
                  </button>
                ))}
              </div>
            </PixelCard>
          )}

          {/* Ders Girişi */}
          <PixelCard>
            <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
              Doğru / Yanlış Girişi
            </p>
            <div className="flex flex-col gap-2">
              {dersler.map((ders, i) => (
                <div key={ders.ad} className="flex items-center gap-2 border-2 border-[#D0D0E8] px-3 py-2" style={{ background: "#F8F4F0" }}>
                  <span className="flex-1 font-[family-name:var(--font-body)] text-xl text-[#101010]">
                    {ders.ad}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-[family-name:var(--font-body)] text-sm text-[#18C840]">D:</span>
                    <input
                      type="number"
                      min="0"
                      value={ders.dogru}
                      onChange={(e) => handleDersChange(i, "dogru", Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-14 px-2 py-1 border-2 border-[#D0D0E8] font-[family-name:var(--font-body)] text-xl text-center"
                      style={{ background: "#FFFFFF", color: "#18C840" }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-[family-name:var(--font-body)] text-sm text-[#E01828]">Y:</span>
                    <input
                      type="number"
                      min="0"
                      value={ders.yanlis}
                      onChange={(e) => handleDersChange(i, "yanlis", Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-14 px-2 py-1 border-2 border-[#D0D0E8] font-[family-name:var(--font-body)] text-xl text-center"
                      style={{ background: "#FFFFFF", color: "#E01828" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PixelCard>

          {/* Butonlar */}
          <div className="flex gap-2">
            <PixelButton onClick={hesapla} variant="primary" className="flex-1">
              Hesapla
            </PixelButton>
            <PixelButton onClick={sifirla} variant="ghost" className="flex-1">
              Sıfırla
            </PixelButton>
          </div>

          {/* Sonuç */}
          {sonuclar && (
            <PixelCard>
              <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3 text-center">
                📊 SONUÇ
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="border-3 border-[#FFD000] px-4 py-4 text-center" style={{ background: "#101010" }}>
                  <div className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#606878" }}>NET</div>
                  <div className="font-[family-name:var(--font-pixel)] text-4xl" style={{ color: "#FFD000" }}>
                    {sonuclar.net.toFixed(1)}
                  </div>
                </div>
                <div className="border-3 border-[#18C840] px-4 py-4 text-center" style={{ background: "#101010" }}>
                  <div className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#606878" }}>TAHMİNİ PUAN</div>
                  <div className="font-[family-name:var(--font-pixel)] text-4xl" style={{ color: "#18C840" }}>
                    {sonuclar.puan.toFixed(1)}
                  </div>
                </div>
              </div>
              <p className="font-[family-name:var(--font-body)] text-sm text-[#606878] mt-3 text-center">
                * Tahmini puan. Gerçek puan hesaplaması ÖSYM standartlarına göre değişebilir.
              </p>
            </PixelCard>
          )}
      </PageContainer>
    </>
  );
}
