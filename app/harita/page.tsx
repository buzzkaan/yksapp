"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { KATEGORILER, DERSLER, type KategoriAdi } from "@/lib/yks-categories";
import {
  DGS_BOLUMLER, KPSS_BOLUMLER, SINAV_META,
  type SinavTipi, type SinavBolum,
} from "@/lib/sinav-data";
import { getSinavTipi } from "@/lib/utils/sinav";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";

const LS_KONU_KEY = "yks_farm_konu_v1";

function getKonuData(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LS_KONU_KEY) ?? "{}"); } catch { return {}; }
}
function saveKonuData(data: Record<string, boolean>) {
  localStorage.setItem(LS_KONU_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("konu-data-updated"));
}

// ─── Genel İlerleme Özeti ─────────────────────────────────────────────────────

function GenelOzet({
  sinavTipi,
  bolumler,
}: {
  sinavTipi: SinavTipi;
  bolumler: { bolumKey: string; dersler: { key: string; konular: string[] }[] }[];
}) {
  let toplamKonu = 0;
  for (const b of bolumler) {
    for (const d of b.dersler) toplamKonu += d.konular.length;
  }

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handler = () => setRefreshKey((k) => k + 1);
    window.addEventListener("konu-data-updated", handler);
    return () => window.removeEventListener("konu-data-updated", handler);
  }, []);

  const toplamTamam = useMemo(() => {
    const data = getKonuData();
    let tamam = 0;
    for (const bolum of bolumler) {
      for (const ders of bolum.dersler) {
        ders.konular.forEach((_, i) => {
          if (data[`${sinavTipi}|${bolum.bolumKey}|${ders.key}|${i}`]) tamam++;
        });
      }
    }
    return tamam;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bolumler, sinavTipi, refreshKey]);

  const progress = toplamKonu > 0 ? (toplamTamam / toplamKonu) * 100 : 0;

  return (
    <div
      className="border-4 border-[#000000] p-3 bg-[#A8A8A8]"
      style={{ boxShadow: "4px 4px 0 0 #000000" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-lg text-[#FFD000]">
          📊 Genel İlerleme
        </span>
        <span className="font-body text-base text-[#6878A8]">
          {toplamTamam}/{toplamKonu} konu
        </span>
      </div>
      <div className="h-5 border-2 border-[#000000] bg-[#000058] w-full relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: "#00A800" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-body text-sm leading-none"
            style={{ color: progress > 50 ? "#fff" : "#6878A8" }}
          >
            %{Math.round(progress)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Ders Konu Takip Kartı ────────────────────────────────────────────────────

function DersKonuTakip({
  sinavTipi, bolumKey, dersKey, isim, icon, renk, konular, etiket,
}: {
  sinavTipi: string; bolumKey: string; dersKey: string;
  isim: string; icon: string; renk: string; konular: string[]; etiket?: string;
}) {
  const [acik, setAcik] = useState(false);
  const [tamamlanan, setTamamlanan] = useState<boolean[]>([]);
  const lsPrefix = `${sinavTipi}|${bolumKey}|${dersKey}`;

  useEffect(() => {
    const data = getKonuData();
    setTamamlanan(konular.map((_, i) => data[`${lsPrefix}|${i}`] ?? false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lsPrefix]);

  function toggleKonu(index: number) {
    const yeni = [...tamamlanan];
    yeni[index] = !yeni[index];
    setTamamlanan(yeni);
    const data = getKonuData();
    data[`${lsPrefix}|${index}`] = yeni[index];
    saveKonuData(data);
  }

  if (konular.length === 0) return null;

  const tamamSayi = tamamlanan.filter(Boolean).length;
  const progress = (tamamSayi / konular.length) * 100;
  const tamTamam = progress === 100;

  return (
    <div
      className="border-4 border-[#000000] bg-[#A8A8A8]"
      style={{ borderLeftColor: renk, borderLeftWidth: 8 }}
    >
      <button
        className="w-full flex items-center gap-3 p-3 hover:bg-[#909090] transition-colors text-left cursor-pointer"
        onClick={() => setAcik(!acik)}
      >
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-body text-lg text-[#FFD000] leading-tight">
              {isim}
            </span>
            {etiket && (
              <span
                className="font-body text-xs border-2 px-1.5 py-0.5 flex-shrink-0"
                style={{ borderColor: renk, color: renk }}
              >
                {etiket}
              </span>
            )}
            {tamTamam && (
              <span className="font-body text-xs border-2 border-[#00A800] text-[#00A800] px-1.5 py-0.5 flex-shrink-0">
                🏆 Clear!
              </span>
            )}
            <span className="ml-auto font-body text-sm text-[#6878A8] flex-shrink-0">
              {tamamSayi}/{konular.length}
            </span>
          </div>
          <div className="h-4 border-2 border-[#000000] bg-[#000058] w-full relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: tamTamam ? "#00A800" : renk }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-body text-xs leading-none"
                style={{ color: progress > 50 ? "#fff" : "#6878A8" }}
              >
                {tamTamam ? "✓ Tamamlandı!" : progress > 0 ? `%${Math.round(progress)}` : "Başlanmadı"}
              </span>
            </div>
          </div>
        </div>
        <span className="text-[#6878A8] text-sm flex-shrink-0 ml-1">{acik ? "▲" : "▼"}</span>
      </button>

      {acik && (
        <div className="border-t-2 border-[#000000]">
          {konular.map((konu, i) => {
            const tamam = tamamlanan[i] ?? false;
            return (
              <button
                key={i}
                onClick={() => toggleKonu(i)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors border-b border-[#000000] last:border-b-0 cursor-pointer ${
                  tamam ? "bg-[#006800] hover:bg-[#008800]" : "bg-[#000040] hover:bg-[#000058]"
                }`}
              >
                <span className={`text-lg flex-shrink-0 mt-0.5 transition-all ${tamam ? "opacity-100" : "opacity-25"}`}>
                  {tamam ? "✅" : "⬜"}
                </span>
                <span
                  className="font-body text-base leading-snug flex-1"
                  style={{
                    color: tamam ? "#00A800" : "#A8C8F8",
                    textDecoration: tamam ? "line-through" : "none",
                  }}
                >
                  {konu}
                </span>
                <span className="font-body text-xs text-[#6878A8] flex-shrink-0 mt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── YKS: TYT / AYT Bölüm Grubu ─────────────────────────────────────────────

function YksSinavGrubu({
  sinav, dersKeys, kategoriRenk,
}: {
  sinav: "TYT" | "AYT"; dersKeys: string[]; kategoriRenk: string;
}) {
  const isTyt = sinav === "TYT";
  const bgColor = isTyt ? "#006800" : "#000058";
  const borderColor = isTyt ? "#00A800" : "#2878F8";
  const label = isTyt ? "📚 TYT" : "🎓 AYT";
  const aciklama = isTyt
    ? "Temel Yeterlilik Testi — Tüm adaylar girer"
    : "Alan Yeterlilik Testi — Puan türüne göre";

  const gercekDersler = dersKeys.filter((dk) => {
    const ders = DERSLER[dk];
    if (!ders) return false;
    return (sinav === "TYT" ? ders.tytKonular : ders.aytKonular).length > 0;
  });

  if (gercekDersler.length === 0) return null;

  return (
    <div
      className="border-4 border-[#000000] overflow-hidden bg-[#A8A8A8]"
      style={{ boxShadow: "4px 4px 0 0 #000000" }}
    >
      <div
        className="px-3 py-2 flex items-center gap-3"
        style={{ backgroundColor: bgColor, borderBottom: `3px solid ${borderColor}` }}
      >
        <span
          className="font-pixel text-xs px-2 py-1"
          style={{ backgroundColor: kategoriRenk, color: "#FFF" }}
        >
          {label}
        </span>
        <span className="font-body text-sm text-[#FFD000]">{aciklama}</span>
        <span className="ml-auto font-body text-sm flex-shrink-0" style={{ color: borderColor }}>
          {gercekDersler.length} ders
        </span>
      </div>
      <div className="flex flex-col divide-y-2 divide-[#000000]">
        {gercekDersler.map((dk) => {
          const ders = DERSLER[dk];
          if (!ders) return null;
          return (
            <DersKonuTakip
              key={dk}
              sinavTipi="YKS"
              bolumKey={sinav}
              dersKey={dk}
              isim={ders.isim}
              icon={ders.icon}
              renk={ders.renk}
              konular={sinav === "TYT" ? ders.tytKonular : ders.aytKonular}
              etiket={sinav}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── DGS / KPSS Bölüm Grubu ──────────────────────────────────────────────────

function GenelSinavBolum({ bolum, sinavTipi }: { bolum: SinavBolum; sinavTipi: SinavTipi }) {
  return (
    <div
      className="border-4 border-[#000000] overflow-hidden bg-[#A8A8A8]"
      style={{ boxShadow: "4px 4px 0 0 #000000" }}
    >
      <div
        className="px-3 py-2 flex items-center gap-3"
        style={{ backgroundColor: bolum.renk + "33", borderBottom: `3px solid ${bolum.renk}` }}
      >
        <span
          className="font-pixel text-xs px-2 py-1"
          style={{ backgroundColor: bolum.renk, color: "#FFF" }}
        >
          {bolum.icon} {bolum.isim}
        </span>
        <span className="font-body text-sm text-[#FFD000] flex-1 truncate">
          {bolum.aciklama}
        </span>
        <span className="font-body text-sm text-[#6878A8] flex-shrink-0">
          {bolum.dersler.length} ders
        </span>
      </div>
      <div className="flex flex-col divide-y-2 divide-[#000000]">
        {bolum.dersler.map((ders) => (
          <DersKonuTakip
            key={ders.key}
            sinavTipi={sinavTipi}
            bolumKey={bolum.key}
            dersKey={ders.key}
            isim={ders.isim}
            icon={ders.icon}
            renk={ders.renk}
            konular={ders.konular}
            etiket={bolum.isim.split("—")[1]?.trim() ?? bolum.isim}
          />
        ))}
      </div>
    </div>
  );
}

// ─── YKS görünümü ─────────────────────────────────────────────────────────────

function YksView() {
  const [aktif, setAktif] = useState<KategoriAdi>("sayisal");
  const kategori = KATEGORILER[aktif];

  const tytBolum = {
    bolumKey: "TYT",
    dersler: kategori.tyt
      .filter((dk) => DERSLER[dk]?.tytKonular.length > 0)
      .map((dk) => ({ key: dk, konular: DERSLER[dk].tytKonular })),
  };
  const aytBolum = {
    bolumKey: "AYT",
    dersler: kategori.ayt
      .filter((dk) => DERSLER[dk]?.aytKonular.length > 0)
      .map((dk) => ({ key: dk, konular: DERSLER[dk].aytKonular })),
  };

  return (
    <>
      {/* Kategori tab seçici */}
      <div
        className="border-4 border-[#000000] grid grid-cols-3 overflow-hidden"
        style={{ boxShadow: "4px 4px 0 0 #000000" }}
      >
        {(Object.keys(KATEGORILER) as KategoriAdi[]).map((k) => {
          const kat = KATEGORILER[k];
          const isAktif = aktif === k;
          return (
            <button
              key={k}
              onClick={() => setAktif(k)}
              className={`py-3 flex flex-col items-center gap-1 border-r-4 last:border-r-0 border-[#000000] transition-all cursor-pointer ${
                isAktif ? "text-white" : "hover:opacity-80"
              }`}
              style={isAktif ? { background: kat.renk } : { background: "#A8A8A8", color: "#000000" }}
            >
              <span className="text-2xl leading-none">{kat.icon}</span>
              <span className="font-body text-lg leading-tight">{kat.label}</span>
              <span
                className="font-body text-xs px-1.5 py-0.5 border-2"
                style={
                  isAktif
                    ? { borderColor: "rgba(255,255,255,0.5)", color: "rgba(255,255,255,0.85)" }
                    : { borderColor: "#A8C8F8", color: "#6878A8" }
                }
              >
                {kat.tyt.length + kat.ayt.length} ders
              </span>
            </button>
          );
        })}
      </div>

      {/* Kategori açıklaması */}
      <div
        className="border-4 border-[#000000] p-3 flex items-center gap-3 bg-[#A8A8A8]"
        style={{ borderLeftColor: kategori.renk, borderLeftWidth: 8, boxShadow: "4px 4px 0 0 #000000" }}
      >
        <span className="text-3xl">{kategori.icon}</span>
        <div>
          <p className="font-body text-xl text-[#FFD000] leading-tight">
            {kategori.label} Puan Türü
          </p>
          <p className="font-body text-sm text-[#6878A8]">{kategori.aciklama}</p>
        </div>
      </div>

      <GenelOzet sinavTipi="YKS" bolumler={[tytBolum, aytBolum]} />

      {(aktif === "ea" || aktif === "dil") && (
        <div className="border-2 border-dashed border-[#2878F8] px-3 py-2 bg-[#000058]">
          <p className="font-body text-sm text-[#6878A8]">
            ℹ️ TDE, Tarih, Coğrafya ve Felsefe hem TYT hem AYT için gereklidir.
          </p>
        </div>
      )}

      <YksSinavGrubu sinav="TYT" dersKeys={kategori.tyt} kategoriRenk={kategori.renk} />
      <YksSinavGrubu sinav="AYT" dersKeys={kategori.ayt} kategoriRenk={kategori.renk} />

      <div className="border-2 border-dashed border-[#2878F8] px-3 py-2 bg-[#000058]">
        <p className="font-body text-xs text-[#6878A8]">
          ⚠️ Yabancı Dil kazanımları henüz mevcut değil.
        </p>
      </div>
    </>
  );
}

// ─── DGS / KPSS görünümü ─────────────────────────────────────────────────────

function GenelSinavView({
  bolumler, meta, sinavTipi,
}: {
  bolumler: SinavBolum[];
  meta: { icon: string; isim: string; tamIsim: string; aciklama: string; renk: string };
  sinavTipi: SinavTipi;
}) {
  const ozetBolumler = bolumler.map((b) => ({
    bolumKey: b.key,
    dersler: b.dersler.map((d) => ({ key: d.key, konular: d.konular })),
  }));

  return (
    <>
      <div
        className="border-4 border-[#000000] p-3 flex items-center gap-3 bg-[#A8A8A8]"
        style={{ borderLeftColor: meta.renk, borderLeftWidth: 8, boxShadow: "4px 4px 0 0 #000000" }}
      >
        <Image src={meta.icon} alt={meta.isim} width={36} height={36} className="w-9 h-9" />
        <div className="flex-1">
          <p className="font-body text-xl text-[#FFD000] leading-tight">{meta.tamIsim}</p>
          <p className="font-body text-sm text-[#6878A8]">{meta.aciklama}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-pixel text-base" style={{ color: meta.renk }}>{bolumler.length}</p>
          <p className="font-body text-xs text-[#6878A8]">bölüm</p>
        </div>
      </div>

      <GenelOzet sinavTipi={sinavTipi} bolumler={ozetBolumler} />

      {bolumler.map((bolum) => (
        <GenelSinavBolum key={bolum.key} bolum={bolum} sinavTipi={sinavTipi} />
      ))}
    </>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────

export default function HaritaPage() {
  const [sinavTipi, setSinavTipi] = useState<SinavTipi>("YKS");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSinavTipi(getSinavTipi());
    setMounted(true);
  }, []);

  const meta = SINAV_META[sinavTipi];

  if (!mounted) {
    return (
      <>
        <PageHeader icon="📚" title="KONULAR" subtitle="Yükleniyor..." />
        <PageContainer>
          <div className="text-center py-16">
            <p className="font-pixel text-[10px] text-[#6878A8] animate-pixel-blink">
              YÜKLENİYOR...
            </p>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <PageHeader icon="📚" title="KONULAR" subtitle={`${meta.isim} · Konuları tamamla, level atla!`} />
      <PageContainer>
        {sinavTipi === "YKS" && <YksView />}
        {sinavTipi === "DGS" && <GenelSinavView bolumler={DGS_BOLUMLER} meta={meta} sinavTipi="DGS" />}
        {sinavTipi === "KPSS" && <GenelSinavView bolumler={KPSS_BOLUMLER} meta={meta} sinavTipi="KPSS" />}
      </PageContainer>
    </>
  );
}
