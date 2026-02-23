export const dynamic = "force-dynamic";

import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { PixelButton } from "@/components/pixel/PixelButton";
import { SinavGeriSayim } from "@/components/features/SinavGeriSayim";
import { bugunPomodorolariGetir } from "@/server/actions/pomodoro";
import { bugunGorevleriGetir } from "@/server/actions/takvim";
import { denemeleriGetir } from "@/server/actions/denemeler";
import { derslerGetir } from "@/server/actions/konular";
import { AYLAR_TAM, GUNLER_TAM } from "@/lib/constants/ui";
import type { DersWithKonular, DenemeWithDetay, Gorev, PomodoroOturum } from "@/lib/types";
import Link from "next/link";

function weatherIcon(n: number) {
  if (n >= 8) return "⚡";
  if (n >= 4) return "🔥";
  if (n >= 1) return "⭐";
  return "💤";
}

export default async function HomePage() {
  const [pomodorolar, gorevler, denemeler, dersler]: [
    PomodoroOturum[],
    Gorev[],
    DenemeWithDetay[],
    DersWithKonular[]
  ] = await Promise.all([
    bugunPomodorolariGetir(),
    bugunGorevleriGetir(),
    denemeleriGetir(),
    derslerGetir(),
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

  return (
    <div className="flex flex-col py-4 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-3">

        {/* ── Game HUD Header ──────────────────────────────────────────── */}
        <div
          className="relative border-4 border-[#101010] px-5 py-4"
          style={{
            background: "#181828",
            boxShadow: "4px 4px 0 0 #101010",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1
                className="font-[family-name:var(--font-pixel)] leading-tight"
                style={{ fontSize: "14px", color: "#F8D030", textShadow: "2px 2px 0 #504000", letterSpacing: "0.1em" }}
              >
                ⚔️ YKS QUEST
              </h1>
              <p className="font-[family-name:var(--font-body)] text-2xl mt-1" style={{ color: "#A0A8C0" }}>
                {weatherIcon(bugunPomodoro)} {gunStr} · {tarihStr}
              </p>

              {bugunPomodoro > 0 && (
                <div
                  className="mt-2 inline-flex items-center gap-1.5 border-2 border-[#F8D030] px-3 py-1"
                  style={{ background: "#101010" }}
                >
                  <span>🔥</span>
                  <span className="font-[family-name:var(--font-body)] text-lg" style={{ color: "#F8D030" }}>
                    {bugunPomodoro} oturum — combo!
                  </span>
                </div>
              )}
            </div>
            <Link href="/ayarlar" className="text-2xl leading-none mt-1 opacity-70 hover:opacity-100 transition-opacity">⚙️</Link>
          </div>
        </div>

        {/* ── Sınav geri sayım ─────────────────────────────────────────── */}
        <SinavGeriSayim />

        {/* ── Stat grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <PixelCard variant="dark" className="text-center p-3">
            <div className="text-3xl mb-1">⭐</div>
            <div className="font-[family-name:var(--font-pixel)] text-2xl text-[#48B848]">
              {bugunPomodoro}
            </div>
            <div className="font-[family-name:var(--font-body)] text-base text-[#A0A8C0]">
              oturum
            </div>
          </PixelCard>

          <PixelCard variant="dark" className="text-center p-3">
            <div className="text-3xl mb-1">📖</div>
            <div className="font-[family-name:var(--font-pixel)] text-2xl text-[#F8D030]">
              {tamamlananKonular}
            </div>
            {toplamKonular > 0 && (
              <div className="font-[family-name:var(--font-body)] text-sm text-[#585868]">
                / {toplamKonular} konu
              </div>
            )}
          </PixelCard>

          <PixelCard variant="dark" className="text-center p-3">
            <div className="text-3xl mb-1">📊</div>
            {sonDeneme ? (
              <>
                <div className="font-[family-name:var(--font-pixel)] text-[9px] text-[#585868]">
                  {sonDeneme.tur}
                </div>
                <div className="font-[family-name:var(--font-body)] text-xl text-[#48B848] mt-0.5">
                  {sonDeneme.net.toFixed(1)} net
                </div>
              </>
            ) : (
              <div className="font-[family-name:var(--font-body)] text-base text-[#585868]">
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
            <p className="font-[family-name:var(--font-body)] text-lg text-[#585868] mt-2">
              ✦ Takvimden görev ekleyebilirsin!
            </p>
          )}
          {toplamGorev > 0 && tamamlananGorev === toplamGorev && (
            <p className="font-[family-name:var(--font-body)] text-xl text-[#48B848] mt-2 animate-pixel-float">
              🏆 Harika! Tüm görevler tamamlandı!
            </p>
          )}
        </PixelCard>

        {/* ── Hızlı başlat ─────────────────────────────────────────────── */}
        <PixelCard variant="dark">
          <p
            className="font-[family-name:var(--font-pixel)] mb-4"
            style={{ fontSize: "10px", color: "#F8D030", textShadow: "1px 1px 0 #504000", letterSpacing: "0.08em" }}
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
              <PixelButton variant="ghost" className="w-full justify-center">
                📊 Deneme
              </PixelButton>
            </Link>
            <Link href="/todo">
              <PixelButton variant="ghost" className="w-full justify-center">
                📅 Takvim
              </PixelButton>
            </Link>
          </div>
        </PixelCard>

        {/* ── Son denemeler ────────────────────────────────────────────── */}
        {denemeler.length > 0 && (
          <PixelCard>
            <div className="flex items-center justify-between mb-3">
              <p className="font-[family-name:var(--font-body)] text-2xl text-[#101010]">
                📊 Son Denemeler
              </p>
              <Link href="/denemeler">
                <span className="font-[family-name:var(--font-body)] text-lg text-[#4088F0]" style={{ borderBottom: "2px dotted #4088F0" }}>
                  tümü →
                </span>
              </Link>
            </div>
            <div className="flex flex-col gap-1.5">
              {denemeler.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="flex justify-between items-center border-2 border-[#C0C0D0] px-3 py-2"
                  style={{ background: "#F0F0E8" }}
                >
                  <span className="font-[family-name:var(--font-body)] text-xl text-[#101010]">
                    {d.tur} · {new Date(d.tarih).toLocaleDateString("tr-TR")}
                  </span>
                  <span className="font-[family-name:var(--font-pixel)] text-[10px] text-[#48B848]">
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
