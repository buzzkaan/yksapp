export const dynamic = "force-dynamic";

import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelLineChart } from "@/components/pixel/PixelLineChart";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { getIstatistik } from "@/server/actions/istatistik";
import { KonuIlerlemeClient } from "@/components/KonuIlerlemeClient";
import { formatSure as saat } from "@/lib/utils";

function pct(tamamlanan: number, toplam: number) {
  if (toplam === 0) return 0;
  return Math.round((tamamlanan / toplam) * 100);
}

// ─── Bölüm Başlığı ────────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="h-[3px] flex-1" style={{ background: "#101010" }} />
      <span
        className="font-pixel text-[9px] px-3 py-1.5 border-2 border-[#101010] whitespace-nowrap"
        style={{ background: "#101010", color: "#FFD000" }}
      >
        {icon} {title}
      </span>
      <div className="h-[3px] flex-1" style={{ background: "#101010" }} />
    </div>
  );
}

// ─── Pomodoro Kartı (koyu) ────────────────────────────────────────────────────

function PomoKart({
  label, sayi, dakika, renk,
}: {
  label: string; sayi: number; dakika: number; renk: string;
}) {
  return (
    <div
      className="border-4 border-[#101010] bg-[#181838] p-3 flex flex-col gap-1"
      style={{ boxShadow: "3px 3px 0 0 #080828" }}
    >
      <div className="font-pixel text-[8px] tracking-widest" style={{ color: "#505068" }}>
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-pixel text-2xl leading-none" style={{ color: renk }}>
          {sayi}
        </span>
        <span className="font-pixel text-[9px]" style={{ color: "#505068" }}>🍅</span>
      </div>
      <div className="font-body text-sm" style={{ color: "#606878" }}>
        {saat(dakika)}
      </div>
    </div>
  );
}

// ─── Görev Kartı (açık, progress bar'lı) ─────────────────────────────────────

function GorevKart({
  label, tamamlanan, toplam, renk,
}: {
  label: string; tamamlanan: number; toplam: number; renk: string;
}) {
  const oran = pct(tamamlanan, toplam);
  return (
    <div
      className="border-4 border-[#101010] bg-[#F8F0DC] p-3 flex flex-col gap-2"
      style={{ boxShadow: "3px 3px 0 0 #101010" }}
    >
      <div className="font-pixel text-[8px] tracking-widest" style={{ color: "#909090" }}>
        {label}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="font-pixel text-xl leading-none" style={{ color: renk }}>
            {tamamlanan}
          </span>
          <span className="font-body text-base text-[#909090]">/{toplam}</span>
        </div>
        <span className="font-pixel text-sm" style={{ color: renk }}>%{oran}</span>
      </div>
      <div className="h-2 border-2 border-[#101010] bg-[#D0D0E8] relative overflow-hidden">
        <div className="absolute inset-y-0 left-0" style={{ width: `${oran}%`, background: renk }} />
      </div>
    </div>
  );
}

// ─── Grafik Kartı ─────────────────────────────────────────────────────────────

