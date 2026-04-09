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
import { useAuthGate } from "@/lib/utils/auth-gate";
import type { DenemeWithDetay } from "@/lib/types";
import toast from "react-hot-toast";

// ─── Hesaplama helpers ────────────────────────────────────────────────────────

type SinavTuru = "TYT" | "AYT";
interface NetSonuc { net: number; puan: number; }

function hesaplaTYT(dogru: number, yanlis: number): NetSonuc {
  const net = Math.max(0, dogru - yanlis / 4);
  const puan = 100 + net * 3.316;
  return { net, puan: Math.round(puan * 10) / 10 };
}

function hesaplaAYT(dogru: number, yanlis: number, tur: string): NetSonuc {
  const net = Math.max(0, dogru - yanlis / 4);
  const katsayi = (tur === "sozel" || tur === "esit") ? 2.8 : 3.0;
  const puan = 100 + net * katsayi;
  return { net, puan: Math.round(puan * 10) / 10 };
}

// ─── Hesapla Tab ─────────────────────────────────────────────────────────────

function HesaplaTab() {
  const tytDersler = [
    { ad: "Türkçe" },
    { ad: "Sosyal Bilimler" },
    { ad: "Matematik" },
    { ad: "Fen Bilimleri" },
  ];
  const aytDersler       = [{ ad: "Matematik" }, { ad: "Fizik" }, { ad: "Kimya" }, { ad: "Biyoloji" }];
  const aytSozelDersler  = [{ ad: "Türk Dili ve Edebiyatı" }, { ad: "Tarih" }, { ad: "Coğrafya" }, { ad: "Felsefe" }];
  const aytEsitDersler   = [{ ad: "Matematik" }, { ad: "Türk Dili ve Edebiyatı" }, { ad: "Tarih" }, { ad: "Coğrafya" }];
  const aytDilDersler    = [{ ad: "Dil" }];

  const [sinavTuru, setSinavTuru] = useState<SinavTuru>("TYT");
  const [aytTur, setAytTur]       = useState<"sayisal" | "sozel" | "esit" | "dil">("sayisal");
  const [dersler, setDersler]     = useState(tytDersler.map((d) => ({ ad: d.ad, dogru: 0, yanlis: 0 })));
  const [sonuclar, setSonuclar]   = useState<NetSonuc | null>(null);

  function getAytDersler() {
    if (aytTur === "sozel") return aytSozelDersler;
    if (aytTur === "esit")  return aytEsitDersler;
    if (aytTur === "dil")   return aytDilDersler;
    return aytDersler;
  }

  function handleDersChange(i: number, alan: "dogru" | "yanlis", val: number) {
    const next = [...dersler];
    next[i] = { ...next[i], [alan]: val };
    setDersler(next);
  }

  function hesapla() {
    const d = dersler.reduce((s, x) => s + x.dogru, 0);
    const y = dersler.reduce((s, x) => s + x.yanlis, 0);
    setSonuclar(sinavTuru === "TYT" ? hesaplaTYT(d, y) : hesaplaAYT(d, y, aytTur));
  }

  function sifirla() {
    const liste = sinavTuru === "TYT" ? tytDersler : getAytDersler();
    setDersler(liste.map((d) => ({ ad: d.ad, dogru: 0, yanlis: 0 })));
    setSonuclar(null);
  }

  return (
    <>
      {/* Sınav Türü */}
      <PixelCard variant="dark">
        <p className="font-pixel text-[10px] mb-3" style={{ color: "#FFD000" }}>
          ▶ SINAV TÜRÜ
        </p>
        <div className="flex gap-2">
          {(["TYT", "AYT"] as SinavTuru[]).map((tur) => (
            <button
              key={tur}
              onClick={() => {
                setSinavTuru(tur);
                const liste = tur === "TYT" ? tytDersler : aytDersler;
                setDersler(liste.map((d) => ({ ad: d.ad, dogru: 0, yanlis: 0 })));
                setSonuclar(null);
              }}
              className="flex-1 py-2 px-3 border-2 font-body text-xl transition-all"
              style={{
                borderColor: sinavTuru === tur ? "#FFD000" : "#303058",
                background:  sinavTuru === tur ? "#101010" : "transparent",
                color:       sinavTuru === tur ? "#FFD000" : "#606878",
              }}
            >
              {tur}
            </button>
          ))}
        </div>
      </PixelCard>

      {/* AYT Puan Türü */}
      {sinavTuru === "AYT" && (
        <PixelCard variant="dark">
          <p className="font-pixel text-[10px] mb-3" style={{ color: "#FFD000" }}>
            ▶ AYT PUAN TÜRÜ
          </p>
          <div className="grid grid-cols-4 gap-2">
            {(["sayisal", "sozel", "esit", "dil"] as const).map((tur) => {
              const label = tur === "sayisal" ? "SAYISAL" : tur === "sozel" ? "SÖZEL" : tur === "esit" ? "EŞİT" : "DİL";
              const liste = tur === "sozel" ? aytSozelDersler : tur === "esit" ? aytEsitDersler : tur === "dil" ? aytDilDersler : aytDersler;
              return (
                <button
                  key={tur}
                  onClick={() => { setAytTur(tur); setDersler(liste.map((d) => ({ ad: d.ad, dogru: 0, yanlis: 0 }))); setSonuclar(null); }}
                  className="py-2 px-2 border-2 font-pixel text-[8px] transition-all"
                  style={{
                    borderColor: aytTur === tur ? "#FFD000" : "#303058",
                    background:  aytTur === tur ? "#101010" : "transparent",
                    color:       aytTur === tur ? "#FFD000" : "#606878",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </PixelCard>
      )}

      {/* Ders Girişi */}
      <PixelCard>
        <p className="font-body text-lg text-[#101010] mb-3">
          Doğru / Yanlış Girişi
        </p>
        <div className="flex flex-col gap-2">
          {dersler.map((ders, i) => (
            <div
              key={ders.ad}
              className="flex items-center gap-2 border-2 border-[#D0D0E8] px-3 py-2"
              style={{ background: "#F8F4F0" }}
            >
              <span className="flex-1 font-body text-xl text-[#101010]">{ders.ad}</span>
              <div className="flex items-center gap-1">
                <span className="font-body text-sm text-[#18C840]">D:</span>
                <input
                  type="number" min="0" value={ders.dogru}
                  onChange={(e) => handleDersChange(i, "dogru", Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-14 px-2 py-1 border-2 border-[#D0D0E8] font-body text-xl text-center"
                  style={{ background: "#FFFFFF", color: "#18C840" }}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-body text-sm text-[#E01828]">Y:</span>
                <input
                  type="number" min="0" value={ders.yanlis}
                  onChange={(e) => handleDersChange(i, "yanlis", Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-14 px-2 py-1 border-2 border-[#D0D0E8] font-body text-xl text-center"
                  style={{ background: "#FFFFFF", color: "#E01828" }}
                />
              </div>
            </div>
          ))}
        </div>
      </PixelCard>

      {/* Butonlar */}
      <div className="flex gap-2">
        <PixelButton onClick={hesapla} variant="primary" className="flex-1">Hesapla</PixelButton>
        <PixelButton onClick={sifirla} variant="ghost"   className="flex-1">Sıfırla</PixelButton>
      </div>

      {/* Sonuç */}
      {sonuclar && (
        <PixelCard>
          <p className="font-body text-lg text-[#101010] mb-3 text-center">
            📊 SONUÇ
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="px-4 py-4 text-center border-2 border-[#FFD000]" style={{ background: "#101010" }}>
              <div className="font-pixel text-[9px]" style={{ color: "#606878" }}>NET</div>
              <div className="font-pixel text-4xl" style={{ color: "#FFD000" }}>
                {sonuclar.net.toFixed(1)}
              </div>
            </div>
            <div className="px-4 py-4 text-center border-2 border-[#18C840]" style={{ background: "#101010" }}>
              <div className="font-pixel text-[9px]" style={{ color: "#606878" }}>TAHMİNİ PUAN</div>
              <div className="font-pixel text-4xl" style={{ color: "#18C840" }}>
                {sonuclar.puan.toFixed(1)}
              </div>
            </div>
          </div>
          <p className="font-body text-sm text-[#606878] mt-3 text-center">
            * Tahmini puan. Gerçek hesaplama ÖSYM standartlarına göre değişebilir.
          </p>
        </PixelCard>
      )}
    </>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────

type ActiveTab = "denemeler" | "hesapla";

export default function DenemellerPage() {
  const [activeTab, setActiveTab]           = useState<ActiveTab>("denemeler");
  const [denemeler, setDenemeler]           = useState<DenemeWithDetay[]>([]);
  const [showForm, setShowForm]             = useState(false);
  const [expandedId, setExpandedId]         = useState<string | null>(null);
  const [analizExpanded, setAnalizExpanded] = useState(true);
  const { requireAuth } = useAuthGate();

  async function handleSil(id: string) {
    if (!requireAuth()) return;
    await denemeSil(id);
    toast("🗑️ Deneme silindi", { icon: "⚠️" });
    setDenemeler(await denemeleriGetir());
  }

  function handleShowForm() {
    if (!requireAuth()) return;
    setShowForm(true);
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
    denemeler.forEach((d) => {
      d.dersDetay.forEach((dd) => {
        if (!dersIstatistik[dd.dersAdi])
          dersIstatistik[dd.dersAdi] = { toplamNet: 0, sayi: 0, dogru: 0, yanlis: 0 };
        dersIstatistik[dd.dersAdi].toplamNet += dd.net;
        dersIstatistik[dd.dersAdi].dogru     += dd.dogru;
        dersIstatistik[dd.dersAdi].yanlis    += dd.yanlis;
        dersIstatistik[dd.dersAdi].sayi      += 1;
      });
    });
    const dersler = Object.entries(dersIstatistik)
      .map(([ad, ist]) => ({
        ad,
        ortalamaNet:   ist.sayi > 0 ? ist.toplamNet / ist.sayi : 0,
        toplamDogru:   ist.dogru,
        toplamYanlis:  ist.yanlis,
        sayi:          ist.sayi,
      }))
      .sort((a, b) => b.ortalamaNet - a.ortalamaNet);
    const ortalamalar = {
      net:    denemeler.reduce((s, d) => s + d.net,    0) / denemeler.length,
      dogru:  denemeler.reduce((s, d) => s + d.dogru,  0) / denemeler.length,
      yanlis: denemeler.reduce((s, d) => s + d.yanlis, 0) / denemeler.length,
    };
    return { dersler, ortalamalar };
  }, [denemeler]);

  const TABS: { key: ActiveTab; label: string }[] = [
    { key: "denemeler", label: "📝 Denemeler" },
    { key: "hesapla",   label: "🧮 Hesapla"   },
  ];

  return (
    <>
      <PageHeader icon="📝" title="DENEMELER" subtitle="Her deneme bir boss fight!" />
      <PageContainer>

        {/* ── Tab Seçici ── */}
        <div
          className="grid grid-cols-2 border-4 border-[#101010] overflow-hidden"
          style={{ boxShadow: "4px 4px 0 0 #101010" }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="py-3 font-body text-xl border-r-4 last:border-r-0 border-[#101010] transition-all"
                style={{
                  background: isActive ? "#101010" : "#F8F0DC",
                  color:      isActive ? "#FFD000" : "#606878",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab İçeriği ── */}
        {activeTab === "hesapla" ? (
          <HesaplaTab />
        ) : (
          <>
            {!showForm ? (
              <PixelButton onClick={handleShowForm} variant="primary" className="w-full">
                + Yeni Deneme Ekle
              </PixelButton>
            ) : (
              <DenemeForm onClose={() => { setShowForm(false); denemeleriGetir().then(setDenemeler); }} />
            )}

            {chartData.length >= 2 && (
              <PixelCard>
                <p className="font-body text-lg text-[#101010] mb-3">
                  Net Trendi (son {chartData.length} deneme)
                </p>
                <PixelLineChart data={chartData} />
                <div className="flex justify-between mt-1">
                  <span className="font-body text-xs text-[#484858]">{chartData[0]?.label}</span>
                  <span className="font-body text-xs text-[#484858]">{chartData[chartData.length - 1]?.label}</span>
                </div>
              </PixelCard>
            )}

            {analiz && (
              <PixelCard>
                <button
                  onClick={() => setAnalizExpanded(!analizExpanded)}
                  className="w-full flex items-center justify-between"
                >
                  <p className="font-body text-lg text-[#101010]">📊 Deneme Analizi</p>
                  <span className="font-body text-lg text-[#2878F8]">
                    {analizExpanded ? "▲" : "▼"}
                  </span>
                </button>

                {analizExpanded && (
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "ORTALAMA NET",  val: analiz.ortalamalar.net.toFixed(1),    renk: "#2878F8" },
                        { label: "ORT. DOĞRU",    val: analiz.ortalamalar.dogru.toFixed(1),  renk: "#18C840" },
                        { label: "ORT. YANLIŞ",   val: analiz.ortalamalar.yanlis.toFixed(1), renk: "#E01828" },
                      ].map((s) => (
                        <div key={s.label} className="border-2 border-[#D0D0E8] px-2 py-2 text-center" style={{ background: "#F0E8D0" }}>
                          <div className="font-pixel text-[8px] text-[#606878]">{s.label}</div>
                          <div className="font-pixel text-xl" style={{ color: s.renk }}>{s.val}</div>
                        </div>
                      ))}
                    </div>

                    {analiz.dersler.length > 0 && (
                      <div>
                        <p className="font-body text-base text-[#101010] mb-2">
                          Ders Bazlı Ortalama:
                        </p>
                        <div className="space-y-1">
                          {analiz.dersler.map((ders, i) => (
                            <div
                              key={ders.ad}
                              className="flex items-center gap-2 border border-[#D0D0E8] px-2 py-1"
                              style={{ background: i === 0 ? "#D4ECC8" : i === analiz.dersler.length - 1 ? "#F4E0E0" : "#F8F4F0" }}
                            >
                              <span className="font-pixel text-[9px] text-[#606878] w-4">#{i + 1}</span>
                              <span className="flex-1 font-body text-base text-[#101010] truncate">{ders.ad}</span>
                              <span
                                className="font-pixel text-sm"
                                style={{ color: ders.ortalamaNet > 10 ? "#18C840" : ders.ortalamaNet > 5 ? "#F89000" : "#E01828" }}
                              >
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
                <p className="font-body text-xl text-[#484858]">
                  Henüz deneme kaydı yok.
                </p>
              </PixelCard>
            ) : (
              denemeler.map((d) => (
                <PixelCard key={d.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <PixelBadge variant={d.tur === "TYT" ? "blue" : "purple"}>{d.tur}</PixelBadge>
                        <span className="font-body text-base text-[#484858]">
                          {new Date(d.tarih).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      <div className="font-body text-sm text-[#101010]">
                        D:{d.dogru} Y:{d.yanlis} B:{d.bos}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-pixel text-sm text-[#18C840]">{d.net.toFixed(2)}</div>
                      <div className="font-body text-xs text-[#484858]">net</div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <PixelButton variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}>
                      {expandedId === d.id ? "▲ Gizle" : "▼ Detay"}
                    </PixelButton>
                    <PixelButton variant="danger" size="sm" onClick={() => handleSil(d.id)}>Sil</PixelButton>
                  </div>

                  {expandedId === d.id && (
                    <div className="border-t-4 border-[#101010] mt-3 pt-3">
                      <div className="grid grid-cols-4 gap-1 font-body text-xs text-[#484858] mb-1">
                        <span>Ders</span>
                        <span className="text-center">D</span>
                        <span className="text-center">Y</span>
                        <span className="text-center">Net</span>
                      </div>
                      {d.dersDetay.map((dd) => (
                        <div key={dd.id} className="grid grid-cols-4 gap-1 font-body text-base">
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
          </>
        )}

      </PageContainer>
    </>
  );
}
