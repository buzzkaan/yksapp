"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { KATEGORILER, DERSLER, type KategoriAdi } from "@/lib/yks-categories";
import {
  type SinavTipi,
  type SinavBolum,
  SINAV_META,
  DGS_BOLUMLER,
  KPSS_BOLUMLER,
} from "@/lib/sinav-data";
import { getSinavTipi } from "@/lib/utils/sinav";

// ─── LocalStorage: konu takibi ────────────────────────────────────────────────
const LS_KONU_KEY = "yks_farm_konu_v1";

function getKonuData(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LS_KONU_KEY) ?? "{}"); } catch { return {}; }
}
function setKonuData(data: Record<string, boolean>) {
  localStorage.setItem(LS_KONU_KEY, JSON.stringify(data));
}

// ─── Ders Konu Takip Kartı ────────────────────────────────────────────────────
function DersKonuTakip({
  sinavTipi, bolumKey, dersKey,
  isim, icon, renk, konular, etiket,
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
    setKonuData(data);
  }

  if (konular.length === 0) return null;

  const tamamSayi = tamamlanan.filter(Boolean).length;
  const progress = (tamamSayi / konular.length) * 100;
  const tamTamam = progress === 100;

  return (
    <div
      className="border-4 border-[#101010] bg-[#F8F8F0]"
      style={{ borderLeftColor: renk, borderLeftWidth: 8 }}
    >
      {/* Başlık satırı */}
      <button
        className="w-full flex items-center gap-3 p-3 hover:bg-[#F0F0E8] transition-colors text-left cursor-pointer"
        onClick={() => setAcik(!acik)}
      >
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-[family-name:var(--font-body)] text-lg text-[#101010] leading-tight">
              {isim}
            </span>
            {etiket && (
              <span
                className="font-[family-name:var(--font-body)] text-xs border-2 px-1.5 py-0.5 flex-shrink-0"
                style={{ borderColor: renk, color: renk }}
              >
                {etiket}
              </span>
            )}
            {tamTamam && (
              <span className="font-[family-name:var(--font-body)] text-xs border-2 border-[#48B848] text-[#48B848] px-1.5 py-0.5 flex-shrink-0">
                🏆 Clear!
              </span>
            )}
            <span className="ml-auto font-[family-name:var(--font-body)] text-sm text-[#585868] flex-shrink-0">
              {tamamSayi}/{konular.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-4 border-2 border-[#101010] bg-[#181828] w-full relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: tamTamam ? "#48B848" : renk }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-[family-name:var(--font-body)] text-xs leading-none"
                style={{ color: progress > 50 ? "#fff" : "#585868" }}
              >
                {tamTamam ? "✓ Tamamlandı!" : progress > 0 ? `%${Math.round(progress)}` : "Başlanmadı"}
              </span>
            </div>
          </div>
        </div>
        <span className="text-[#585868] text-sm flex-shrink-0 ml-1">{acik ? "▲" : "▼"}</span>
      </button>

      {/* Konu listesi */}
      {acik && (
        <div className="border-t-2 border-[#C0C0D0]">
          {konular.map((konu, i) => {
            const tamam = tamamlanan[i] ?? false;
            return (
              <button
                key={i}
                onClick={() => toggleKonu(i)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors border-b border-[#C0C0D0] last:border-b-0 cursor-pointer ${tamam ? "bg-[#E0F0E0] hover:bg-[#D8F0D8]" : "bg-white hover:bg-[#F0F0F8]"
                  }`}
              >
                <span className={`text-lg flex-shrink-0 mt-0.5 transition-all ${tamam ? "opacity-100" : "opacity-25"}`}>
                  {tamam ? "✅" : "⬜"}
                </span>
                <span
                  className="font-[family-name:var(--font-body)] text-base leading-snug flex-1"
                  style={{
                    color: tamam ? "#18A018" : "#101010",
                    textDecoration: tamam ? "line-through" : "none",
                  }}
                >
                  {konu}
                </span>
                <span className="font-[family-name:var(--font-body)] text-xs text-[#585868] flex-shrink-0 mt-1">
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

// ─── Genel İlerleme Özeti ─────────────────────────────────────────────────────
function IlerlemOzeti({
  sinavTipi, bolumler,
}: {
  sinavTipi: SinavTipi;
  bolumler: { bolumKey: string; dersler: { key: string; konular: string[] }[] }[];
}) {
  const toplamKonu = bolumler.flatMap(b => b.dersler).flatMap(d => d.konular).length;

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
  }, [bolumler, sinavTipi]);

  const progress = toplamKonu > 0 ? (toplamTamam / toplamKonu) * 100 : 0;

  return (
    <div className="border-4 border-[#101010] p-3 bg-[#F8F8F0]" style={{ boxShadow: "4px 4px 0 0 #101010" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-[family-name:var(--font-body)] text-lg text-[#101010]">
          📊 Genel İlerleme
        </span>
        <span className="font-[family-name:var(--font-body)] text-base text-[#585868]">
          {toplamTamam}/{toplamKonu} konu
        </span>
      </div>
      <div className="h-5 border-2 border-[#101010] bg-[#181828] w-full relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: "#48B848" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-[family-name:var(--font-body)] text-sm leading-none"
            style={{ color: progress > 50 ? "#fff" : "#585868" }}
          >
            %{Math.round(progress)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── YKS: Sınav grubu (TYT / AYT blok) ──────────────────────────────────────
function YksSinavGrubu({ sinav, dersKeys, kategoriRenk }: {
  sinav: "TYT" | "AYT"; dersKeys: string[]; kategoriRenk: string;
}) {
  const isTyt = sinav === "TYT";
  const bgColor = isTyt ? "#E8F0E8" : "#E8E8F8";
  const borderColor = isTyt ? "#509050" : "#4060D0";
  const label = isTyt ? "📚 TYT" : "🎓 AYT";
  const aciklama = isTyt
    ? "Temel Yeterlilik Testi — Tüm adaylar girer"
    : "Alan Yeterlilik Testi — Puan türüne göre";

  const gercekDersler = dersKeys.filter((dk) => {
    const ders = DERSLER[dk];
    if (!ders) return false;
    const konular = sinav === "TYT" ? ders.tytKonular : ders.aytKonular;
    return konular.length > 0;
  });

  return (
    <div className="border-4 border-[#101010] overflow-hidden" style={{ boxShadow: "4px 4px 0 0 #101010" }}>
      <div
        className="px-3 py-2 flex items-center gap-3"
        style={{ backgroundColor: bgColor, borderBottom: `3px solid ${borderColor}` }}
      >
        <span
          className="font-[family-name:var(--font-pixel)] text-xs px-2 py-1"
          style={{ backgroundColor: kategoriRenk, color: "#FFF" }}
        >
          {label}
        </span>
        <span className="font-[family-name:var(--font-body)] text-sm text-[#101010]">
          {aciklama}
        </span>
        <span className="ml-auto font-[family-name:var(--font-body)] text-sm" style={{ color: borderColor }}>
          {gercekDersler.length} ders
        </span>
      </div>
      <div className="flex flex-col divide-y-2 divide-[#C0C0D0]">
        {gercekDersler.map((dk) => {
          const ders = DERSLER[dk];
          if (!ders) return null;
          const konular = sinav === "TYT" ? ders.tytKonular : ders.aytKonular;
          return (
            <DersKonuTakip
              key={dk}
              sinavTipi="YKS"
              bolumKey={sinav}
              dersKey={dk}
              isim={ders.isim}
              icon={ders.icon}
              renk={ders.renk}
              konular={konular}
              etiket={sinav}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── DGS/KPSS: Bölüm grubu ───────────────────────────────────────────────────
function GenelSinavBolum({ bolum, sinavTipi }: { bolum: SinavBolum; sinavTipi: SinavTipi }) {
  return (
    <div className="border-4 border-[#101010] overflow-hidden" style={{ boxShadow: "4px 4px 0 0 #101010" }}>
      <div
        className="px-3 py-2 flex items-center gap-3"
        style={{ backgroundColor: bolum.renk + "22", borderBottom: `3px solid ${bolum.renk}` }}
      >
        <span
          className="font-[family-name:var(--font-pixel)] text-xs px-2 py-1"
          style={{ backgroundColor: bolum.renk, color: "#FFF" }}
        >
          {bolum.icon} {bolum.isim}
        </span>
        <span className="font-[family-name:var(--font-body)] text-sm text-[#101010] flex-1 truncate">
          {bolum.aciklama}
        </span>
        <span className="font-[family-name:var(--font-body)] text-sm text-[#585868] flex-shrink-0">
          {bolum.dersler.length} ders
        </span>
      </div>
      <div className="flex flex-col divide-y-2 divide-[#C0C0D0]">
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
      .filter((dk) => DERSLER[dk] && DERSLER[dk].tytKonular.length > 0)
      .map((dk) => ({ key: dk, konular: DERSLER[dk].tytKonular })),
  };
  const aytBolum = {
    bolumKey: "AYT",
    dersler: kategori.ayt
      .filter((dk) => DERSLER[dk] && DERSLER[dk].aytKonular.length > 0)
      .map((dk) => ({ key: dk, konular: DERSLER[dk].aytKonular })),
  };

  return (
    <div className="p-3 flex flex-col gap-3 max-w-4xl mx-auto">
      {/* Kategori tab seçici */}
      <div className="border-4 border-[#101010] grid grid-cols-3 overflow-hidden" style={{ boxShadow: "4px 4px 0 0 #101010" }}>
        {(Object.keys(KATEGORILER) as KategoriAdi[]).map((k) => {
          const kat = KATEGORILER[k];
          const isAktif = aktif === k;
          const dersAdet = kat.tyt.length + kat.ayt.length;
          return (
            <button
              key={k}
              onClick={() => setAktif(k)}
              className={`py-3 flex flex-col items-center gap-1 border-r-4 last:border-r-0 border-[#101010] transition-all cursor-pointer ${isAktif ? "text-white" : "hover:opacity-80"
                }`}
              style={isAktif ? { background: kat.renk } : { background: "#F8F8F0", color: "#101010" }}
            >
              <span className="text-2xl leading-none">{kat.icon}</span>
              <span className="font-[family-name:var(--font-body)] text-lg leading-tight">{kat.label}</span>
              <span
                className="font-[family-name:var(--font-body)] text-xs px-1.5 py-0.5 border-2"
                style={
                  isAktif
                    ? { borderColor: "rgba(255,255,255,0.5)", color: "rgba(255,255,255,0.85)" }
                    : { borderColor: "#A0A8C0", color: "#585868" }
                }
              >
                {dersAdet} ders
              </span>
            </button>
          );
        })}
      </div>

      {/* Kategori açıklaması */}
      <div
        className="border-4 border-[#101010] p-3 flex items-center gap-3 bg-[#F8F8F0]"
        style={{ borderLeftColor: kategori.renk, borderLeftWidth: 8, boxShadow: "4px 4px 0 0 #101010" }}
      >
        <span className="text-3xl">{kategori.icon}</span>
        <div>
          <p className="font-[family-name:var(--font-body)] text-xl text-[#101010] leading-tight">
            {kategori.label} Puan Türü
          </p>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#585868]">
            {kategori.aciklama}
          </p>
        </div>
      </div>

      {/* Genel ilerleme */}
      <IlerlemOzeti sinavTipi="YKS" bolumler={[tytBolum, aytBolum]} />

      {(aktif === "ea" || aktif === "dil") && (
        <div className="border-2 border-dashed border-[#4088F0] px-3 py-2 bg-[#F0F0F8]">
          <p className="font-[family-name:var(--font-body)] text-sm text-[#585868]">
            ℹ️ TDE, Tarih, Coğrafya ve Felsefe hem TYT hem AYT için gereklidir.
          </p>
        </div>
      )}

      <YksSinavGrubu sinav="TYT" dersKeys={kategori.tyt} kategoriRenk={kategori.renk} />
      <YksSinavGrubu sinav="AYT" dersKeys={kategori.ayt} kategoriRenk={kategori.renk} />

      <div className="border-2 border-dashed border-[#4088F0] px-3 py-2 bg-[#F0F0F8]">
        <p className="font-[family-name:var(--font-body)] text-xs text-[#585868]">
          ⚠️ Yabancı Dil kazanımları henüz mevcut değil.
        </p>
      </div>
    </div>
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
    <div className="p-3 flex flex-col gap-3 max-w-4xl mx-auto">
      <div
        className="border-4 border-[#101010] p-3 flex items-center gap-3 bg-[#F8F8F0]"
        style={{ borderLeftColor: meta.renk, borderLeftWidth: 8, boxShadow: "4px 4px 0 0 #101010" }}
      >
        <Image src={meta.icon} alt={meta.isim} width={36} height={36} className="w-9 h-9" />
        <div className="flex-1">
          <p className="font-[family-name:var(--font-body)] text-xl text-[#101010] leading-tight">
            {meta.tamIsim}
          </p>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#585868]">
            {meta.aciklama}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-[family-name:var(--font-pixel)] text-base" style={{ color: meta.renk }}>
            {bolumler.length}
          </p>
          <p className="font-[family-name:var(--font-body)] text-xs text-[#585868]">bölüm</p>
        </div>
      </div>

      <IlerlemOzeti sinavTipi={sinavTipi} bolumler={ozetBolumler} />

      {bolumler.map((bolum) => (
        <GenelSinavBolum key={bolum.key} bolum={bolum} sinavTipi={sinavTipi} />
      ))}
    </div>
  );
}

// ─── Ana sayfa ────────────────────────────────────────────────────────────────
export default function SinavPage() {
  const sinavTipi = getSinavTipi();
  const meta = SINAV_META[sinavTipi];

  return (
    <div className="min-h-screen" style={{ background: "#E8E0D0" }}>
      {/* Header */}
      <div
        className="border-b-4 border-[#4088F0] px-4 py-4"
        style={{ background: "#181828", boxShadow: "0 4px 0 0 #080818" }}
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="font-[family-name:var(--font-pixel)] text-xs text-[#F8D030] leading-tight flex items-center gap-1" style={{ textShadow: "2px 2px 0 #504000" }}>
              <Image src={meta.icon} alt={meta.isim} width={14} height={14} className="w-3.5 h-3.5" />
              {meta.isim} KAZANIMLARI
            </h1>
            <p className="font-[family-name:var(--font-body)] text-base text-[#A0A8C0] mt-1">
              Konuları tamamla, level atla!
            </p>
          </div>
          <Link
            href="/ayarlar"
            className="flex flex-col items-center gap-0.5 border-2 border-[#A0A8C0] px-2 py-1 hover:bg-[#282838] transition-colors cursor-pointer"
          >
            <span className="text-lg">⚙️</span>
            <span className="font-[family-name:var(--font-body)] text-xs text-[#A0A8C0]">
              Değiştir
            </span>
          </Link>
        </div>
        <div className="mt-2 max-w-4xl mx-auto">
          <span
            className="inline-flex items-center gap-1 border-2 px-2 py-0.5"
            style={{ borderColor: meta.renk, color: meta.renk }}
          >
            <Image src={meta.icon} alt={meta.isim} width={16} height={16} className="w-4 h-4" />
            <span className="font-[family-name:var(--font-body)] text-base">
              {meta.isim} modunda çalışıyorsun
            </span>
          </span>
        </div>
      </div>

      {sinavTipi === "YKS" && <YksView />}
      {sinavTipi === "DGS" && (
        <GenelSinavView bolumler={DGS_BOLUMLER} meta={meta} sinavTipi="DGS" />
      )}
      {sinavTipi === "KPSS" && (
        <GenelSinavView bolumler={KPSS_BOLUMLER} meta={meta} sinavTipi="KPSS" />
      )}
    </div>
  );
}
