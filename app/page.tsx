export const dynamic = "force-dynamic";

import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { PixelButton } from "@/components/pixel/PixelButton";
import { SinavGeriSayim } from "@/components/features/SinavGeriSayim";
import { bugunPomodorolariGetir } from "@/server/actions/pomodoro";
import { bugunGorevleriGetir } from "@/server/actions/takvim";
import { denemeleriGetir } from "@/server/actions/denemeler";
import { derslerGetir } from "@/server/actions/konular";
import Link from "next/link";

const AYLAR  = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const GUNLER = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];

function weatherIcon(n: number) {
  if (n >= 8) return "☀️";
  if (n >= 4) return "🌤️";
  if (n >= 1) return "⛅";
  return "🌧️";
}

export default async function HomePage() {
  const [pomodorolar, gorevler, denemeler, dersler] = await Promise.all([
    bugunPomodorolariGetir(),
    bugunGorevleriGetir(),
    denemeleriGetir(),
    derslerGetir(),
  ]);

  const now               = new Date();
  const tarihStr          = `${now.getDate()} ${AYLAR[now.getMonth()]}`;
  const gunStr            = GUNLER[now.getDay()];
  const bugunPomodoro     = pomodorolar.length;
  const tumKonular        = dersler.flatMap(d => d.konular);
  const tamamlananKonular = tumKonular.filter(k => k.tamamlandi).length;
  const toplamKonular     = tumKonular.length;
  const sonDeneme         = denemeler[0];
  const tamamlananGorev   = gorevler.filter(g => g.tamamlandi).length;
  const toplamGorev       = gorevler.length;
  const gorevProgress     = toplamGorev > 0 ? (tamamlananGorev / toplamGorev) * 100 : 0;

  return (
    <div className="flex flex-col">

      {/* ── Game HUD Header ──────────────────────────────────────────── */}
      <div
        className="relative border-b-4 px-4 py-5"
        style={{
          background:  "#181828",
          borderColor: "#4060D0",
          boxShadow:   "0 4px 0 0 #080818",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1
              className="font-[family-name:var(--font-pixel)] leading-tight"
              style={{ fontSize: "11px", color: "#F0D000", textShadow: "2px 2px 0 #504000", letterSpacing: "0.1em" }}
            >
              🌾 YKS FARM
            </h1>
            <p className="font-[family-name:var(--font-body)] text-2xl mt-1" style={{ color: "#A0A8C0" }}>
              {weatherIcon(bugunPomodoro)} {gunStr} · {tarihStr}
            </p>

            {bugunPomodoro > 0 && (
              <div
                className="mt-2 inline-flex items-center gap-1.5 border-2 px-3 py-1"
                style={{ borderColor: "#F0D000", background: "#181828", boxShadow: "2px 2px 0 0 #504000" }}
              >
                <span>🔥</span>
                <span className="font-[family-name:var(--font-body)] text-lg" style={{ color: "#F0D000" }}>
                  {bugunPomodoro} oturum — çok iyi!
                </span>
              </div>
            )}
          </div>
          <Link href="/ayarlar" className="text-2xl leading-none mt-1 opacity-70 hover:opacity-100 transition-opacity">⚙️</Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">

        {/* ── Sınav geri sayım ─────────────────────────────────────────── */}
        <SinavGeriSayim />

        {/* ── Stat grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Pomodoro stat */}
          <PixelCard variant="dark" className="text-center p-3">
            <div className="text-3xl mb-1">🍅</div>
            <div
              className="font-[family-name:var(--font-pixel)] text-2xl"
              style={{ color: "#18C018" }}
            >
              {bugunPomodoro}
            </div>
            <div className="font-[family-name:var(--font-body)] text-base" style={{ color: "#A0A8C0" }}>
              oturum
            </div>
          </PixelCard>

          {/* Konu stat */}
          <PixelCard variant="dark" className="text-center p-3">
            <div className="text-3xl mb-1">📖</div>
            <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#F0D000" }}>
              {tamamlananKonular}
            </div>
            {toplamKonular > 0 && (
              <div className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#A0A8C0" }}>
                / {toplamKonular} konu
              </div>
            )}
          </PixelCard>

          {/* Deneme stat */}
          <PixelCard variant="dark" className="text-center p-3">
            <div className="text-3xl mb-1">📝</div>
            {sonDeneme ? (
              <>
                <div
                  className="font-[family-name:var(--font-pixel)] text-[9px] leading-tight"
                  style={{ color: "#A0A8C0" }}
                >
                  {sonDeneme.tur}
                </div>
                <div
                  className="font-[family-name:var(--font-body)] text-xl mt-0.5"
                  style={{ color: "#18C018" }}
                >
                  {sonDeneme.net.toFixed(1)} net
                </div>
              </>
            ) : (
              <div className="font-[family-name:var(--font-body)] text-base" style={{ color: "#A0A8C0" }}>
                henüz yok
              </div>
            )}
          </PixelCard>
        </div>

        {/* ── Görev progress ───────────────────────────────────────────── */}
        <PixelCard>
          <div className="flex items-center justify-between mb-3">
            <span className="font-[family-name:var(--font-body)] text-2xl text-[#101010]">
              📅 Bugünün Görevleri
            </span>
            <span
              className="font-[family-name:var(--font-pixel)] text-[9px] border-2 px-2 py-1"
              style={{ borderColor: "#4060D0", color: "#4060D0" }}
            >
              {tamamlananGorev}/{toplamGorev}
            </span>
          </div>
          <PixelProgress value={gorevProgress} showPercent size="lg" hpLabel="GÖREV" />
          {toplamGorev === 0 && (
            <p className="font-[family-name:var(--font-body)] text-lg text-[#505068] mt-2">
              ✦ Takvimden görev ekleyebilirsin!
            </p>
          )}
          {toplamGorev > 0 && tamamlananGorev === toplamGorev && (
            <p className="font-[family-name:var(--font-body)] text-xl mt-2 animate-pixel-float" style={{ color: "#18C018" }}>
              🌾 Harika! Tüm görevler tamamlandı!
            </p>
          )}
        </PixelCard>

        {/* ── Hızlı başlat ─────────────────────────────────────────────── */}
        <PixelCard variant="dark">
          <p
            className="font-[family-name:var(--font-pixel)] mb-4"
            style={{ fontSize: "10px", color: "#F0D000", textShadow: "1px 1px 0 #504000", letterSpacing: "0.08em" }}
          >
            ▶ HIZLI BAŞLAT
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/pomodoro">
              <PixelButton variant="primary" className="w-full justify-center">
                🍅 Pomodoro
              </PixelButton>
            </Link>
            <Link href="/konular">
              <PixelButton variant="secondary" className="w-full justify-center">
                📚 Konular
              </PixelButton>
            </Link>
            <Link href="/denemeler">
              <PixelButton variant="ghost" className="w-full justify-center">
                📝 Deneme
              </PixelButton>
            </Link>
            <Link href="/konular">
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
                <span className="font-[family-name:var(--font-body)] text-lg text-[#505068] hover:text-[#101010] border-b-2 border-dotted border-[#505068]">
                  tümü →
                </span>
              </Link>
            </div>
            <div className="flex flex-col gap-1.5">
              {denemeler.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="flex justify-between items-center border-2 border-[#C0C0D0] px-3 py-2"
                  style={{ background: "#F0F0F8" }}
                >
                  <span className="font-[family-name:var(--font-body)] text-xl text-[#101010]">
                    {d.tur} · {new Date(d.tarih).toLocaleDateString("tr-TR")}
                  </span>
                  <span
                    className="font-[family-name:var(--font-pixel)] text-[10px]"
                    style={{ color: "#18C018" }}
                  >
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
