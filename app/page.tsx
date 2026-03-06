
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSure(dakika: number): string | null {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  const now             = new Date();
  const tarihStr        = `${now.getDate()} ${AYLAR_TAM[now.getMonth()]}`;
  const gunStr          = GUNLER_TAM[now.getDay()];
  const bugunPomo       = pomodorolar.length;
  const sonDeneme       = denemeler[0] ?? null;
  const tamamlananGorev = gorevler.filter((g) => g.tamamlandi).length;
  const toplamGorev     = gorevler.length;
  const gorevPct        = toplamGorev > 0 ? Math.round((tamamlananGorev / toplamGorev) * 100) : 0;
  const gorevProgress   = toplamGorev > 0 ? (tamamlananGorev / toplamGorev) * 100 : 0;
  const streakInfo      = hesaplaStreak(streakDates);
  const alinti          = ALINTILAR[now.getDate() % ALINTILAR.length];
  const hepsiBitti      = tamamlananGorev === toplamGorev && toplamGorev > 0;

  const headerAction = (
    <div className="flex items-center gap-2">
      {bugunPomo > 0 && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-black border-2 border-mario-gold">
          <span className="text-sm">🍅</span>
          <span className="font-pixel text-[10px] text-mario-gold">{bugunPomo}× COMBO</span>
        </div>
      )}
      {streakInfo.current > 0 && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-mario-gold border-2 border-black">
          <span className="text-sm">🔥</span>
          <span className="font-pixel text-[10px] text-black">{streakInfo.current} GÜN</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <PageHeader icon="⚔️" title="YKS QUEST" subtitle={`${gunStr} · ${tarihStr}`} action={headerAction} />
      <PageContainer>

        {/* Sınav geri sayım */}
        <SinavGeriSayim />

        {/* Giriş yok */}
        {!userId && (
          <div className="border-4 border-mario-blue bg-mario-light/20 px-4 py-4 text-center shadow-pixel">
            <p className="font-body text-xl text-black mb-3">
              🔐 Verilerini görmek için giriş yap!
            </p>
            <Link href="/sign-in">
              <PixelButton variant="primary">Giriş Yap →</PixelButton>
            </Link>
          </div>
        )}

        {/* Bugünün özeti */}
        {userId && (
          <div className="border-4 border-black shadow-pixel overflow-hidden">
            <div className="px-4 py-2 border-b-4 border-black bg-black flex items-center justify-between">
              <span className="font-pixel text-[10px] tracking-widest text-mario-gold">★ BUGÜN</span>
              <span className="font-body text-sm text-mario-slate-dark">{gunStr}</span>
            </div>

            <div className="grid grid-cols-3 divide-x-4 divide-black bg-mario-parchment">
              {/* Pomodoro */}
              <div className="flex flex-col items-center justify-center px-2 py-4 gap-1 text-center">
                <span className="font-pixel text-[8px] tracking-widest text-mario-slate">POMODORO</span>
                <span className={`font-pixel text-3xl leading-none ${bugunPomo > 0 ? "text-mario-red" : "text-mario-inactive"}`}>
                  {bugunPomo > 0 ? bugunPomo : "—"}
                </span>
                <span className="font-body text-sm text-mario-slate">
                  {bugunPomo > 0 ? (formatSure(bugunPomo * 25) ?? `${bugunPomo}×`) : "henüz yok"}
                </span>
              </div>

              {/* Görevler */}
              <div className="flex flex-col items-center justify-center px-3 py-4 gap-1.5 text-center">
                <span className="font-pixel text-[8px] tracking-widest text-mario-slate">GÖREVLER</span>
                <div className="flex items-baseline gap-1">
                  <span className={`font-pixel text-3xl leading-none ${
                    toplamGorev === 0 ? "text-mario-inactive" :
                    hepsiBitti ? "text-mario-green" : "text-mario-blue"
                  }`}>
                    {toplamGorev === 0 ? "—" : tamamlananGorev}
                  </span>
                  {toplamGorev > 0 && (
                    <span className="font-body text-base text-mario-slate">/{toplamGorev}</span>
                  )}
                </div>
                {toplamGorev > 0 ? (
                  <>
                    <div className="w-full h-2 border-2 border-black bg-mario-inactive relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0"
                        style={{
                          width: `${gorevPct}%`,
                          background: hepsiBitti ? "#00A800" : "#0058F8",
                        }}
                      />
                    </div>
                    <span className="font-body text-sm text-mario-slate">%{gorevPct} tamamlandı</span>
                  </>
                ) : (
                  <span className="font-body text-sm text-mario-slate">görev yok</span>
                )}
              </div>

              {/* Son deneme */}
              <div className="flex flex-col items-center justify-center px-2 py-4 gap-1 text-center">
                <span className="font-pixel text-[8px] tracking-widest text-mario-slate">SON DENEME</span>
                <span className={`font-pixel text-3xl leading-none ${sonDeneme ? "text-mario-green" : "text-mario-inactive"}`}>
                  {sonDeneme ? sonDeneme.net.toFixed(1) : "—"}
                </span>
                <span className="font-body text-sm text-mario-slate">
                  {sonDeneme
                    ? `${sonDeneme.tur} · ${new Date(sonDeneme.tarih).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" })}`
                    : "henüz yok"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bugünün görevleri */}
        <PixelCard>
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[10px] tracking-widest text-black">
              📋 BUGÜNÜN GÖREVLERİ
            </span>
            <Link href="/todo">
              <span className="font-body text-lg text-mario-blue border-b-2 border-dotted border-mario-blue">
                tümü →
              </span>
            </Link>
          </div>

          {toplamGorev === 0 ? (
            <div className="border-2 border-dashed border-mario-inactive px-4 py-5 text-center bg-mario-cream/40">
              <p className="font-pixel text-[9px] mb-2 text-mario-stone-dark">
                [ GÖREV PANOSU BOŞ ]
              </p>
              <Link href="/todo">
                <span className="font-body text-xl text-mario-blue border-b-2 border-dotted border-mario-blue">
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
                    className={`flex items-center gap-2.5 border-2 px-3 py-2 ${
                      g.tamamlandi
                        ? "border-mario-green/40 bg-mario-green/10"
                        : "border-mario-inactive bg-mario-parchment"
                    }`}
                  >
                    <div
                      className="w-2.5 h-2.5 shrink-0 border border-black/20"
                      style={{ background: g.renk }}
                    />
                    <span className={`font-body text-xl flex-1 leading-tight ${
                      g.tamamlandi ? "line-through text-mario-green-dark" : "text-black"
                    }`}>
                      {g.baslik}
                    </span>
                    {g.oncelik === 3 && (
                      <span className="font-pixel text-[8px] text-mario-red">!</span>
                    )}
                    <span className={`font-pixel text-[10px] ${g.tamamlandi ? "text-mario-green" : "text-mario-inactive"}`}>
                      {g.tamamlandi ? "✓" : "○"}
                    </span>
                  </div>
                ))}
              </div>
              {hepsiBitti && (
                <div className="mt-3 border-2 border-mario-green px-3 py-2 text-center bg-mario-green/10">
                  <span className="font-body text-xl text-mario-green">
                    🏆 Tüm görevler tamamlandı!
                  </span>
                </div>
              )}
            </>
          )}
        </PixelCard>

        {/* Hızlı başlat */}
        <div className="border-4 border-black bg-mario-navy-dark p-4 shadow-pixel">
          <p className="font-pixel text-[10px] mb-4 tracking-widest text-mario-gold">
            ▶ HIZLI BAŞLAT
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/pomodoro">
              <PixelButton variant="primary" className="w-full justify-center gap-2 font-body text-xl">
                <Image src={ICONS.hourglass} alt="" width={18} height={18} className="w-4 h-4" />
                Pomodoro
              </PixelButton>
            </Link>
            <Link href="/harita">
              <PixelButton variant="secondary" className="w-full justify-center gap-2 font-body text-xl">
                <Image src={ICONS.note} alt="" width={18} height={18} className="w-4 h-4" />
                Konular
              </PixelButton>
            </Link>
            <Link href="/denemeler">
              <PixelButton variant="ghost" className="w-full justify-center gap-2 font-body text-xl">
                <Image src={ICONS.docs} alt="" width={18} height={18} className="w-4 h-4" />
                Deneme
              </PixelButton>
            </Link>
            <Link href="/program">
              <PixelButton variant="ghost" className="w-full justify-center gap-2 font-body text-xl">
                <Image src={ICONS.calendar} alt="" width={18} height={18} className="w-4 h-4" />
                Program
              </PixelButton>
            </Link>
          </div>
        </div>

        {/* Haftalık özet */}
        {userId && (
          <div className="grid grid-cols-2 gap-2">
            <div className="border-4 border-black p-3 flex flex-col gap-1 bg-mario-parchment shadow-pixel-btn">
              <span className="font-pixel text-[8px] tracking-widest text-mario-slate">
                BU HAFTA · GÖREV
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-pixel text-2xl text-mario-brown-dark">
                  {istatistik.haftaGorev.tamamlanan}
                </span>
                <span className="font-body text-base text-mario-slate">
                  /{istatistik.haftaGorev.toplam} tamamlandı
                </span>
              </div>
              {istatistik.haftaGorev.toplam > 0 && (
                <div className="h-1.5 border-2 border-black bg-mario-inactive relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-mario-brown-dark"
                    style={{
                      width: `${Math.round((istatistik.haftaGorev.tamamlanan / istatistik.haftaGorev.toplam) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="border-4 border-black p-3 flex flex-col gap-1 bg-mario-parchment shadow-pixel-btn">
              <span className="font-pixel text-[8px] tracking-widest text-mario-slate">
                BU HAFTA · POMODORO
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-pixel text-2xl text-mario-red">
                  {istatistik.haftaPomodoro}
                </span>
                <span className="font-body text-base text-mario-slate">oturum</span>
              </div>
              <span className="font-body text-sm text-mario-slate">
                {istatistik.haftaPomodoro > 0
                  ? `≈ ${formatSure(istatistik.haftaPomodoro * 25) ?? `${istatistik.haftaPomodoro * 25}dk`} çalışma`
                  : "Bu hafta henüz yok"}
              </span>
            </div>
          </div>
        )}

        {/* Motivasyon */}
        <div className="text-center py-1">
          <p className="font-body text-base text-white text-shadow-black">
            💬 {alinti}
          </p>
        </div>

      </PageContainer>
    </>
  );
}
