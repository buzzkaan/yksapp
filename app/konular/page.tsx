"use client";
import { useState, useEffect, useTransition, useRef } from "react";
import {
  derslerGetir, dersEkle, dersSil,
  konuEkle, konuToggle, konuSil,
} from "@/server/actions/konular";
import {
  aylikGorevlerGetir, gorevEkle, gorevTamamla, gorevSil,
  tamamlananGunleriGetir,
} from "@/server/actions/takvim";
import { CalendarGrid } from "@/components/features/CalendarGrid";
import toast from "react-hot-toast";

// ─── Tipler ───────────────────────────────────────────────────────────────────
type Konu = {
  id: string; baslik: string; aciklama: string | null;
  tamamlandi: boolean; oncelik: number;
};
type Ders = { id: string; ad: string; renk: string; icon: string; konular: Konu[] };
type Filtre = "aktif" | "tamamlanan" | "tumu";
type Gorev = { id: string; tarih: Date; baslik: string; tamamlandi: boolean; renk: string };
type Tab = "takvim" | "konular";

// ─── Sabitler ─────────────────────────────────────────────────────────────────
const RENKLER      = ["#18C018","#D81818","#1860C8","#9040C8","#F5A623","#1ABC9C","#E87820","#4060D0"];
const GOREV_RENKLER = ["#F5A623","#18C018","#D81818","#1860C8","#9040C8","#1ABC9C"];
const IKONLAR      = ["📐","📖","🔬","⚗️","🌍","📜","🧮","🎯","📊","✏️","🏛️","🔢"];
const ONCELIK      = [
  { val: 1, label: "Normal", icon: "○", renk: "#505068" },
  { val: 2, label: "Orta",   icon: "◐", renk: "#E87820" },
  { val: 3, label: "Acil",   icon: "●", renk: "#D81818" },
];
const GUNLER_KISA = ["Pt","Sl","Ça","Pe","Cu","Ct","Pz"];

// ─── Yardımcı fonksiyonlar ────────────────────────────────────────────────────
function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function hesaplaStreak(dateStrs: string[]) {
  const dateSet = new Set(dateStrs);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = fmt(today);

  // Güncel seri: bugünden geriye giden ardışık günler
  let current = 0;
  const check = new Date(today);
  if (dateSet.has(fmt(check))) {
    current++;
    check.setDate(check.getDate() - 1);
    while (dateSet.has(fmt(check))) {
      current++;
      check.setDate(check.getDate() - 1);
    }
  } else {
    // Bugün tamamlanmadıysa dünden geriye bak
    check.setDate(check.getDate() - 1);
    if (dateSet.has(fmt(check))) {
      current++;
      check.setDate(check.getDate() - 1);
      while (dateSet.has(fmt(check))) {
        current++;
        check.setDate(check.getDate() - 1);
      }
    }
  }

  // En uzun seri
  const sorted = [...dateStrs].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const ds of sorted) {
    if (prev === null) {
      run = 1;
    } else {
      const a = new Date(prev + "T12:00:00");
      const b = new Date(ds + "T12:00:00");
      const diff = Math.round((b.getTime() - a.getTime()) / 86400000);
      run = diff === 1 ? run + 1 : 1;
    }
    if (run > best) best = run;
    prev = ds;
  }

  // 4×7 ısı haritası: bu pazartesiden 3 hafta öncesinden başla
  const dayOfWeek = (today.getDay() + 6) % 7; // Pt=0, Pz=6
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - dayOfWeek);
  const gridStart = new Date(thisMonday);
  gridStart.setDate(thisMonday.getDate() - 21);

  const grid: { dateStr: string; active: boolean; isToday: boolean; isFuture: boolean }[] = [];
  for (let i = 0; i < 28; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const ds = fmt(d);
    grid.push({
      dateStr: ds,
      active: dateSet.has(ds),
      isToday: ds === todayStr,
      isFuture: ds > todayStr,
    });
  }

  return { current, best, grid };
}

