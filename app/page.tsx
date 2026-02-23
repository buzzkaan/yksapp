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
            <div className="font-[family-name:var(--font-pixel)] text-xl" style={{ color: "#2878F8" }}>{istatistik.bugunGorev.toplam || "—"}</div>
            {istatistik.bugunGorev.tamamlanan > 0 && (
              <div className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#18C840" }}>{istatistik.bugunGorev.tamamlanan} ✓</div>
            )}
          </div>
          <div className="border-3 border-[#101010] p-2 text-center" style={{ background: "#F8F0DC", boxShadow: "3px 3px 0 0 #101010" }}>
            <div className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>HAFTA</div>
            <div className="font-[family-name:var(--font-pixel)] text-xl" style={{ color: "#F89000" }}>{istatistik.haftaGorev.toplam || "—"}</div>
            {istatistik.haftaGorev.tamamlanan > 0 && (
              <div className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#18C840" }}>{istatistik.haftaGorev.tamamlanan} ✓</div>
            )}
          </div>
          <div className="border-3 border-[#101010] p-2 text-center" style={{ background: "#F8F0DC", boxShadow: "3px 3px 0 0 #101010" }}>
            <div className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>POMODORO</div>
            <div className="font-[family-name:var(--font-pixel)] text-xl" style={{ color: "#E01828" }}>{istatistik.haftaPomodoro || "—"}</div>
            {istatistik.haftaPomodoro > 0 && (
              <div className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#484858" }}>bu hafta</div>
            )}
          </div>
          <div className="border-3 border-[#101010] p-2 text-center" style={{ background: "#F8F0DC", boxShadow: "3px 3px 0 0 #101010" }}>
            <div className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>KONULAR</div>
            <div className="font-[family-name:var(--font-pixel)] text-xl" style={{ color: "#18C840" }}>{tamamlananKonular || "—"}</div>
            {toplamKonular > 0 && (
              <div className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#484858" }}>/ {toplamKonular}</div>
            )}
          </div>
        </div>

        {/* ── Stat grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Pomodoro */}
          <PixelCard variant="dark" className="flex flex-col items-center justify-between p-3 gap-1 min-h-[88px]">
            <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878] tracking-wider">OTURUM</div>
            <div className="w-7 h-7 relative">
              <Image src="/icon/hourglass.png" alt="pomodoro" fill className="object-contain" />
            </div>
            <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: bugunPomodoro > 0 ? "#18C840" : "#484858" }}>
              {bugunPomodoro > 0 ? bugunPomodoro : "—"}
            </div>
            <div className="font-[family-name:var(--font-body)] text-sm" style={{ color: bugunPomodoro > 0 ? "#8890B8" : "#303050" }}>
              {bugunPomodoro > 0 ? "bugün" : "boş"}
            </div>
          </PixelCard>

          {/* Konular */}
          <PixelCard variant="dark" className="flex flex-col items-center justify-between p-3 gap-1 min-h-[88px]">
            <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878] tracking-wider">KONULAR</div>
            <div className="w-7 h-7 relative">
              <Image src="/icon/chat.png" alt="konular" fill className="object-contain" />
            </div>
            <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: tamamlananKonular > 0 ? "#FFD000" : "#484858" }}>
              {tamamlananKonular > 0 ? tamamlananKonular : "—"}
            </div>
            <div className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#606878" }}>
              {toplamKonular > 0 ? `/ ${toplamKonular} konu` : "henüz yok"}
            </div>
          </PixelCard>

          {/* Son deneme */}
          <PixelCard variant="dark" className="flex flex-col items-center justify-between p-3 gap-1 min-h-[88px]">
            <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878] tracking-wider">DENEME</div>
            <div className="w-7 h-7 relative">
              <Image src="/icon/docs.png" alt="deneme" fill className="object-contain" />
            </div>
            <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: sonDeneme ? "#18C840" : "#484858" }}>
              {sonDeneme ? sonDeneme.net.toFixed(1) : "—"}
            </div>
            <div className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#606878" }}>
              {sonDeneme ? `${sonDeneme.tur} net` : "henüz yok"}
            </div>
          </PixelCard>
        </div>

        {/* ── Görev progress ───────────────────────────────────────────── */}
        <PixelCard>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 relative flex-shrink-0">
                <Image src="/icon/home.png" alt="görevler" fill className="object-contain" />
              </div>
              <span
                className="font-[family-name:var(--font-pixel)] leading-tight"
                style={{ fontSize: "10px", color: "#101010", letterSpacing: "0.05em" }}
              >
                BUGÜNÜN GÖREVLERİ
              </span>
            </div>
            <div className="flex items-center gap-2">
              {toplamGorev > 0 && (
                <span
                  className="font-[family-name:var(--font-pixel)] text-[9px] border-2 border-[#101010] px-2 py-1"
                  style={{ color: tamamlananGorev === toplamGorev ? "#18C840" : "#484858" }}
                >
                  {tamamlananGorev}/{toplamGorev}
                </span>
              )}
              <Link href="/todo">
                <span
                  className="font-[family-name:var(--font-body)] text-lg"
                  style={{ color: "#2878F8", borderBottom: "2px dotted #2878F8" }}
                >
                  tümü →
                </span>
              </Link>
            </div>
          </div>

          {toplamGorev === 0 ? (
            /* Empty state */
            <div
              className="border-2 border-dashed border-[#C0B090] px-4 py-4 text-center"
              style={{ background: "#F0E8D4" }}
            >
              <div className="font-[family-name:var(--font-pixel)] text-[9px] mb-2" style={{ color: "#A09070" }}>
                [ GÖREV PANOSU BOŞ ]
              </div>
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

              {/* Görev listesi */}
              <div className="flex flex-col gap-1.5 mt-3">
                {gorevler.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center gap-2.5 border-2 px-3 py-2"
                    style={{
                      borderColor: g.tamamlandi ? "#B0D8A0" : "#D0C8B8",
                      background: g.tamamlandi ? "#E8F4E0" : "#FAF4E8",
                    }}
                  >
                    {/* Renk dot */}
                    <div
                      className="w-2.5 h-2.5 flex-shrink-0 border border-[#10101040]"
                      style={{ background: g.renk }}
                    />
                    {/* Başlık */}
                    <span
                      className="font-[family-name:var(--font-body)] text-xl flex-1 leading-tight"
                      style={{
                        color: g.tamamlandi ? "#70A060" : "#202030",
                        textDecoration: g.tamamlandi ? "line-through" : "none",
                      }}
                    >
                      {g.baslik}
                    </span>
                    {/* Öncelik */}
                    {g.oncelik === 3 && (
                      <span className="font-[family-name:var(--font-pixel)] text-[8px]" style={{ color: "#E01828" }}>!</span>
                    )}
                    {/* Durum */}
                    <span
                      className="font-[family-name:var(--font-pixel)] text-[10px]"
                      style={{ color: g.tamamlandi ? "#18C840" : "#C0B890" }}
                    >
                      {g.tamamlandi ? "✓" : "○"}
                    </span>
                  </div>
                ))}
              </div>

              {tamamlananGorev === toplamGorev && (
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
              <PixelButton variant="primary" className="w-full justify-center gap-2 font-[family-name:var(--font-body)] text-xl">
                <Image src="/icon/hourglass.png" alt="pomodoro" width={18} height={18} className="w-4 h-4" />
                Pomodoro
              </PixelButton>
            </Link>
            <Link href="/todo">
              <PixelButton variant="secondary" className="w-full justify-center gap-2 font-[family-name:var(--font-body)] text-xl">
                <Image src="/icon/chat.png" alt="konular" width={18} height={18} className="w-4 h-4" />
                Konular
              </PixelButton>
            </Link>
            <Link href="/denemeler">
              <PixelButton variant="ghost" className="w-full justify-center gap-2 font-[family-name:var(--font-body)] text-xl">
                <Image src="/icon/docs.png" alt="deneme" width={18} height={18} className="w-4 h-4" />
                Deneme
              </PixelButton>
            </Link>
            <Link href="/todo">
              <PixelButton variant="ghost" className="w-full justify-center gap-2 font-[family-name:var(--font-body)] text-xl">
                <Image src="/icon/calendar.png" alt="takvim" width={18} height={18} className="w-4 h-4" />
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
