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
import { formatDateStr, hesaplaStreak } from "@/lib/utils/date";
import { DarkBox } from "@/components/todo/DarkBox";
import { TaskPanel } from "@/components/todo/TaskPanel";
import { SubjectPanel } from "@/components/todo/SubjectPanel";
import { RENKLER, GOREV_RENKLER, IKONLAR } from "@/components/todo/constants";
import type { DersWithKonular, Gorev } from "@/lib/types";
import toast from "react-hot-toast";

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

  function handleMonthChange(y: number, m: number) { setYil(y); setAy(m); setSelectedDate(null); }

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
    <div className="min-h-screen py-4 px-3 sm:px-4" style={{ background: "#E8E0D0" }}>
      <div className="max-w-4xl mx-auto flex flex-col gap-4">

        {/* Başlık */}
        <DarkBox className="px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚔️</span>
              <div>
                <h1
                  className="font-[family-name:var(--font-pixel)] text-[14px] leading-tight"
                  style={{ color: "#F8D030", textShadow: "2px 2px 0 #504000" }}
                >
                  YAPILACAKLAR
                </h1>
                <p className="font-[family-name:var(--font-body)] text-base mt-0.5" style={{ color: "#A0A8C0" }}>
                  Görevler &amp; Konular
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {streakInfo.best > 0 && (
                <div className="px-2 py-1 flex items-center gap-1" style={{ background: "#101010", border: "3px solid #4088F0" }}>
                  <span className="text-sm">🏆</span>
                  <span className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#F8D030" }}>
                    {streakInfo.best}
                  </span>
                </div>
              )}
              {streakInfo.current > 0 && (
                <div className="px-2.5 py-1 flex items-center gap-1.5" style={{ background: "#101010", border: "3px solid #F8D030", boxShadow: "0 0 8px #F8D03044" }}>
                  <span className="text-base">🔥</span>
                  <span className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#F8D030" }}>
                    {streakInfo.current} GÜN
                  </span>
                </div>
              )}
            </div>
          </div>
        </DarkBox>

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
                background: "#F8F8F0", border: "4px solid #101010", borderBottom: "4px solid #F8F8F0",
                color: "#4088F0", marginBottom: "-4px", position: "relative", zIndex: 2,
              } : {
                background: "#181828", border: "4px solid #101010", color: "#A0A8C0", boxShadow: "2px 2px 0 0 #101010",
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
            gorevBaslik={gorevBaslik} gorevRenk={gorevRenk}
            onMonthChange={handleMonthChange} onSelectDate={setSelectedDate}
            onShowGorevForm={setShowGorevForm} onGorevBaslik={setGorevBaslik}
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
  );
}