// ─── StreakWidget ─────────────────────────────────────────────────────────────
function StreakWidget({ streakDates }: { streakDates: string[] }) {
  const { current, best, grid } = hesaplaStreak(streakDates);
  const cornerColor = current > 0 ? "#F0D000" : "#4060D0";

  function getMessage() {
    if (current === 0) return "Bugün bir görev tamamla!";
    if (current < 3)   return "İyi gidiyorsun!";
    if (current < 7)   return "Harika seri 🔥";
    return "Efsane! 🏆";
  }

  return (
    <div
      className="border-4 border-[#101010] relative"
      style={{ background: "#181828", boxShadow: "4px 4px 0 0 #101010" }}
    >
      {/* Köşe işaretleri */}
      <span className="absolute top-1 left-1 text-xs leading-none select-none" style={{ color: cornerColor }}>◢</span>
      <span className="absolute top-1 right-1 text-xs leading-none select-none" style={{ color: cornerColor }}>◣</span>
      <span className="absolute bottom-1 left-1 text-xs leading-none select-none" style={{ color: cornerColor }}>◥</span>
      <span className="absolute bottom-1 right-1 text-xs leading-none select-none" style={{ color: cornerColor }}>◤</span>

      {/* Üst satır: güncel seri + en uzun seri */}
      <div className="flex border-b-2 border-[#2A2A48]">
        <div className="flex-1 flex flex-col items-center py-3 border-r-2 border-[#2A2A48]">
          <span className="text-2xl leading-none">{current > 0 ? "🔥" : "❄️"}</span>
          <span
            className="font-[family-name:var(--font-pixel)] text-[22px] leading-tight mt-1"
            style={{ color: current > 0 ? "#F0D000" : "#4060D0" }}
          >
            {current}
          </span>
          <span className="font-[family-name:var(--font-body)] text-sm text-[#A0A8C0] mt-0.5">
            günlük seri
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center py-3">
          <span className="text-2xl leading-none">🏆</span>
          <span
            className="font-[family-name:var(--font-pixel)] text-[22px] leading-tight mt-1"
            style={{ color: "#F0D000" }}
          >
            {best}
          </span>
          <span className="font-[family-name:var(--font-body)] text-sm text-[#A0A8C0] mt-0.5">
            en uzun seri
          </span>
        </div>
      </div>

      {/* 4 haftalık ısı haritası */}
      <div className="px-4 pt-3 pb-2">
        {/* Gün başlıkları */}
        <div className="grid grid-cols-7 mb-1.5">
          {GUNLER_KISA.map(g => (
            <div
              key={g}
              className="text-center font-[family-name:var(--font-body)] text-xs"
              style={{ color: "#505068" }}
            >
              {g}
            </div>
          ))}
        </div>

        {/* 4 × 7 hücreler */}
        <div className="grid grid-cols-7 gap-[3px]">
          {grid.map((cell, i) => (
            <div
              key={i}
              className="aspect-square border-[2px]"
              style={{
                backgroundColor: cell.isFuture
                  ? "transparent"
                  : cell.active
                  ? "#0A8A0A"
                  : "#101010",
                borderColor: cell.isToday
                  ? "#F0D000"
                  : cell.isFuture
                  ? "transparent"
                  : cell.active
                  ? "#0A5A0A"
                  : "#2A2A48",
              }}
              title={cell.dateStr}
            />
          ))}
        </div>

        {/* Açıklama */}
        <div className="flex items-center gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border border-[#2A2A48] flex-shrink-0" style={{ backgroundColor: "#101010" }} />
            <span className="font-[family-name:var(--font-body)] text-xs text-[#505068]">yok</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border border-[#0A5A0A] flex-shrink-0" style={{ backgroundColor: "#0A8A0A" }} />
            <span className="font-[family-name:var(--font-body)] text-xs text-[#505068]">var</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border border-[#F0D000] flex-shrink-0" style={{ backgroundColor: "#101010" }} />
            <span className="font-[family-name:var(--font-body)] text-xs text-[#505068]">bugün</span>
          </div>
        </div>
      </div>

      {/* Mesaj */}
      <div className="border-t-2 border-[#2A2A48] px-4 py-2 text-center">
        <span
          className="font-[family-name:var(--font-body)] text-base"
          style={{ color: current > 0 ? "#7EC850" : "#A0A8C0" }}
        >
          {getMessage()}
        </span>
      </div>
    </div>
  );
}

// ─── Todo Öğesi ───────────────────────────────────────────────────────────────
function TodoItem({
  konu, dersRenk, onRefresh,
}: { konu: Konu; dersRenk: string; onRefresh: () => void }) {
  const [pending, startT] = useTransition();
  const oncelik = ONCELIK.find(o => o.val === konu.oncelik) ?? ONCELIK[0];

  function toggle() {
    startT(async () => {
      await konuToggle(konu.id, !konu.tamamlandi);
      if (!konu.tamamlandi) toast.success("🌾 Hasat edildi!");
      onRefresh();
    });
  }

  function sil() {
    startT(async () => {
      await konuSil(konu.id);
      toast("🗑️ Silindi", { icon: "⚠️" });
      onRefresh();
    });
  }

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 border-b-2 border-[#C0C0D0] last:border-b-0 transition-all ${
        konu.tamamlandi ? "bg-[#E8E8F0]" : "bg-white hover:bg-[#F0F0F8]"
      } ${pending ? "opacity-50 pointer-events-none" : ""}`}
    >
      <button
        onClick={toggle}
        className="mt-0.5 w-7 h-7 border-4 border-[#101010] flex-shrink-0 flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: konu.tamamlandi ? dersRenk : "white" }}
      >
        {konu.tamamlandi && (
          <span className="text-white text-base leading-none font-bold">✓</span>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className="font-[family-name:var(--font-body)] text-lg leading-snug"
          style={{
            color: konu.tamamlandi ? "#505068" : "#101010",
            textDecoration: konu.tamamlandi ? "line-through" : "none",
          }}
        >
          {konu.baslik}
        </p>
        {konu.aciklama && (
          <p className="font-[family-name:var(--font-body)] text-sm text-[#505068] mt-0.5 leading-snug">
            {konu.aciklama}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
        <span
          className="font-[family-name:var(--font-body)] text-base leading-none"
          title={oncelik.label}
          style={{ color: oncelik.renk }}
        >
          {oncelik.icon}
        </span>
        <button
          onClick={sil}
          className="w-6 h-6 flex items-center justify-center text-[#A0A8C0] hover:text-[#D81818] transition-colors text-lg leading-none"
          title="Sil"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────
export default function YapilacaklarPage() {
  // Seri durumu
  const [streakDates, setStreakDates] = useState<string[]>([]);

  // Sekme
  const [aktifTab, setAktifTab] = useState<Tab>("takvim");

  // Takvim durumu
  const now = new Date();
  const [yil, setYil] = useState(now.getFullYear());
  const [ay, setAy]   = useState(now.getMonth() + 1);
  const [gorevler, setGorevler]         = useState<Gorev[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(fmt(now));
  const [showGorevForm, setShowGorevForm] = useState(false);
  const [gorevBaslik, setGorevBaslik]   = useState("");
  const [gorevRenk, setGorevRenk]       = useState(GOREV_RENKLER[0]);

  // Konular durumu
  const [dersler, setDersler]           = useState<Ders[]>([]);
  const [aktifDersId, setAktifDersId]   = useState<string | null>(null);
  const [filtre, setFiltre]             = useState<Filtre>("aktif");
  const [showDersForm, setShowDersForm] = useState(false);
  const [dersSilId, setDersSilId]       = useState<string | null>(null);
  const [konuBaslik, setKonuBaslik]     = useState("");
  const [konuAciklama, setKonuAciklama] = useState("");
  const [konuOncelik, setKonuOncelik]   = useState(1);
  const [showNote, setShowNote]         = useState(false);
  const [dersAd, setDersAd]     = useState("");
  const [dersRenk, setDersRenk] = useState(RENKLER[0]);
  const [dersIcon, setDersIcon] = useState(IKONLAR[0]);
  const [isPending, startT]     = useTransition();
  const konuInputRef = useRef<HTMLInputElement>(null);

  // ── Yükleme fonksiyonları ───────────────────────────────────────────────────
  async function loadStreak() {
    const dates = await tamamlananGunleriGetir();
    setStreakDates(dates);
  }

  async function loadGorevler(y = yil, m = ay) {
    const data = await aylikGorevlerGetir(y, m);
    setGorevler(data as Gorev[]);
  }

  async function loadDersler() {
    const data = await derslerGetir();
    setDersler(data as Ders[]);
  }

  useEffect(() => {
    loadStreak();
    loadDersler();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadGorevler(yil, ay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yil, ay]);

  // ── Türetilmiş değerler ─────────────────────────────────────────────────────
  const aktifDers     = dersler.find(d => d.id === aktifDersId) ?? null;
  const konular       = aktifDers?.konular ?? [];
  const aktifSayi     = konular.filter(k => !k.tamamlandi).length;
  const tamamSayi     = konular.filter(k => k.tamamlandi).length;
  const progress      = konular.length > 0 ? (tamamSayi / konular.length) * 100 : 0;
  const filtreliKonular = konular.filter(k =>
    filtre === "aktif"      ? !k.tamamlandi :
    filtre === "tamamlanan" ?  k.tamamlandi : true
  );

  const selectedGorevler = selectedDate
    ? gorevler.filter(g => fmt(new Date(g.tarih)) === selectedDate)
    : [];

  const selectedDateLabel = selectedDate
    ? (() => {
        const [y, m, d] = selectedDate.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
      })()
    : null;

  const streakInfo = hesaplaStreak(streakDates);

  // ── Takvim işleyicileri ─────────────────────────────────────────────────────
  function handleMonthChange(y: number, m: number) {
    setYil(y); setAy(m); setSelectedDate(null);
  }

  async function handleGorevEkle(e: React.FormEvent) {
    e.preventDefault();
    if (!gorevBaslik.trim() || !selectedDate) return;
    const [y, m, d] = selectedDate.split("-").map(Number);
    await gorevEkle({ tarih: new Date(y, m - 1, d), baslik: gorevBaslik, renk: gorevRenk });
    setGorevBaslik(""); setShowGorevForm(false);
    toast.success("📅 Görev eklendi!");
    await loadGorevler();
  }

  async function handleGorevTamamla(id: string) {
    await gorevTamamla(id);
    toast.success("✅ Görev tamamlandı!");
    await loadGorevler();
    await loadStreak();
  }

  async function handleGorevSil(id: string) {
    await gorevSil(id);
    toast("🗑️ Görev silindi", { icon: "⚠️" });
    await loadGorevler();
    await loadStreak();
  }

  // ── Konular işleyicileri ────────────────────────────────────────────────────
  async function loadVeSecSon() {
    const data = await derslerGetir();
    setDersler(data as Ders[]);
    if (data.length > 0) setAktifDersId(data[data.length - 1].id);
  }

  function handleDersEkle(e: React.FormEvent) {
    e.preventDefault();
    if (!dersAd.trim()) return;
    startT(async () => {
      await dersEkle({ ad: dersAd, renk: dersRenk, icon: dersIcon });
      setDersAd(""); setShowDersForm(false);
      toast.success(`${dersIcon} ${dersAd} eklendi!`);
      await loadVeSecSon();
    });
  }

  function handleKonuEkle(e: React.FormEvent) {
    e.preventDefault();
    if (!konuBaslik.trim() || !aktifDersId) return;
    startT(async () => {
      await konuEkle({
        baslik: konuBaslik, dersId: aktifDersId,
        oncelik: konuOncelik, aciklama: konuAciklama || undefined,
      });
      setKonuBaslik(""); setKonuAciklama(""); setShowNote(false);
      toast.success("📌 Konu eklendi!");
      await loadDersler();
      konuInputRef.current?.focus();
    });
  }

  function handleDersSil(id: string) {
    startT(async () => {
      await dersSil(id);
      setDersSilId(null);
      if (aktifDersId === id) setAktifDersId(null);
      toast("🗑️ Ders silindi", { icon: "⚠️" });
      await loadDersler();
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#E8E8F0" }}>

      {/* ── 1. Başlık ────────────────────────────────────────────────────────── */}
      <div className="border-b-4 border-[#101010] px-4 py-4" style={{ background: "#181828" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-pixel)] text-xs text-[#F0D000] leading-tight">
              ✅ YAPILACAKLAR
            </h1>
            <p className="font-[family-name:var(--font-body)] text-base text-[#A0A8C0] mt-1">
              Görevler &amp; Konular
            </p>
          </div>
          {streakInfo.current > 0 && (
            <div
              className="border-2 border-[#F0D000] px-3 py-1.5 flex items-center gap-1.5"
              style={{ background: "#101010" }}
            >
              <span className="text-lg leading-none">🔥</span>
              <span className="font-[family-name:var(--font-pixel)] text-[11px] text-[#F0D000]">
                {streakInfo.current} GÜN
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. StreakWidget ───────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-0">
        <StreakWidget streakDates={streakDates} />
      </div>

      {/* ── 3. Sekme Çubuğu ──────────────────────────────────────────────────── */}
      <div className="border-b-4 border-[#101010] flex mt-4">
        <button
          onClick={() => setAktifTab("takvim")}
          className={`flex-1 py-3 flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-base border-r-4 border-[#101010] transition-all ${
            aktifTab === "takvim"
              ? "bg-[#101010] text-[#F0D000]"
              : "bg-[#E8E8F0] text-[#101010] hover:bg-[#D8D8E8]"
          }`}
        >
          <span>📅</span> Takvim
        </button>
        <button
          onClick={() => setAktifTab("konular")}
          className={`flex-1 py-3 flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-base transition-all ${
            aktifTab === "konular"
              ? "bg-[#101010] text-[#F0D000]"
              : "bg-[#E8E8F0] text-[#101010] hover:bg-[#D8D8E8]"
          }`}
        >
          <span>📚</span> Konular
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4a. TAKVİM SEKMESİ
          ══════════════════════════════════════════════════════════════════════ */}
      {aktifTab === "takvim" && (
        <div>
          {/* Takvim grid */}
          <div className="border-b-4 border-[#101010] bg-white">
            <CalendarGrid
              yil={yil}
              ay={ay}
              gorevler={gorevler}
              onMonthChange={handleMonthChange}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>

          {/* Seçili gün */}
          {selectedDate ? (
            <div className="flex flex-col">
              {/* Tarih başlığı + görev ekleme butonu */}
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#C0C0D0] bg-[#F0F0F8]">
                <span className="font-[family-name:var(--font-body)] text-lg text-[#101010]">
                  📅 {selectedDateLabel}
                </span>
                <button
                  onClick={() => setShowGorevForm(v => !v)}
                  className="border-4 border-[#101010] px-3 py-1 font-[family-name:var(--font-body)] text-base bg-[#18C018] text-white shadow-[3px_3px_0_#101010] active:shadow-none active:translate-y-0.5 transition-all"
                >
                  + Görev
                </button>
              </div>

              {/* Görev ekleme formu */}
              {showGorevForm && (
                <form
                  onSubmit={handleGorevEkle}
                  className="border-b-4 border-[#101010] bg-white px-4 py-3 flex flex-col gap-2"
                >
                  <input
                    type="text"
                    placeholder="Görev başlığı"
                    value={gorevBaslik}
                    onChange={e => setGorevBaslik(e.target.value)}
                    autoFocus
                    className="border-4 border-[#101010] bg-[#F8F8FF] px-3 py-2 font-[family-name:var(--font-body)] text-lg text-[#101010] outline-none focus:border-[#18C018] w-full"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {GOREV_RENKLER.map(r => (
                      <button
                        key={r} type="button" onClick={() => setGorevRenk(r)}
                        className="w-7 h-7 border-4 transition-transform"
                        style={{
                          backgroundColor: r,
                          borderColor: gorevRenk === r ? "#101010" : "#A0A8C0",
                          transform:   gorevRenk === r ? "scale(1.15)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="border-4 border-[#101010] px-4 py-1.5 font-[family-name:var(--font-body)] text-base bg-[#18C018] text-white shadow-[3px_3px_0_#101010] active:shadow-none active:translate-y-0.5"
                    >
                      Ekle
                    </button>
                    <button
                      type="button" onClick={() => setShowGorevForm(false)}
                      className="border-4 border-[#A0A8C0] px-4 py-1.5 font-[family-name:var(--font-body)] text-base text-[#505068]"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              )}

              {/* Görev listesi */}
              {selectedGorevler.length === 0 ? (
                <p className="font-[family-name:var(--font-body)] text-lg text-[#505068] text-center py-8">
                  Bu gün için görev yok.
                </p>
              ) : (
                <div className="flex flex-col">
                  {selectedGorevler.map(g => (
                    <div
                      key={g.id}
                      className={`flex items-center gap-3 border-b-2 border-[#C0C0D0] px-4 py-3 ${
                        g.tamamlandi ? "bg-[#E8F0E8] opacity-80" : "bg-white"
                      }`}
                      style={{ borderLeftColor: g.renk, borderLeftWidth: "6px" }}
                    >
                      <button
                        onClick={() => !g.tamamlandi && handleGorevTamamla(g.id)}
                        className="w-7 h-7 border-4 border-[#101010] flex-shrink-0 flex items-center justify-center transition-all hover:scale-110"
                        style={{ backgroundColor: g.tamamlandi ? g.renk : "white" }}
                        disabled={g.tamamlandi}
                      >
                        {g.tamamlandi && (
                          <span className="text-white text-base font-bold leading-none">✓</span>
                        )}
                      </button>
                      <span
                        className={`flex-1 font-[family-name:var(--font-body)] text-lg ${
                          g.tamamlandi ? "line-through text-[#505068]" : "text-[#101010]"
                        }`}
                      >
                        {g.baslik}
                      </span>
                      <button
                        onClick={() => handleGorevSil(g.id)}
                        className="text-[#A0A8C0] hover:text-[#D81818] transition-colors font-[family-name:var(--font-body)] text-lg w-6 h-6 flex items-center justify-center"
                        title="Sil"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <span className="text-5xl">📅</span>
              <p className="font-[family-name:var(--font-body)] text-lg text-[#505068] text-center">
                Takvimden bir gün seç!
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          4b. KONULAR SEKMESİ
          ══════════════════════════════════════════════════════════════════════ */}
      {aktifTab === "konular" && (
        <div>
          {/* Alt başlık + ders ekle butonu */}
          <div
            className="border-b-4 border-[#101010] px-4 py-3 flex items-center justify-between"
            style={{ background: "#181828" }}
          >
            <span className="font-[family-name:var(--font-body)] text-base text-[#A0A8C0]">
              {dersler.length} ders
            </span>
            <button
              onClick={() => setShowDersForm(v => !v)}
              className="border-2 border-[#A0A8C0] px-3 py-1.5 font-[family-name:var(--font-body)] text-base text-[#A0A8C0] hover:bg-[#282838] transition-colors"
            >
              + Ders
            </button>
          </div>

          {/* Ders ekleme formu */}
          {showDersForm && (
            <div className="border-b-4 border-[#101010] bg-[#E8E8F0] px-4 py-3">
              <form onSubmit={handleDersEkle} className="flex flex-col gap-3">
                <input
                  autoFocus
                  type="text"
                  placeholder="Ders adı (ör: Matematik)"
                  value={dersAd}
                  onChange={e => setDersAd(e.target.value)}
                  className="border-4 border-[#101010] bg-white px-3 py-2 font-[family-name:var(--font-body)] text-lg text-[#101010] outline-none focus:border-[#18C018] w-full"
                />
                <div className="flex gap-2 flex-wrap">
                  {RENKLER.map(r => (
                    <button
                      key={r} type="button" onClick={() => setDersRenk(r)}
                      className="w-8 h-8 border-4 transition-transform"
                      style={{
                        backgroundColor: r,
                        borderColor: dersRenk === r ? "#101010" : "#A0A8C0",
                        transform:   dersRenk === r ? "scale(1.15)" : "scale(1)",
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {IKONLAR.map(ic => (
                    <button
                      key={ic} type="button" onClick={() => setDersIcon(ic)}
                      className="text-xl w-9 h-9 border-4 transition-all"
                      style={{
                        borderColor:     dersIcon === ic ? "#101010" : "#A0A8C0",
                        backgroundColor: dersIcon === ic ? "#F0D000" : "white",
                      }}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit" disabled={isPending || !dersAd.trim()}
                    className="border-4 border-[#101010] px-4 py-1.5 font-[family-name:var(--font-body)] text-base bg-[#18C018] text-white shadow-[3px_3px_0_#101010] active:shadow-none active:translate-y-0.5 disabled:opacity-50"
                  >
                    Ekle
                  </button>
                  <button
                    type="button" onClick={() => setShowDersForm(false)}
                    className="border-4 border-[#A0A8C0] px-4 py-1.5 font-[family-name:var(--font-body)] text-base text-[#505068] hover:bg-[#D0D0DC]/20"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Ders sekmeleri */}
          {dersler.length > 0 && (
            <div className="border-b-4 border-[#101010] bg-[#E8E8F0] px-3 py-2 flex gap-2 overflow-x-auto">
              {dersler.map(d => {
                const aktifKonuSayi = d.konular.filter(k => !k.tamamlandi).length;
                const isAktif = aktifDersId === d.id;
                return (
                  <div key={d.id} className="flex-shrink-0 flex items-stretch">
                    <button
                      onClick={() => { setAktifDersId(d.id); setDersSilId(null); }}
                      className={`flex items-center gap-1.5 border-4 border-[#101010] pl-2.5 pr-2 py-1 font-[family-name:var(--font-body)] text-base transition-all ${
                        isAktif
                          ? "shadow-none translate-y-0.5"
                          : "shadow-[3px_3px_0_#101010] hover:shadow-[1px_1px_0_#101010]"
                      }`}
                      style={isAktif
                        ? { backgroundColor: d.renk, color: "#FFF" }
                        : { backgroundColor: "#FFFFFF", color: "#101010" }}
                    >
                      <span>{d.icon}</span>
                      <span>{d.ad}</span>
                      {aktifKonuSayi > 0 && (
                        <span
                          className="text-xs border-2 px-1 leading-tight"
                          style={isAktif
                            ? { borderColor: "rgba(255,255,255,0.5)", color: "rgba(255,255,255,0.9)" }
                            : { borderColor: "#A0A8C0", color: "#505068" }}
                        >
                          {aktifKonuSayi}
                        </span>
                      )}
                    </button>
                    {isAktif && (
                      dersSilId === d.id ? (
                        <div className="flex items-stretch border-4 border-l-0 border-[#D81818]">
                          <button
                            onClick={() => handleDersSil(d.id)}
                            className="px-2 bg-[#D81818] text-white font-[family-name:var(--font-body)] text-sm hover:bg-[#C01010]"
                          >
                            Evet, sil
                          </button>
                          <button
                            onClick={() => setDersSilId(null)}
                            className="px-2 bg-[#FFFFFF] text-[#101010] font-[family-name:var(--font-body)] text-sm border-l-2 border-[#D81818]"
                          >
                            İptal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDersSilId(d.id)}
                          className="border-4 border-l-0 border-[#101010] px-2 bg-[#FFFFFF] text-[#A0A8C0] hover:text-[#D81818] hover:bg-[#FFF0F0] transition-colors font-[family-name:var(--font-body)] text-base"
                          title="Dersi sil"
                        >
                          ✕
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* İçerik */}
          {!aktifDers ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 px-6">
              <span className="text-5xl">📚</span>
              <p className="font-[family-name:var(--font-body)] text-xl text-[#505068] text-center">
                {dersler.length === 0
                  ? "Henüz ders yok. Sağ üstten ders ekle!"
                  : "Yukarıdan bir ders seç."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col">

              {/* Progress bandı */}
              <div
                className="px-4 py-3 border-b-4 border-[#101010]"
                style={{ backgroundColor: aktifDers.renk + "18" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-[family-name:var(--font-body)] text-lg text-[#101010]">
                    {aktifDers.icon} {aktifDers.ad}
                  </span>
                  <span className="font-[family-name:var(--font-body)] text-base text-[#505068]">
                    {tamamSayi}/{konular.length} ✅
                  </span>
                </div>
                <div className="h-4 border-2 border-[#101010] bg-[#181828] relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: aktifDers.renk }}
                  />
                  {progress === 100 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-[family-name:var(--font-body)] text-xs text-white">
                        🌾 Hasat!
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Konu ekleme formu */}
              <form
                onSubmit={handleKonuEkle}
                className="border-b-4 border-[#101010] bg-white px-4 py-3 flex flex-col gap-2"
              >
                <div className="flex gap-2 items-center">
                  <input
                    ref={konuInputRef}
                    type="text"
                    placeholder="Konu ekle…"
                    value={konuBaslik}
                    onChange={e => setKonuBaslik(e.target.value)}
                    className="flex-1 border-4 border-[#101010] px-3 py-2 font-[family-name:var(--font-body)] text-lg text-[#101010] outline-none focus:border-[#18C018] bg-[#F8F8FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setKonuOncelik(v => v === 3 ? 1 : v + 1)}
                    className="w-10 h-10 border-4 border-[#101010] flex items-center justify-center text-xl flex-shrink-0 transition-all"
                    style={{ backgroundColor: ONCELIK[konuOncelik - 1].renk + "22" }}
                    title={ONCELIK[konuOncelik - 1].label}
                  >
                    <span style={{ color: ONCELIK[konuOncelik - 1].renk }}>
                      {ONCELIK[konuOncelik - 1].icon}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNote(v => !v)}
                    className={`w-10 h-10 border-4 border-[#101010] flex items-center justify-center text-lg flex-shrink-0 transition-all ${
                      showNote ? "bg-[#F0D000]" : "bg-white"
                    }`}
                    title="Not ekle"
                  >
                    📝
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || !konuBaslik.trim()}
                    className="border-4 border-[#101010] px-3 h-10 font-[family-name:var(--font-body)] text-base bg-[#18C018] text-white flex-shrink-0 shadow-[3px_3px_0_#101010] active:shadow-none active:translate-y-0.5 transition-all disabled:opacity-40"
                  >
                    + Ekle
                  </button>
                </div>
                {showNote && (
                  <input
                    type="text"
                    placeholder="Not (opsiyonel)"
                    value={konuAciklama}
                    onChange={e => setKonuAciklama(e.target.value)}
                    className="border-4 border-[#A0A8C0] px-3 py-1.5 font-[family-name:var(--font-body)] text-base text-[#101010] outline-none focus:border-[#18C018] bg-[#F8F8FF] w-full"
                  />
                )}
                <div className="flex gap-3">
                  {ONCELIK.map(o => (
                    <button
                      key={o.val} type="button" onClick={() => setKonuOncelik(o.val)}
                      className="font-[family-name:var(--font-body)] text-sm flex items-center gap-1 transition-all"
                      style={{
                        color:      konuOncelik === o.val ? o.renk : "#A0A8C0",
                        fontWeight: konuOncelik === o.val ? "bold" : "normal",
                      }}
                    >
                      <span>{o.icon}</span> {o.label}
                    </button>
                  ))}
                </div>
              </form>

              {/* Filtre sekmeleri */}
              <div className="flex border-b-4 border-[#101010] bg-[#E8E8F0]">
                {([
                  { key: "aktif",      label: "Aktif",      sayi: aktifSayi },
                  { key: "tamamlanan", label: "Tamamlanan", sayi: tamamSayi },
                  { key: "tumu",       label: "Tümü",       sayi: konular.length },
                ] as { key: Filtre; label: string; sayi: number }[]).map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFiltre(f.key)}
                    className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-r-4 last:border-r-0 border-[#101010] font-[family-name:var(--font-body)] text-base transition-all ${
                      filtre === f.key
                        ? "bg-[#101010] text-[#F0D000]"
                        : "text-[#101010] hover:bg-[#D8D8E8]"
                    }`}
                  >
                    {f.label}
                    {f.sayi > 0 && (
                      <span
                        className="text-xs border-2 px-1 leading-tight"
                        style={filtre === f.key
                          ? { borderColor: "#F0D000", color: "#F0D000" }
                          : { borderColor: "#A0A8C0", color: "#505068" }}
                      >
                        {f.sayi}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Konu listesi */}
              <div className="flex flex-col">
                {filtreliKonular.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-3">
                    <span className="text-4xl">
                      {filtre === "aktif" ? "🌾" : filtre === "tamamlanan" ? "📭" : "📝"}
                    </span>
                    <p className="font-[family-name:var(--font-body)] text-lg text-[#505068] text-center">
                      {filtre === "aktif"
                        ? "Tüm konular tamamlandı, harika!"
                        : filtre === "tamamlanan"
                        ? "Henüz tamamlanan konu yok."
                        : "Konu yok. Yukarıdan ekle!"}
                    </p>
                  </div>
                ) : (
                  filtreliKonular.map(k => (
                    <TodoItem
                      key={k.id}
                      konu={k}
                      dersRenk={aktifDers.renk}
                      onRefresh={loadDersler}
                    />
                  ))
                )}
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
