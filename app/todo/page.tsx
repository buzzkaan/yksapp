"use client";
import { useState, useEffect, useTransition, useRef, useMemo } from "react";
import Image from "next/image";
import {
  derslerGetir, dersEkle, dersSil,
  konuEkle, konuToggle, konuSil,
} from "@/server/actions/konular";
import {
  aylikGorevlerGetir, gorevEkle, gorevTamamla, gorevSil,
  tamamlananGunleriGetir,
} from "@/server/actions/takvim";
import { formatDateStr, hesaplaStreak } from "@/lib/utils/date";
import { TaskPanel } from "@/components/todo/TaskPanel";
import { SubjectPanel } from "@/components/todo/SubjectPanel";
import { RENKLER, GOREV_RENKLER, IKONLAR } from "@/components/todo/constants";
import type { DersWithKonular, Gorev } from "@/lib/types";
import toast from "react-hot-toast";
import { ICONS } from "@/lib/constants/icons";

type Filtre = "aktif" | "tamamlanan" | "tumu";
type Tab = "takvim" | "konular";

export default function YapilacaklarPage() {
  const [streakDates, setStreakDates] = useState<string[]>([]);
  const [aktifTab, setAktifTab] = useState<Tab>("takvim");

  const now = new Date();
  const [yil, setYil] = useState(now.getFullYear());
  const [ay, setAy] = useState(now.getMonth() + 1);
  const [gorevler, setGorevler] = useState<Gorev[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(formatDateStr(now));
  const [showGorevForm, setShowGorevForm] = useState(false);
  const [gorevBaslik, setGorevBaslik] = useState("");
  const [gorevAciklama, setGorevAciklama] = useState("");
  const [gorevOncelik, setGorevOncelik] = useState(1);
  const [gorevRenk, setGorevRenk] = useState(GOREV_RENKLER[0]);

  const [dersler, setDersler] = useState<DersWithKonular[]>([]);
  const [aktifDersId, setAktifDersId] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<Filtre>("aktif");
  const [showDersForm, setShowDersForm] = useState(false);
  const [dersSilId, setDersSilId] = useState<string | null>(null);
  const [konuBaslik, setKonuBaslik] = useState("");
  const [konuAciklama, setKonuAciklama] = useState("");
  const [konuOncelik, setKonuOncelik] = useState(1);
  const [showNote, setShowNote] = useState(false);
  const [dersAd, setDersAd] = useState("");
  const [dersRenk, setDersRenk] = useState(RENKLER[0]);
  const [dersIcon, setDersIcon] = useState(IKONLAR[0]);
  const [isPending, startT] = useTransition();
  const konuInputRef = useRef<HTMLInputElement>(null);

  async function loadStreak() { setStreakDates(await tamamlananGunleriGetir()); }
  async function loadGorevler(y = yil, m = ay) { setGorevler(await aylikGorevlerGetir(y, m)); }
  async function loadDersler() { setDersler(await derslerGetir()); }

  useEffect(() => { loadStreak(); loadDersler(); }, []);
  useEffect(() => { loadGorevler(yil, ay); }, [yil, ay]);

  const streakInfo = hesaplaStreak(streakDates);

  const bugunStr = formatDateStr(now);
  const istatistikler = useMemo(() => {
    const aylik = gorevler;
    const bugun = aylik.filter(g => formatDateStr(new Date(g.tarih)) === bugunStr);
    const bugunTamamlanan = bugun.filter(g => g.tamamlandi).length;
    const bugunAktif = bugun.filter(g => !g.tamamlandi).length;
    const toplamTamam = aylik.filter(g => g.tamamlandi).length;
    const toplamAktif = aylik.filter(g => !g.tamamlandi).length;
    const yuksekOncelik = aylik.filter(g => !g.tamamlandi && g.oncelik === 3).length;
    return { bugun, bugunTamamlanan, bugunAktif, toplamTamam, toplamAktif, yuksekOncelik };
  }, [gorevler, bugunStr]);

  function handleMonthChange(y: number, m: number) { setYil(y); setAy(m); setSelectedDate(null); }

  async function handleGorevEkle(e: React.FormEvent) {
    e.preventDefault();
    if (!gorevBaslik.trim() || !selectedDate) return;
    const [y, m, d] = selectedDate.split("-").map(Number);
    await gorevEkle({ 
      tarih: new Date(y, m - 1, d), 
      baslik: gorevBaslik, 
      aciklama: gorevAciklama || undefined,
      oncelik: gorevOncelik,
      renk: gorevRenk 
    });
    setGorevBaslik(""); setGorevAciklama(""); setGorevOncelik(1); setShowGorevForm(false);
    toast.success("📅 Görev eklendi!");
    await loadGorevler();
  }

  async function handleGorevTamamla(id: string) {
    await gorevTamamla(id);
    toast.success("✅ Görev tamamlandı!");
    await loadGorevler(); await loadStreak();
  }

  async function handleGorevSil(id: string) {
    await gorevSil(id);
    toast("🗑️ Görev silindi", { icon: "⚠️" });
    await loadGorevler(); await loadStreak();
  }

  async function loadVeSecSon() {
    const data = await derslerGetir();
    setDersler(data);
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

  return (
    <div className="min-h-screen">

      {/* ── Header ── */}
      <div
        className="relative border-b-4 px-4 py-5"
        style={{
          background: "#000058",
          borderColor: "#000000",
          boxShadow: "0 4px 0 0 #000000",
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: "#FFD000" }} />
        <div className="absolute right-0 top-0 bottom-0 w-1.5" style={{ background: "#FFD000" }} />
        <div className="flex items-center justify-between pl-3 pr-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image src={ICONS.chat} alt="yapilacaklar" fill className="object-contain" />
            </div>
            <div>
              <h1
                className="font-[family-name:var(--font-pixel)] leading-tight"
                style={{ fontSize: "11px", color: "#FFD000", textShadow: "2px 2px 0 #804000", letterSpacing: "0.1em" }}
              >
                YAPILACAKLAR
              </h1>
              <p className="font-[family-name:var(--font-body)] text-xl mt-1" style={{ color: "#A8C8F8" }}>
                Görevler &amp; Konular
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {streakInfo.best > 0 && (
              <div className="px-2 py-1 flex items-center gap-1" style={{ background: "#000000", border: "3px solid #FFD000" }}>
                <span className="text-sm">🏆</span>
                <span className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#FFD000" }}>
                  {streakInfo.best}
                </span>
              </div>
            )}
            {streakInfo.current > 0 && (
              <div className="px-2.5 py-1 flex items-center gap-1.5" style={{ background: "#FFD000", border: "3px solid #000000" }}>
                <span className="text-base">🔥</span>
                <span className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#000000" }}>
                  {streakInfo.current} GÜN
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-4 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">

        {/* İstatistik kartları */}
        {aktifTab === "takvim" && (
          <div className="grid grid-cols-4 gap-2">
            <div className="border-4 border-[#000000] p-2 text-center" style={{ background: "#000058", boxShadow: "3px 3px 0 0 #000000" }}>
              <div className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#A8C8F8" }}>BUGÜN</div>
              <div className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#0058F8" }}>{istatistikler.bugun.length}</div>
            </div>
            <div className="border-4 border-[#000000] p-2 text-center" style={{ background: "#006800", boxShadow: "3px 3px 0 0 #000000" }}>
              <div className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#FFD000" }}>TAMAM</div>
              <div className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#00A800" }}>{istatistikler.bugunTamamlanan}</div>
            </div>
            <div className="border-4 border-[#000000] p-2 text-center" style={{ background: "#804000", boxShadow: "3px 3px 0 0 #000000" }}>
              <div className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#FFD000" }}>AKTİF</div>
              <div className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#FFD000" }}>{istatistikler.bugunAktif}</div>
            </div>
            <div className="border-4 border-[#000000] p-2 text-center" style={{ background: "#880000", boxShadow: "3px 3px 0 0 #000000" }}>
              <div className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#FFD000" }}>ACİL</div>
              <div className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#E40000" }}>{istatistikler.yuksekOncelik}</div>
            </div>
          </div>
        )}

        {/* Sekme çubuğu */}
        <div className="flex gap-2">
          {([
            { key: "takvim" as Tab, label: "📅 TAKVİM" },
            { key: "konular" as Tab, label: "📚 KONULAR" },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setAktifTab(tab.key)}
              className="flex-1 py-2.5 font-[family-name:var(--font-pixel)] text-[11px] transition-all cursor-pointer select-none"
              style={aktifTab === tab.key ? {
                background: "#C88040", borderTop: "4px solid #000000", borderLeft: "4px solid #000000", borderRight: "4px solid #000000", borderBottom: "4px solid #C88040",
                color: "#000000", marginBottom: "-4px", position: "relative", zIndex: 2,
              } : {
                background: "#000058", borderTop: "4px solid #000000", borderLeft: "4px solid #000000", borderRight: "4px solid #000000", borderBottom: "4px solid #000000", color: "#A8C8F8", boxShadow: "2px 2px 0 0 #000000",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {aktifTab === "takvim" && (
          <TaskPanel
            yil={yil} ay={ay} gorevler={gorevler}
            selectedDate={selectedDate} showGorevForm={showGorevForm}
            gorevBaslik={gorevBaslik} gorevAciklama={gorevAciklama}
            gorevOncelik={gorevOncelik} gorevRenk={gorevRenk}
            istatistikler={istatistikler}
            onMonthChange={handleMonthChange} onSelectDate={setSelectedDate}
            onShowGorevForm={setShowGorevForm} onGorevBaslik={setGorevBaslik}
            onGorevAciklama={setGorevAciklama} onGorevOncelik={setGorevOncelik}
            onGorevRenk={setGorevRenk} onGorevEkle={handleGorevEkle}
            onGorevTamamla={handleGorevTamamla} onGorevSil={handleGorevSil}
          />
        )}

        {aktifTab === "konular" && (
          <SubjectPanel
            dersler={dersler} aktifDersId={aktifDersId} filtre={filtre}
            showDersForm={showDersForm} dersSilId={dersSilId}
            konuBaslik={konuBaslik} konuAciklama={konuAciklama}
            konuOncelik={konuOncelik} showNote={showNote}
            dersAd={dersAd} dersRenk={dersRenk} dersIcon={dersIcon}
            isPending={isPending} konuInputRef={konuInputRef}
            onAktifDersId={setAktifDersId} onFiltre={setFiltre}
            onShowDersForm={setShowDersForm} onDersSilId={setDersSilId}
            onKonuBaslik={setKonuBaslik} onKonuAciklama={setKonuAciklama}
            onKonuOncelik={setKonuOncelik} onShowNote={setShowNote}
            onDersAd={setDersAd} onDersRenk={setDersRenk} onDersIcon={setDersIcon}
            onDersEkle={handleDersEkle} onKonuEkle={handleKonuEkle}
            onDersSil={handleDersSil} onRefresh={loadDersler}
          />
        )}

      </div>
      </div>
    </div>
  );
}
