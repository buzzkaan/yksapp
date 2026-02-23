export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { PixelButton } from "@/components/pixel/PixelButton";
import { SinavGeriSayim } from "@/components/features/SinavGeriSayim";
import { bugunPomodorolariGetir } from "@/server/actions/pomodoro";
import { bugunGorevleriGetir, tamamlananGunleriGetir } from "@/server/actions/takvim";
import { denemeleriGetir } from "@/server/actions/denemeler";
import { derslerGetir } from "@/server/actions/konular";
import { getOzetIstatistik } from "@/server/actions/istatistik";
import { AYLAR_TAM, GUNLER_TAM } from "@/lib/constants/ui";
import { SINAV_META } from "@/lib/sinav-data";
import { hesaplaStreak } from "@/lib/utils/date";
import type { DersWithKonular, DenemeWithDetay, Gorev, PomodoroOturum } from "@/lib/types";

function weatherIcon(n: number) {
  if (n >= 8) return "⚡";
  if (n >= 4) return "🔥";
  if (n >= 1) return "⭐";
  return "💤";
}

const ALINTILAR = [
  "Bir adım at, hedefine bir adım daha yaklaş! 👣",
  "Bugün çalışan yarın kazanır! 🏆",
  "Küçük adımlar, büyük sonuçlar! 🌟",
  "Mükemmellik değil, ilerleme önemli! 📈",
  "Her gün biraz daha iyi! 💪",
  "Başarı, birikmiş küçük çabaların sonucudur! 🎯",
];

function getRandomAlinti(): string {
  return ALINTILAR[Math.floor(Math.random() * ALINTILAR.length)];
}