function GrafikKart({
  title, data, color,
}: {
  title: string; data: { label: string; value: number }[]; color?: string;
}) {
  if (data.length < 2) return null;
  return (
    <PixelCard>
      <p className="font-body text-lg text-[#101010] mb-3">{title}</p>
      <PixelLineChart data={data} color={color} height={100} />
      <div className="flex justify-between mt-1.5">
        <span className="font-body text-xs text-[#606878]">{data[0]?.label}</span>
        <span className="font-body text-xs text-[#606878]">{data[data.length - 1]?.label}</span>
      </div>
    </PixelCard>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────

export default async function IstatistikPage() {
  const ist = await getIstatistik();

  const pomodoroGrafik = ist.grafik
    .map((g) => ({ label: g.label, value: Math.round((g.dakika / 60) * 10) / 10 }))
    .slice(-14);

  const gorevGrafik = ist.grafik
    .map((g) => ({ label: g.label, value: g.gorevTamam }))
    .slice(-14);

  const netGrafik = ist.denemeGrafik.map((d) => ({ label: d.label, value: d.net }));

  const yilToplam = ist.pomodoro.yil;
  const yilGorev  = ist.gorev.yil;

  // Haftalık günlük ortalama (dk/gün)
  const haftaGunlukOrt = Math.round(ist.pomodoro.hafta.dakika / 7);

  // Deneme trendi: son 5 vs genel ortalama
  const son5     = ist.denemeGrafik.slice(-5);
  const son5Ort  = son5.length > 0 ? son5.reduce((s, d) => s + d.net, 0) / son5.length : 0;
  const trendFark = son5Ort - ist.deneme.ortalamaNet;
  const trendLabel = trendFark > 1 ? "↑ yükseliyor" : trendFark < -1 ? "↓ düşüyor" : "→ stabil";
  const trendRenk  = trendFark > 1 ? "#18C840" : trendFark < -1 ? "#E01828" : "#F89000";

  return (
    <>
      <PageHeader icon="📊" title="İSTATİSTİKLER" subtitle="Performans analizi" />
      <PageContainer>

        {/* ── Yıllık Özet ── */}
        <div
          className="border-4 border-[#FFD000] bg-[#181838] p-4"
          style={{ boxShadow: "4px 4px 0 0 #504000" }}
        >
          <p className="font-pixel text-[9px] mb-4 tracking-widest" style={{ color: "#505068" }}>
            ★ BU YIL — GENEL ÖZET
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className="font-pixel text-3xl leading-none" style={{ color: "#FFD000" }}>
                {yilToplam.sayi}
              </div>
              <div className="font-body text-sm mt-0.5" style={{ color: "#8890B8" }}>
                🍅 toplam pomodoro
              </div>
            </div>
            <div>
              <div className="font-pixel text-3xl leading-none" style={{ color: "#18C840" }}>
                {saat(yilToplam.dakika)}
              </div>
              <div className="font-body text-sm mt-0.5" style={{ color: "#8890B8" }}>
                ⏱️ toplam çalışma
              </div>
            </div>
            <div>
              <div className="font-pixel text-3xl leading-none" style={{ color: "#2878F8" }}>
                {yilGorev.tamamlanan}
              </div>
              <div className="font-body text-sm mt-0.5" style={{ color: "#8890B8" }}>
                ✅ tamamlanan görev
              </div>
            </div>
            <div>
              <div className="font-pixel text-3xl leading-none" style={{ color: "#E01828" }}>
                {ist.deneme.toplam}
              </div>
              <div className="font-body text-sm mt-0.5" style={{ color: "#8890B8" }}>
                📝 girilen deneme
              </div>
            </div>
          </div>
        </div>

        {/* ── Pomodoro ── */}
        <SectionHeader icon="🍅" title="POMODORO" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <PomoKart label="BUGÜN" sayi={ist.pomodoro.gunluk.sayi} dakika={ist.pomodoro.gunluk.dakika} renk="#E01828" />
          <PomoKart label="HAFTA" sayi={ist.pomodoro.hafta.sayi}  dakika={ist.pomodoro.hafta.dakika}  renk="#F89000" />
          <PomoKart label="AY"    sayi={ist.pomodoro.ay.sayi}     dakika={ist.pomodoro.ay.dakika}     renk="#2878F8" />
          <PomoKart label="YIL"   sayi={ist.pomodoro.yil.sayi}    dakika={ist.pomodoro.yil.dakika}    renk="#18C840" />
        </div>

        {haftaGunlukOrt > 0 && (
          <div
            className="border-2 border-[#303058] bg-[#181838] px-4 py-2 flex items-center justify-between"
          >
            <span className="font-body text-sm" style={{ color: "#8890B8" }}>
              Bu hafta günlük ortalama çalışma
            </span>
            <span className="font-pixel text-sm" style={{ color: "#F89000" }}>
              {saat(haftaGunlukOrt)} / gün
            </span>
          </div>
        )}

        <GrafikKart
          title="⏱️ Günlük Çalışma Süresi — son 14 gün (saat)"
          data={pomodoroGrafik}
          color="#E01828"
        />

        {/* ── Görevler ── */}
        <SectionHeader icon="✅" title="GÖREVLER" />

        <div className="grid grid-cols-3 gap-2">
          <GorevKart label="BUGÜN" tamamlanan={ist.gorev.gunluk.tamamlanan} toplam={ist.gorev.gunluk.toplam} renk="#18C840" />
          <GorevKart label="HAFTA" tamamlanan={ist.gorev.hafta.tamamlanan}  toplam={ist.gorev.hafta.toplam}  renk="#F89000" />
          <GorevKart label="AY"    tamamlanan={ist.gorev.ay.tamamlanan}     toplam={ist.gorev.ay.toplam}     renk="#2878F8" />
        </div>

        <GrafikKart
          title="✅ Tamamlanan Görevler — son 14 gün"
          data={gorevGrafik}
          color="#18C840"
        />

        {/* ── Konu İlerlemesi ── */}
        <SectionHeader icon="📚" title="KONU İLERLEMESİ" />

        <PixelCard>
          <KonuIlerlemeClient />
        </PixelCard>

        {/* ── Denemeler ── */}
        <SectionHeader icon="📝" title="DENEMELER" />

        {ist.deneme.toplam === 0 ? (
          <PixelCard>
            <div className="text-center py-6">
              <p className="text-3xl mb-2">📝</p>
              <p className="font-body text-lg text-[#606878]">
                Henüz deneme kaydı yok.
              </p>
            </div>
          </PixelCard>
        ) : (
          <>
            {/* Performans spotlight */}
            <div
              className="border-4 border-[#101010] bg-[#181838] p-4"
              style={{ boxShadow: "3px 3px 0 0 #080828" }}
            >
              {/* Başlık + trend */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-pixel text-[9px] tracking-widest" style={{ color: "#505068" }}>
                  DENEME PERFORMANSI
                </span>
                {son5.length >= 3 && (
                  <span
                    className="font-pixel text-[9px] px-2 py-0.5 border-2"
                    style={{ borderColor: trendRenk, color: trendRenk }}
                  >
                    {trendLabel}
                  </span>
                )}
              </div>

              {/* 3 ana metrik */}
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div>
                  <div className="font-pixel text-2xl leading-none" style={{ color: "#FFD000" }}>
                    {ist.deneme.enYuksek.toFixed(1)}
                  </div>
                  <div className="font-body text-sm mt-1" style={{ color: "#505068" }}>en yüksek</div>
                </div>
                <div>
                  <div className="font-pixel text-2xl leading-none" style={{ color: "#18C840" }}>
                    {ist.deneme.ortalamaNet.toFixed(1)}
                  </div>
                  <div className="font-body text-sm mt-1" style={{ color: "#505068" }}>ortalama net</div>
                </div>
                <div>
                  <div className="font-pixel text-2xl leading-none" style={{ color: "#2878F8" }}>
                    {ist.deneme.toplam}
                  </div>
                  <div className="font-body text-sm mt-1" style={{ color: "#505068" }}>deneme sayısı</div>
                </div>
              </div>

              {/* Karşılaştırma barları */}
              {ist.deneme.enYuksek > 0 && (
                <div className="space-y-2 mb-4">
                  {[
                    { label: "En Yüksek", val: ist.deneme.enYuksek,  renk: "#FFD000" },
                    { label: "Ortalama",  val: ist.deneme.ortalamaNet, renk: "#18C840" },
                    ...(son5.length >= 3
                      ? [{ label: `Son ${son5.length}`, val: son5Ort, renk: trendRenk }]
                      : []),
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-2">
                      <span
                        className="font-body text-xs w-20 flex-shrink-0"
                        style={{ color: "#505068" }}
                      >
                        {row.label}
                      </span>
                      <div className="flex-1 h-3 border-2 border-[#303058] bg-[#101010] relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0"
                          style={{
                            width: `${Math.min(100, (row.val / ist.deneme.enYuksek) * 100)}%`,
                            background: row.renk,
                          }}
                        />
                      </div>
                      <span
                        className="font-pixel text-[9px] w-8 text-right flex-shrink-0"
                        style={{ color: row.renk }}
                      >
                        {row.val.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* TYT / AYT dağılımı */}
              <div className="border-t-2 border-[#303058] pt-3 flex gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ background: "#2878F8" }} />
                  <span className="font-body text-base" style={{ color: "#8890B8" }}>
                    TYT — {ist.deneme.tytSayi}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ background: "#E01828" }} />
                  <span className="font-body text-base" style={{ color: "#8890B8" }}>
                    AYT — {ist.deneme.aytSayi}
                  </span>
                </div>
              </div>
            </div>

            <GrafikKart title="📈 Net Trendi" data={netGrafik} color="#2878F8" />
          </>
        )}

      </PageContainer>
    </>
  );
}
