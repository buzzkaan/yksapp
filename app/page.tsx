export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { PixelButton } from "@/components/pixel/PixelButton";
import { SinavGeriSayim } from "@/components/features/SinavGeriSayim";
import { bugunPomodorolariGetir } from "@/server/actions/pomodoro";
import { bugunGorevleriGetir, tamamlananGunleriGetir } from "@/server/actions/takvim";
import { denemeleriGetir } from "@/server/actions/denemeler";
import { getOzetIstatistik } from "@/server/actions/istatistik";
import { AYLAR_TAM, GUNLER_TAM } from "@/lib/constants/ui";
import { ICONS } from "@/lib/constants/icons";
import { hesaplaStreak } from "@/lib/utils/date";
import type { DenemeWithDetay, Gorev, PomodoroOturum } from "@/lib/types";

// ─── Yardımcılar ──────────────────────────────────────────────────────────────

function saat(dakika: number) {
  if (dakika === 0) return null;
  if (dakika < 60) return `${dakika}dk`;
  const h = Math.floor(dakika / 60);
  const m = dakika % 60;
  return m > 0 ? `${h}s ${m}dk` : `${h}s`;
}

const ALINTILAR = [
  "Bir adım at, hedefe bir adım daha yaklaş.",
  "Küçük adımlar, büyük sonuçlar doğurur.",
  "Mükemmellik değil, ilerleme önemli.",
  "Başarı, birikmiş küçük çabaların sonucudur.",
  "Bugün ektiğin tohumlar yarın filizlenir.",
  "Her çalıştığın dakika fark yaratır.",
];

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { userId } = await auth();

  let pomodorolar: PomodoroOturum[] = [];
  let gorevler: Gorev[] = [];
  let denemeler: DenemeWithDetay[] = [];
  let streakDates: string[] = [];
  let istatistik = {
    bugunGorev: { toplam: 0, tamamlanan: 0 },
    haftaGorev: { toplam: 0, tamamlanan: 0 },
    ayGorev:    { toplam: 0, tamamlanan: 0 },
    haftaPomodoro: 0,
  };

  if (userId) {
    [pomodorolar, gorevler, denemeler, streakDates, istatistik] = await Promise.all([
      bugunPomodorolariGetir(),
      bugunGorevleriGetir(),
      denemeleriGetir(),
      tamamlananGunleriGetir(),
      getOzetIstatistik(),
    ]);
  }

  const now         = new Date();
  const tarihStr    = `${now.getDate()} ${AYLAR_TAM[now.getMonth()]}`;
  const gunStr      = GUNLER_TAM[now.getDay()];
  const bugunPomo   = pomodorolar.length;
  const bugunDakika = bugunPomo * 25; // ~25dk/oturum tahmini
  const sonDeneme   = denemeler[0] ?? null;
  const tamamlananGorev = gorevler.filter((g: Gorev) => g.tamamlandi).length;
  const toplamGorev     = gorevler.length;
  const gorevPct        = toplamGorev > 0 ? Math.round((tamamlananGorev / toplamGorev) * 100) : 0;
  const gorevProgress   = toplamGorev > 0 ? (tamamlananGorev / toplamGorev) * 100 : 0;
  const streakInfo  = hesaplaStreak(streakDates);
  const alinti      = ALINTILAR[now.getDate() % ALINTILAR.length];

  // Header badges
  const headerAction = (
    <div className="flex items-center gap-2">
      {bugunPomo > 0 && (
        <div
          className="flex items-center gap-1.5 px-2 py-1"
          style={{ background: "#101010", border: "2px solid #FFD000" }}
        >
          <span className="text-sm">🍅</span>
          <span className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#FFD000" }}>
            {bugunPomo}× COMBO
          </span>
        </div>
      )}
      {streakInfo.current > 0 && (
        <div
          className="flex items-center gap-1.5 px-2 py-1"
          style={{ background: "#FFD000", border: "2px solid #101010" }}
        >
          <span className="text-sm">🔥</span>
          <span className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#101010" }}>
            {streakInfo.current} GÜN
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        icon="⚔️"
        title="YKS QUEST"
        subtitle={`${gunStr} · ${tarihStr}`}
        action={headerAction}
      />
      <PageContainer>

        {/* ── Sınav Geri Sayım ── */}
        <SinavGeriSayim />

        {/* ── Giriş yoksa ── */}
        {!userId && (
          <div
            className="border-4 border-[#2878F8] px-4 py-4 text-center"
            style={{ background: "#F0F4FF", boxShadow: "4px 4px 0 0 #101010" }}
          >
            <p className="font-[family-name:var(--font-body)] text-xl text-[#101010] mb-3">
              🔐 Verilerini görmek için giriş yap!
            </p>
            <Link href="/sign-in">
              <PixelButton variant="primary">Giriş Yap →</PixelButton>
            </Link>
          </div>
        )}

        {/* ── Bugünün Özeti ── */}
        {userId && (
          <div
            className="border-4 border-[#101010] overflow-hidden"
            style={{ boxShadow: "4px 4px 0 0 #101010" }}
          >
            {/* Başlık */}
            <div
              className="px-4 py-2 border-b-4 border-[#101010] flex items-center justify-between"
              style={{ background: "#101010" }}
            >
              <span className="font-[family-name:var(--font-pixel)] text-[10px] tracking-widest" style={{ color: "#FFD000" }}>
                ★ BUGÜN
              </span>
              <span className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#505068" }}>
                {gunStr}
              </span>
            </div>

            {/* 3 kolon */}
            <div className="grid grid-cols-3 divide-x-4 divide-[#101010]" style={{ background: "#F8F0DC" }}>

              {/* Pomodoro */}
              <div className="flex flex-col items-center justify-center px-2 py-4 gap-1 text-center">
                <span className="font-[family-name:var(--font-pixel)] text-[8px] tracking-widest" style={{ color: "#6878A8" }}>
                  POMODORO
                </span>
                <span
                  className="font-[family-name:var(--font-pixel)] text-3xl leading-none"
                  style={{ color: bugunPomo > 0 ? "#E01828" : "#D0C8B8" }}
                >
                  {bugunPomo > 0 ? bugunPomo : "—"}
                </span>
                <span className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#606878" }}>
                  {bugunPomo > 0 ? (saat(bugunDakika) ?? `${bugunPomo}×`) : "henüz yok"}
                </span>
              </div>

              {/* Görevler */}
              <div className="flex flex-col items-center justify-center px-3 py-4 gap-1.5 text-center">
                <span className="font-[family-name:var(--font-pixel)] text-[8px] tracking-widest" style={{ color: "#6878A8" }}>
                  GÖREVLER
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-[family-name:var(--font-pixel)] text-3xl leading-none"
                    style={{ color: toplamGorev === 0 ? "#D0C8B8" : tamamlananGorev === toplamGorev ? "#18C840" : "#2878F8" }}
                  >
                    {toplamGorev === 0 ? "—" : tamamlananGorev}
                  </span>
                  {toplamGorev > 0 && (
                    <span className="font-[family-name:var(--font-body)] text-base" style={{ color: "#6878A8" }}>
                      /{toplamGorev}
                    </span>
                  )}
                </div>
                {toplamGorev > 0 ? (
                  <>
                    <div className="w-full h-2 border-2 border-[#101010] bg-[#D0C8B8] relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0"
                        style={{
                          width: `${gorevPct}%`,
                          background: tamamlananGorev === toplamGorev ? "#18C840" : "#2878F8",
                        }}
                      />
                    </div>
                    <span className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#606878" }}>
                      %{gorevPct} tamamlandı
                    </span>
                  </>
                ) : (
                  <span className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#606878" }}>
                    görev yok
                  </span>
                )}
              </div>

              {/* Son Deneme */}
              <div className="flex flex-col items-center justify-center px-2 py-4 gap-1 text-center">
                <span className="font-[family-name:var(--font-pixel)] text-[8px] tracking-widest" style={{ color: "#6878A8" }}>
                  SON DENEME
                </span>
                <span
                  className="font-[family-name:var(--font-pixel)] text-3xl leading-none"
                  style={{ color: sonDeneme ? "#18C840" : "#D0C8B8" }}
                >
                  {sonDeneme ? sonDeneme.net.toFixed(1) : "—"}
                </span>
                <span className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#606878" }}>
                  {sonDeneme
                    ? `${sonDeneme.tur} · ${new Date(sonDeneme.tarih).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" })}`
                    : "henüz yok"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Bugünün Görevleri ── */}
        <PixelCard>
          <div className="flex items-center justify-between mb-3">
            <span
              className="font-[family-name:var(--font-pixel)] text-[10px] tracking-widest"
              style={{ color: "#101010" }}
            >
              📋 BUGÜNÜN GÖREVLERİ
            </span>
            <Link href="/todo">
              <span
                className="font-[family-name:var(--font-body)] text-lg"
                style={{ color: "#2878F8", borderBottom: "2px dotted #2878F8" }}
              >
                tümü →
              </span>
            </Link>
          </div>

          {toplamGorev === 0 ? (
            <div
              className="border-2 border-dashed border-[#C0B090] px-4 py-5 text-center"
              style={{ background: "#F0E8D4" }}
            >
              <p className="font-[family-name:var(--font-pixel)] text-[9px] mb-2" style={{ color: "#A09070" }}>
                [ GÖREV PANOSU BOŞ ]
              </p>
              <Link href="/todo">
                <span
                  className="font-[family-name:var(--font-body)] text-xl"
                  style={{ color: "#2878F8", borderBottom: "2px dotted #2878F8" }}
                >
                  Takvimden görev ekle →
                </span>
              </Link>
            </div>
          ) : (
            <>
              <PixelProgress value={gorevProgress} showPercent size="lg" hpLabel="QUEST" />
              <div className="flex flex-col gap-1.5 mt-3">
                {gorevler.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center gap-2.5 border-2 px-3 py-2"
                    style={{
                      borderColor: g.tamamlandi ? "#B0D8A0" : "#D0C8B8",
                      background:  g.tamamlandi ? "#E8F4E0" : "#FAF4E8",
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 flex-shrink-0 border border-[#10101040]"
                      style={{ background: g.renk }}
                    />
                    <span
                      className="font-[family-name:var(--font-body)] text-xl flex-1 leading-tight"
                      style={{
                        color: g.tamamlandi ? "#70A060" : "#202030",
                        textDecoration: g.tamamlandi ? "line-through" : "none",
                      }}
                    >
                      {g.baslik}
                    </span>
                    {g.oncelik === 3 && (
                      <span className="font-[family-name:var(--font-pixel)] text-[8px]" style={{ color: "#E01828" }}>!</span>
                    )}
                    <span
                      className="font-[family-name:var(--font-pixel)] text-[10px]"
                      style={{ color: g.tamamlandi ? "#18C840" : "#C0B890" }}
                    >
                      {g.tamamlandi ? "✓" : "○"}
                    </span>
                  </div>
                ))}
              </div>
              {tamamlananGorev === toplamGorev && toplamGorev > 0 && (
                <div
                  className="mt-3 border-2 border-[#18C840] px-3 py-2 text-center"
                  style={{ background: "#D4ECC8" }}
                >
                  <span className="font-[family-name:var(--font-body)] text-xl" style={{ color: "#18C840" }}>
                    🏆 Tüm görevler tamamlandı!
                  </span>
                </div>
              )}
            </>
          )}
        </PixelCard>

        {/* ── Hızlı Başlat ── */}
        <div
          className="border-4 border-[#101010] bg-[#181838] p-4"
          style={{ boxShadow: "4px 4px 0 0 #101010" }}
        >
          <p
            className="font-[family-name:var(--font-pixel)] text-[10px] mb-4 tracking-widest"
            style={{ color: "#FFD000" }}
          >
            ▶ HIZLI BAŞLAT
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/pomodoro">
              <PixelButton variant="primary" className="w-full justify-center gap-2 font-[family-name:var(--font-body)] text-xl">
                <Image src={ICONS.hourglass} alt="" width={18} height={18} className="w-4 h-4" />
                Pomodoro
              </PixelButton>
            </Link>
            <Link href="/harita">
              <PixelButton variant="secondary" className="w-full justify-center gap-2 font-[family-name:var(--font-body)] text-xl">
                <Image src={ICONS.note} alt="" width={18} height={18} className="w-4 h-4" />
                Konular
              </PixelButton>
            </Link>
            <Link href="/denemeler">
              <PixelButton variant="ghost" className="w-full justify-center gap-2 font-[family-name:var(--font-body)] text-xl">
                <Image src={ICONS.docs} alt="" width={18} height={18} className="w-4 h-4" />
                Deneme
              </PixelButton>
            </Link>
            <Link href="/program">
              <PixelButton variant="ghost" className="w-full justify-center gap-2 font-[family-name:var(--font-body)] text-xl">
                <Image src={ICONS.calendar} alt="" width={18} height={18} className="w-4 h-4" />
                Program
              </PixelButton>
            </Link>
          </div>
        </div>

        {/* ── Haftalık Özet ── */}
        {userId && (
          <div className="grid grid-cols-2 gap-2">
            <div
              className="border-4 border-[#101010] p-3 flex flex-col gap-1"
              style={{ background: "#F8F0DC", boxShadow: "3px 3px 0 0 #101010" }}
            >
              <span className="font-[family-name:var(--font-pixel)] text-[8px] tracking-widest" style={{ color: "#6878A8" }}>
                BU HAFTA · GÖREV
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#F89000" }}>
                  {istatistik.haftaGorev.tamamlanan}
                </span>
                <span className="font-[family-name:var(--font-body)] text-base" style={{ color: "#6878A8" }}>
                  /{istatistik.haftaGorev.toplam} tamamlandı
                </span>
              </div>
              {istatistik.haftaGorev.toplam > 0 && (
                <div className="h-1.5 border-2 border-[#101010] bg-[#D0C8B8] relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${Math.round((istatistik.haftaGorev.tamamlanan / istatistik.haftaGorev.toplam) * 100)}%`,
                      background: "#F89000",
                    }}
                  />
                </div>
              )}
            </div>

            <div
              className="border-4 border-[#101010] p-3 flex flex-col gap-1"
              style={{ background: "#F8F0DC", boxShadow: "3px 3px 0 0 #101010" }}
            >
              <span className="font-[family-name:var(--font-pixel)] text-[8px] tracking-widest" style={{ color: "#6878A8" }}>
                BU HAFTA · POMODORO
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#E01828" }}>
                  {istatistik.haftaPomodoro}
                </span>
                <span className="font-[family-name:var(--font-body)] text-base" style={{ color: "#6878A8" }}>
                  oturum
                </span>
              </div>
              <span className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#606878" }}>
                {istatistik.haftaPomodoro > 0
                  ? `≈ ${saat(istatistik.haftaPomodoro * 25) ?? `${istatistik.haftaPomodoro * 25}dk`} çalışma`
                  : "Bu hafta henüz yok"}
              </span>
            </div>
          </div>
        )}

        {/* ── Motivasyon ── */}
        <div className="text-center py-1">
          <p className="font-[family-name:var(--font-body)] text-base" style={{ color: "#fff", textShadow: "1px 1px 0 rgba(0,0,0,0.4)" }}>
            💬 {alinti}
          </p>
        </div>

      </PageContainer>
    </>
  );
}