export default async function HomePage() {
  const [pomodorolar, gorevler, denemeler, dersler, streakDates, istatistik]: [
    PomodoroOturum[],
    Gorev[],
    DenemeWithDetay[],
    DersWithKonular[],
    string[],
    { bugunGorev: { toplam: number; tamamlanan: number }; haftaGorev: { toplam: number; tamamlanan: number }; ayGorev: { toplam: number; tamamlanan: number }; haftaPomodoro: number }
  ] = await Promise.all([
    bugunPomodorolariGetir(),
    bugunGorevleriGetir(),
    denemeleriGetir(),
    derslerGetir(),
    tamamlananGunleriGetir(),
    getOzetIstatistik(),
  ]);

  const now = new Date();
  const tarihStr = `${now.getDate()} ${AYLAR_TAM[now.getMonth()]}`;
  const gunStr = GUNLER_TAM[now.getDay()];
  const bugunPomodoro = pomodorolar.length;
  const tumKonular = dersler.flatMap((d: DersWithKonular) => d.konular);
  const tamamlananKonular = tumKonular.filter((k) => k.tamamlandi).length;
  const toplamKonular = tumKonular.length;
  const sonDeneme = denemeler[0];
  const tamamlananGorev = gorevler.filter((g: Gorev) => g.tamamlandi).length;
  const toplamGorev = gorevler.length;
  const gorevProgress = toplamGorev > 0 ? (tamamlananGorev / toplamGorev) * 100 : 0;
  const streakInfo = hesaplaStreak(streakDates);
  const alinti = getRandomAlinti();

  return (
    <div className="flex flex-col py-4 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-3">

        {/* ── Game HUD Header ──────────────────────────────────────────── */}
        <div
          className="relative border-4 border-[#101010] px-5 py-4"
          style={{
            background: "#181838",
            boxShadow: "4px 4px 0 0 #101010",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1
                className="font-[family-name:var(--font-pixel)] leading-tight flex items-center gap-1"
                style={{ fontSize: "14px", color: "#FFD000", textShadow: "2px 2px 0 #504000", letterSpacing: "0.1em" }}
              >
                <Image src="/icon/flag.png" alt="quest" width={16} height={16} className="w-4 h-4" />
                YKS QUEST
              </h1>
              <p className="font-[family-name:var(--font-body)] text-2xl mt-1" style={{ color: "#8890B8" }}>
                {weatherIcon(bugunPomodoro)} {gunStr} · {tarihStr}
              </p>

              {bugunPomodoro > 0 && (
                <div
                  className="mt-2 inline-flex items-center gap-1.5 border-2 border-[#FFD000] px-3 py-1"
                  style={{ background: "#101010" }}
                >
                  <span>🔥</span>
                  <span className="font-[family-name:var(--font-body)] text-lg" style={{ color: "#FFD000" }}>
                    {bugunPomodoro} oturum — combo!
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              {/* Streak göstergeleri */}
              {streakInfo.current > 0 && (
                <div className="flex items-center gap-1 px-2 py-1" style={{ background: "#FFD000", border: "2px solid #101010", boxShadow: "2px 2px 0 0 #504000" }}>
                  <span className="text-sm">🔥</span>
                  <span className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#101010" }}>
                    {streakInfo.current} gün
                  </span>
                </div>
              )}
              {streakInfo.best > 0 && (
                <div className="flex items-center gap-1 px-2 py-1" style={{ background: "#101010", border: "2px solid #FFD000" }}>
                  <span className="text-sm">🏆</span>
                  <span className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#FFD000" }}>
                    {streakInfo.best} REKOR
                  </span>
                </div>
              )}
              <Link href="/ayarlar" className="w-6 h-6 mt-1 opacity-70 hover:opacity-100 transition-opacity relative">
                <Image src="/icon/flag.png" alt="ayarlar" fill className="object-contain" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Sınav geri sayım ─────────────────────────────────────────── */}
        <SinavGeriSayim />

        {/* ── Motivasyon ──────────────────────────────────────────────── */}
        <div
          className="border-3 border-[#FFD000] px-4 py-3 text-center"
          style={{ background: "#101010", boxShadow: "3px 3px 0 0 #504000" }}
        >
          <p className="font-[family-name:var(--font-body)] text-lg" style={{ color: "#FFD000" }}>
            💬 {alinti}
          </p>
        </div>

        {/* ── İstatistik özeti ────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2">
          <div className="border-3 border-[#101010] p-2 text-center" style={{ background: "#F8F0DC", boxShadow: "3px 3px 0 0 #101010" }}>
            <div className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>BUGÜN</div>
            <div className="font-[family-name:var(--font-pixel)] text-xl" style={{ color: "#2878F8" }}>{istatistik.bugunGorev.toplam}</div>
            <div className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#18C840" }}>{istatistik.bugunGorev.tamamlanan} ✓</div>
          </div>
          <div className="border-3 border-[#101010] p-2 text-center" style={{ background: "#F8F0DC", boxShadow: "3px 3px 0 0 #101010" }}>
            <div className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>HAFTA</div>
            <div className="font-[family-name:var(--font-pixel)] text-xl" style={{ color: "#F89000" }}>{istatistik.haftaGorev.toplam}</div>
            <div className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#18C840" }}>{istatistik.haftaGorev.tamamlanan} ✓</div>
          </div>
          <div className="border-3 border-[#101010] p-2 text-center" style={{ background: "#F8F0DC", boxShadow: "3px 3px 0 0 #101010" }}>
            <div className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>POMODORO</div>
            <div className="font-[family-name:var(--font-pixel)] text-xl" style={{ color: "#E01828" }}>{istatistik.haftaPomodoro}</div>
            <div className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#484858" }}>bu hafta</div>
          </div>
          <div className="border-3 border-[#101010] p-2 text-center" style={{ background: "#F8F0DC", boxShadow: "3px 3px 0 0 #101010" }}>
            <div className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>KONULAR</div>
            <div className="font-[family-name:var(--font-pixel)] text-xl" style={{ color: "#18C840" }}>{tamamlananKonular}</div>
            <div className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#484858" }}>/ {toplamKonular}</div>
          </div>
        </div>

        {/* ── Stat grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <PixelCard variant="dark" className="text-center p-3">
            <div className="text-3xl mb-1">⭐</div>
            <div className="font-[family-name:var(--font-pixel)] text-2xl text-[#18C840]">
              {bugunPomodoro}
            </div>
            <div className="font-[family-name:var(--font-body)] text-base text-[#8890B8]">
              oturum
            </div>
          </PixelCard>

          <PixelCard variant="dark" className="text-center p-3">
            <div className="text-3xl mb-1">📖</div>
            <div className="font-[family-name:var(--font-pixel)] text-2xl text-[#FFD000]">
              {tamamlananKonular}
            </div>
            {toplamKonular > 0 && (
              <div className="font-[family-name:var(--font-body)] text-sm text-[#484858]">
                / {toplamKonular} konu
              </div>
            )}
          </PixelCard>

          <PixelCard variant="dark" className="text-center p-3">
            <div className="w-8 h-8 mx-auto mb-1 relative">
              <Image src="/icon/docs.png" alt="deneme" fill className="object-contain" />
            </div>
            {sonDeneme ? (
              <>
                <div className="font-[family-name:var(--font-pixel)] text-[9px] text-[#484858]">
                  {sonDeneme.tur}
                </div>
                <div className="font-[family-name:var(--font-body)] text-xl text-[#18C840] mt-0.5">
                  {sonDeneme.net.toFixed(1)} net
                </div>
              </>
            ) : (
              <div className="font-[family-name:var(--font-body)] text-base text-[#484858]">
                henüz yok
              </div>
            )}
          </PixelCard>
        </div>

        {/* ── Görev progress ───────────────────────────────────────────── */}
        <PixelCard>
          <div className="flex items-center justify-between mb-3">
            <span className="font-[family-name:var(--font-body)] text-2xl text-[#101010]">
              ⚔️ Bugünün Görevleri
            </span>
            <span className="font-[family-name:var(--font-pixel)] text-[9px] border-2 border-[#101010] px-2 py-1">
              {tamamlananGorev}/{toplamGorev}
            </span>
          </div>
          <PixelProgress value={gorevProgress} showPercent size="lg" hpLabel="QUEST" />
          {toplamGorev === 0 && (
            <p className="font-[family-name:var(--font-body)] text-lg text-[#484858] mt-2">
              ✦ Takvimden görev ekleyebilirsin!
            </p>
          )}
          {toplamGorev > 0 && tamamlananGorev === toplamGorev && (
            <p className="font-[family-name:var(--font-body)] text-xl text-[#18C840] mt-2 animate-pixel-float">
              🏆 Harika! Tüm görevler tamamlandı!
            </p>
          )}
        </PixelCard>

        {/* ── Hızlı başlat ─────────────────────────────────────────────── */}
        <PixelCard variant="dark">
          <p
            className="font-[family-name:var(--font-pixel)] mb-4"
            style={{ fontSize: "10px", color: "#FFD000", textShadow: "1px 1px 0 #504000", letterSpacing: "0.08em" }}
          >
            ▶ HIZLI BAŞLAT
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/pomodoro">
              <PixelButton variant="primary" className="w-full justify-center">
                ⏱️ Pomodoro
              </PixelButton>
            </Link>
            <Link href="/todo">
              <PixelButton variant="secondary" className="w-full justify-center">
                ⚔️ Konular
              </PixelButton>
            </Link>
            <Link href="/denemeler">
              <PixelButton variant="ghost" className="w-full justify-center gap-2">
                <Image src="/icon/docs.png" alt="deneme" width={16} height={16} className="w-4 h-4" />
                Deneme
              </PixelButton>
            </Link>
            <Link href="/todo">
              <PixelButton variant="ghost" className="w-full justify-center gap-2">
                <Image src="/icon/calendar.png" alt="takvim" width={16} height={16} className="w-4 h-4" />
                Takvim
              </PixelButton>
            </Link>
          </div>
        </PixelCard>

        {/* ── Son denemeler ────────────────────────────────────────────── */}
        {denemeler.length > 0 && (
          <PixelCard>
            <div className="flex items-center justify-between mb-3">
              <p className="font-[family-name:var(--font-body)] text-2xl text-[#101010] flex items-center gap-2">
                <Image src="/icon/docs.png" alt="deneme" width={24} height={24} className="w-6 h-6" />
                Son Denemeler
              </p>
              <Link href="/denemeler">
                <span className="font-[family-name:var(--font-body)] text-lg text-[#2878F8]" style={{ borderBottom: "2px dotted #2878F8" }}>
                  tümü →
                </span>
              </Link>
            </div>
            <div className="flex flex-col gap-1.5">
              {denemeler.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="flex justify-between items-center border-2 border-[#D0D0E8] px-3 py-2"
                  style={{ background: "#F0E8D0" }}
                >
                  <span className="font-[family-name:var(--font-body)] text-xl text-[#101010]">
                    {d.tur} · {new Date(d.tarih).toLocaleDateString("tr-TR")}
                  </span>
                  <span className="font-[family-name:var(--font-pixel)] text-[10px] text-[#18C840]">
                    {d.net.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </PixelCard>
        )}

      </div>
    </div>
  );
}
