"use client";
import { useState, useEffect, useTransition, useRef, useMemo } from "react";
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
    <div className="min-h-screen py-4 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">

        {/* Başlık */}
        <DarkBox className="px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚔️</span>
              <div>
                <h1
                  className="font-[family-name:var(--font-pixel)] text-[14px] leading-tight"
                  style={{ color: "#FFD000", textShadow: "2px 2px 0 #504000" }}
                >
                  YAPILACAKLAR
                </h1>
                <p className="font-[family-name:var(--font-body)] text-base mt-0.5" style={{ color: "#8890B8" }}>
                  Görevler &amp; Konular
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {streakInfo.best > 0 && (
                <div className="px-2 py-1 flex items-center gap-1" style={{ background: "#101010", border: "3px solid #2878F8" }}>
                  <span className="text-sm">🏆</span>
                  <span className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#FFD000" }}>
                    {streakInfo.best}
                  </span>
                </div>
              )}
              {streakInfo.current > 0 && (
                <div className="px-2.5 py-1 flex items-center gap-1.5" style={{ background: "#101010", border: "3px solid #FFD000", boxShadow: "0 0 8px #FFD00044" }}>
                  <span className="text-base">🔥</span>
                  <span className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#FFD000" }}>
                    {streakInfo.current} GÜN
                  </span>
                </div>
              )}
            </div>
          </div>
        </DarkBox>

        {/* İstatistik kartları */}
        {aktifTab === "takvim" && (
          <div className="grid grid-cols-4 gap-2">
            <div className="border-3 border-[#101010] p-2 text-center" style={{ background: "#F8F0DC", boxShadow: "3px 3px 0 0 #101010" }}>
              <div className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#484858" }}>BUGÜN</div>
              <div className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#2878F8" }}>{istatistikler.bugun.length}</div>
            </div>
            <div className="border-3 border-[#101010] p-2 text-center" style={{ background: "#CCF0B8", boxShadow: "3px 3px 0 0 #101010" }}>
              <div className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#18C840" }}>TAMAM</div>
              <div className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#18C840" }}>{istatistikler.bugunTamamlanan}</div>
            </div>
            <div className="border-3 border-[#101010] p-2 text-center" style={{ background: "#FFF8E0", boxShadow: "3px 3px 0 0 #101010" }}>
              <div className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#F89000" }}>AKTİF</div>
              <div className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#F89000" }}>{istatistikler.bugunAktif}</div>
            </div>
            <div className="border-3 border-[#101010] p-2 text-center" style={{ background: "#FFE0E0", boxShadow: "3px 3px 0 0 #101010" }}>
              <div className="font-[family-name:var(--font-pixel)] text-[10px]" style={{ color: "#E01828" }}>ACİL</div>
              <div className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#E01828" }}>{istatistikler.yuksekOncelik}</div>
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
                background: "#F8F0DC", borderTop: "4px solid #101010", borderLeft: "4px solid #101010", borderRight: "4px solid #101010", borderBottom: "4px solid #F8F0DC",
                color: "#2878F8", marginBottom: "-4px", position: "relative", zIndex: 2,
              } : {
                background: "#181838", borderTop: "4px solid #101010", borderLeft: "4px solid #101010", borderRight: "4px solid #101010", borderBottom: "4px solid #101010", color: "#8890B8", boxShadow: "2px 2px 0 0 #101010",
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
  );
}
