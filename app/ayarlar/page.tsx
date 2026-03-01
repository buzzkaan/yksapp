"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { SINAV_META, type SinavTipi } from "@/lib/sinav-data";
import { getSinavTipi, setSinavTipi } from "@/lib/utils/sinav";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { IstatistikOzet } from "@/components/IstatistikOzet";
import { BasarimOzet } from "@/components/BasarimOzet";
import toast from "react-hot-toast";

const SINAV_LISTESI: SinavTipi[] = ["YKS", "DGS", "KPSS"];

export default function AyarlarPage() {
  const router = useRouter();
  const [secili, setSecili] = useState<SinavTipi>(getSinavTipi);
  const [hedef, setHedef] = useState({ uni: "", bolum: "", net: "" });
  const [boyut, setBoyut] = useState("normal");
  const [stil, setStil] = useState("pixel");

  useEffect(() => {
    const saved = localStorage.getItem("hedefler");
    if (saved) {
      const h = JSON.parse(saved);
      setHedef({ uni: h.uni || "", bolum: h.bolum || "", net: h.net?.toString() || "" });
    }
    setBoyut(localStorage.getItem("yaziBoyutu") || "normal");
    setStil(localStorage.getItem("yaziStili") || "pixel");
  }, []);

  function handleKaydet() {
    setSinavTipi(secili);
    toast.success(`${SINAV_META[secili].isim} seçildi!`);
    setTimeout(() => router.push("/yks"), 800);
  }

  function handleBoyutDegis(yeniBoyut: string) {
    setBoyut(yeniBoyut);
    localStorage.setItem("yaziBoyutu", yeniBoyut);
    if (yeniBoyut === "normal") {
      delete document.documentElement.dataset.boyut;
    } else {
      document.documentElement.dataset.boyut = yeniBoyut;
    }
  }

  function handleStilDegis(yeniStil: string) {
    setStil(yeniStil);
    localStorage.setItem("yaziStili", yeniStil);
    if (yeniStil === "pixel") {
      delete document.documentElement.dataset.stil;
    } else {
      document.documentElement.dataset.stil = yeniStil;
    }
  }

  function hedefKaydet() {
    localStorage.setItem("hedefler", JSON.stringify({
      uni: hedef.uni,
      bolum: hedef.bolum,
      net: parseFloat(hedef.net) || 0,
    }));
    toast.success("Hedefler kaydedildi!");
  }

  const userButton = (
    <UserButton
      appearance={{
        elements: {
          avatarBox: { width: 40, height: 40, border: "3px solid #FFD000", borderRadius: "0" },
        },
      }}
    />
  );

  return (
    <div>
      <PageHeader icon="⚙️" title="AYARLAR" subtitle="Trainer ayarlarını yönet" action={userButton} />
      <PageContainer>
        {/* İstatistik ve Başarım Özeti */}
        <IstatistikOzet />
        <BasarimOzet />

        {/* Sınav Seçimi */}
        <PixelCard>
          <p className="font-[family-name:var(--font-body)] text-xl text-[#101010] mb-1">
            🎓 Hangi Boss&apos;a Hazırlanıyorsun?
          </p>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#484858] mb-4">
            Seçtiğin sınava göre konular ve içerikler değişir.
          </p>

          <div className="flex flex-col gap-3">
            {SINAV_LISTESI.map((tip) => {
              const meta = SINAV_META[tip];
              const isSecili = secili === tip;
              return (
                <button
                  key={tip}
                  onClick={() => setSecili(tip)}
                  className="w-full border-4 border-[#101010] p-3 text-left transition-all cursor-pointer"
                  style={isSecili ? {
                    backgroundColor: meta.renk,
                    boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.2), 4px 4px 0px 0px #101010",
                  } : {
                    backgroundColor: "#F8F0DC",
                    boxShadow: "3px 3px 0px 0px #101010",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Image src={meta.icon} alt={meta.isim} width={36} height={36} className="w-9 h-9" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-[family-name:var(--font-pixel)] text-xs"
                          style={{ color: isSecili ? "#FFF" : "#101010" }}
                        >
                          {meta.isim}
                        </span>
                        {isSecili && (
                          <span className="font-[family-name:var(--font-body)] text-sm border-2 border-white/60 px-1.5 text-white">
                            ✓ Seçili
                          </span>
                        )}
                      </div>
                      <p
                        className="font-[family-name:var(--font-body)] text-base mt-0.5"
                        style={{ color: isSecili ? "rgba(255,255,255,0.9)" : "#101010" }}
                      >
                        {meta.tamIsim}
                      </p>
                      <p
                        className="font-[family-name:var(--font-body)] text-sm"
                        style={{ color: isSecili ? "rgba(255,255,255,0.75)" : "#484858" }}
                      >
                        {meta.aciklama}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </PixelCard>

        <PixelButton
          variant="primary"
          className="w-full"
          onClick={handleKaydet}
        >
          💾 Kaydet ve Uygula
        </PixelButton>

        {/* Görünüm Ayarları */}
        <PixelCard>
          <p className="font-[family-name:var(--font-body)] text-xl text-[#101010] mb-1">
            🎨 Görünüm Ayarları
          </p>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#484858] mb-4">
            Yazı boyutu ve stilini kişiselleştir.
          </p>

          {/* Yazı Boyutu */}
          <p className="font-[family-name:var(--font-pixel)] text-[9px] text-[#484858] mb-2">YAZI BOYUTU</p>
          <div className="flex gap-2 mb-5">
            {[
              { key: "kucuk", label: "Küçük", sub: "S" },
              { key: "normal", label: "Normal", sub: "M" },
              { key: "buyuk", label: "Büyük", sub: "L" },
            ].map(({ key, label, sub }) => (
              <button
                key={key}
                onClick={() => handleBoyutDegis(key)}
                className="flex-1 border-4 border-[#101010] py-2 px-1 text-center cursor-pointer transition-all"
                style={boyut === key ? {
                  backgroundColor: "#2878F8",
                  boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.2)",
                } : {
                  backgroundColor: "#F8F0DC",
                  boxShadow: "3px 3px 0px 0px #101010",
                }}
              >
                <span
                  className="font-[family-name:var(--font-pixel)] block"
                  style={{ fontSize: key === "kucuk" ? "9px" : key === "buyuk" ? "14px" : "11px", color: boyut === key ? "#FFF" : "#101010" }}
                >{sub}</span>
                <span
                  className="font-[family-name:var(--font-body)] text-base block mt-1"
                  style={{ color: boyut === key ? "rgba(255,255,255,0.85)" : "#484858" }}
                >{label}</span>
              </button>
            ))}
          </div>

          {/* Yazı Stili */}
          <p className="font-[family-name:var(--font-pixel)] text-[9px] text-[#484858] mb-2">YAZI STİLİ</p>
          <div className="flex gap-2 mb-5">
            {[
              { key: "pixel", label: "🎮 Pixel", aciklama: "Retro piksel yazı" },
              { key: "modern", label: "📖 Modern", aciklama: "Temiz, okunaklı yazı" },
            ].map(({ key, label, aciklama }) => (
              <button
                key={key}
                onClick={() => handleStilDegis(key)}
                className="flex-1 border-4 border-[#101010] py-3 px-3 text-left cursor-pointer transition-all"
                style={stil === key ? {
                  backgroundColor: "#FFD000",
                  boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.1)",
                } : {
                  backgroundColor: "#F8F0DC",
                  boxShadow: "3px 3px 0px 0px #101010",
                }}
              >
                <span className="font-[family-name:var(--font-body)] text-lg block" style={{ color: "#101010" }}>{label}</span>
                <span className="font-[family-name:var(--font-body)] text-sm block" style={{ color: "#484858" }}>{aciklama}</span>
              </button>
            ))}
          </div>

          {/* Önizleme */}
          <div className="border-2 border-dashed border-[#484858] p-3" style={{ backgroundColor: "#F0E8D0" }}>
            <p className="font-[family-name:var(--font-pixel)] text-[9px] text-[#484858] mb-2">ÖNİZLEME</p>
            <p className="font-[family-name:var(--font-body)] text-2xl text-[#101010] leading-tight">YKS Quest</p>
            <p className="font-[family-name:var(--font-body)] text-xl text-[#484858]">Türkçe • Matematik • Geometri</p>
            <p className="font-[family-name:var(--font-pixel)] text-[9px] text-[#2878F8] mt-1">STREAK: 7 GÜN 🔥</p>
          </div>
        </PixelCard>

        {/* Hedef Takibi */}
        <PixelCard>
          <p className="font-[family-name:var(--font-body)] text-xl text-[#101010] mb-1">
            🎯 Hedef Üniversite / Bölüm
          </p>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#484858] mb-4">
            Hedefini belirleerek motivasyonunu artır!
          </p>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Hedef üniversite"
              value={hedef.uni}
              onChange={(e) => setHedef(h => ({ ...h, uni: e.target.value }))}
              className="w-full px-3 py-2 border-2 border-[#D0D0E8] font-[family-name:var(--font-body)] text-xl"
              style={{ background: "#FFFFFF", color: "#101010" }}
            />
            <input
              type="text"
              placeholder="Hedef bölüm"
              value={hedef.bolum}
              onChange={(e) => setHedef(h => ({ ...h, bolum: e.target.value }))}
              className="w-full px-3 py-2 border-2 border-[#D0D0E8] font-[family-name:var(--font-body)] text-xl"
              style={{ background: "#FFFFFF", color: "#101010" }}
            />
            <input
              type="number"
              placeholder="Hedef net (örn: 80)"
              value={hedef.net}
              onChange={(e) => setHedef(h => ({ ...h, net: e.target.value }))}
              className="w-full px-3 py-2 border-2 border-[#D0D0E8] font-[family-name:var(--font-body)] text-xl"
              style={{ background: "#FFFFFF", color: "#101010" }}
            />
            <PixelButton
              variant="secondary"
              className="w-full"
              onClick={hedefKaydet}
            >
              Hedefi Kaydet
            </PixelButton>
          </div>
        </PixelCard>

<div className="border-2 border-dashed border-[#2878F8] bg-[#F0E8D0] px-3 py-2">
          <p className="font-[family-name:var(--font-body)] text-sm text-[#484858]">
            ℹ️ Sınav seçimin yalnızca bu cihazda saklanır. İstediğin zaman değiştirebilirsin.
          </p>
        </div>

        {/* Detaylı Sayfalar */}
        <div className="grid grid-cols-2 gap-2">
          <Link href="/istatistik">
            <div className="border-2 border-[#2878F8] px-3 py-3 text-center cursor-pointer" style={{ background: "#F0E8D0", boxShadow: "3px 3px 0 0 #101010" }}>
              <span className="font-[family-name:var(--font-body)] text-lg text-[#2878F8]">📊 Tüm İstatistikler</span>
            </div>
          </Link>
          <Link href="/basarimlar">
            <div className="border-2 border-[#FFD000] px-3 py-3 text-center cursor-pointer" style={{ background: "#F0E8D0", boxShadow: "3px 3px 0 0 #101010" }}>
              <span className="font-[family-name:var(--font-body)] text-lg text-[#FFD000]">🏆 Tüm Başarımlar</span>
            </div>
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}
