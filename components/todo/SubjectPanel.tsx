"use client";
import React from "react";
import { GameBox } from "./GameBox";
import { DarkBox } from "./DarkBox";
import { TodoItem } from "./TodoItem";
import { RENKLER, IKONLAR, ONCELIK } from "./constants";
import type { DersWithKonular } from "@/lib/types";

type Filtre = "aktif" | "tamamlanan" | "tumu";

interface SubjectPanelProps {
  dersler: DersWithKonular[];
  aktifDersId: string | null;
  filtre: Filtre;
  showDersForm: boolean;
  dersSilId: string | null;
  konuBaslik: string;
  konuAciklama: string;
  konuOncelik: number;
  showNote: boolean;
  dersAd: string;
  dersRenk: string;
  dersIcon: string;
  isPending: boolean;
  konuInputRef: React.RefObject<HTMLInputElement | null>;
  onAktifDersId: React.Dispatch<React.SetStateAction<string | null>>;
  onFiltre: React.Dispatch<React.SetStateAction<Filtre>>;
  onShowDersForm: React.Dispatch<React.SetStateAction<boolean>>;
  onDersSilId: React.Dispatch<React.SetStateAction<string | null>>;
  onKonuBaslik: React.Dispatch<React.SetStateAction<string>>;
  onKonuAciklama: React.Dispatch<React.SetStateAction<string>>;
  onKonuOncelik: React.Dispatch<React.SetStateAction<number>>;
  onShowNote: React.Dispatch<React.SetStateAction<boolean>>;
  onDersAd: React.Dispatch<React.SetStateAction<string>>;
  onDersRenk: React.Dispatch<React.SetStateAction<string>>;
  onDersIcon: React.Dispatch<React.SetStateAction<string>>;
  onDersEkle: (e: React.FormEvent) => void;
  onKonuEkle: (e: React.FormEvent) => void;
  onDersSil: (id: string) => void;
  onRefresh: () => Promise<void>;
}

export function SubjectPanel({
  dersler, aktifDersId, filtre, showDersForm, dersSilId,
  konuBaslik, konuAciklama, konuOncelik, showNote,
  dersAd, dersRenk, dersIcon, isPending, konuInputRef,
  onAktifDersId, onFiltre, onShowDersForm, onDersSilId,
  onKonuBaslik, onKonuAciklama, onKonuOncelik, onShowNote,
  onDersAd, onDersRenk, onDersIcon,
  onDersEkle, onKonuEkle, onDersSil, onRefresh,
}: SubjectPanelProps) {
  const aktifDers = dersler.find(d => d.id === aktifDersId) ?? null;
  const konular = aktifDers?.konular ?? [];
  const aktifSayi = konular.filter(k => !k.tamamlandi).length;
  const tamamSayi = konular.filter(k => k.tamamlandi).length;
  const progress = konular.length > 0 ? (tamamSayi / konular.length) * 100 : 0;
  const filtreliKonular = konular.filter(k =>
    filtre === "aktif" ? !k.tamamlandi :
      filtre === "tamamlanan" ? k.tamamlandi : true
  );

  return (
    <div className="flex flex-col gap-4" style={{ marginTop: "-4px" }}>

      {/* Alt başlık + ders ekle */}
      <DarkBox className="px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="font-body text-base" style={{ color: "#A8C8F8" }}>
            📦 {dersler.length} ders
          </span>
          <button
            onClick={() => onShowDersForm(v => !v)}
            className="font-pixel text-[10px] px-3 py-1 cursor-pointer transition-all hover:scale-105"
            style={{
              background: "#000000",
              color: "#A8C8F8",
              border: "3px solid #FFD000",
              boxShadow: "2px 2px 0 0 #804000",
            }}
          >
            + DERS
          </button>
        </div>
      </DarkBox>

      {/* Ders ekleme formu */}
      {showDersForm && (
        <GameBox className="px-4 py-3">
          <form onSubmit={onDersEkle} className="flex flex-col gap-3">
            <input
              autoFocus
              type="text"
              placeholder="Ders adı (ör: Matematik)"
              value={dersAd}
              onChange={e => onDersAd(e.target.value)}
              className="px-3 py-2 font-body text-lg outline-none w-full"
              style={{
                background: "#A8A8A8",
                border: "3px solid #000000",
                color: "#000000",
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {RENKLER.map(r => (
                <button
                  key={r} type="button" onClick={() => onDersRenk(r)}
                  className="w-8 h-8 transition-transform cursor-pointer"
                  style={{
                    backgroundColor: r,
                    border: `3px solid ${dersRenk === r ? "#000000" : "#000000"}`,
                    transform: dersRenk === r ? "scale(1.15)" : "scale(1)",
                    boxShadow: dersRenk === r ? "2px 2px 0 0 #000000" : "none",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {IKONLAR.map(ic => (
                <button
                  key={ic} type="button" onClick={() => onDersIcon(ic)}
                  className="text-xl w-9 h-9 transition-all cursor-pointer"
                  style={{
                    border: `3px solid ${dersIcon === ic ? "#000000" : "#000000"}`,
                    backgroundColor: dersIcon === ic ? "#FFD000" : "#A8A8A8",
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="submit" disabled={isPending || !dersAd.trim()}
                className="font-pixel text-[10px] px-4 py-1.5 cursor-pointer disabled:opacity-50"
                style={{
                  background: "#00A800",
                  color: "#FFF",
                  border: "3px solid #0A5A0A",
                  boxShadow: "2px 2px 0 0 #3A2010",
                }}
              >
                EKLE
              </button>
              <button
                type="button" onClick={() => onShowDersForm(false)}
                className="font-pixel text-[10px] px-4 py-1.5 cursor-pointer"
                style={{
                  background: "#A8A8A8",
                  color: "#6878A8",
                  border: "3px solid #000000",
                }}
              >
                İPTAL
              </button>
            </div>
          </form>
        </GameBox>
      )}

      {/* Ders sekmeleri - inventory slot tarzı */}
      {dersler.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 px-1">
          {dersler.map(d => {
            const aktifKonuSayi = d.konular.filter(k => !k.tamamlandi).length;
            const isAktif = aktifDersId === d.id;
            return (
              <div key={d.id} className="flex-shrink-0 flex items-stretch">
                <button
                  onClick={() => { onAktifDersId(d.id); onDersSilId(null); }}
                  className="flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 font-body text-base transition-all cursor-pointer"
                  style={isAktif ? {
                    backgroundColor: d.renk,
                    color: "#FFF",
                    border: "4px solid #000000",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)",
                    textShadow: "1px 1px 0 #000000",
                  } : {
                    backgroundColor: "#A8A8A8",
                    color: "#000000",
                    border: "4px solid #000000",
                    boxShadow: "3px 3px 0 0 #000000",
                  }}
                >
                  <span>{d.icon}</span>
                  <span>{d.ad}</span>
                  {aktifKonuSayi > 0 && (
                    <span
                      className="text-xs px-1 leading-tight"
                      style={isAktif
                        ? { border: "2px solid rgba(255,255,255,0.5)", color: "rgba(255,255,255,0.9)" }
                        : { border: "2px solid #000000", color: "#6878A8" }}
                    >
                      {aktifKonuSayi}
                    </span>
                  )}
                </button>
                {isAktif && (
                  dersSilId === d.id ? (
                    <div className="flex items-stretch" style={{ border: "4px solid #CC0820", borderLeft: "none" }}>
                      <button
                        onClick={() => onDersSil(d.id)}
                        className="px-2 font-body text-sm cursor-pointer"
                        style={{ background: "#CC0820", color: "#FFF" }}
                      >
                        Evet
                      </button>
                      <button
                        onClick={() => onDersSilId(null)}
                        className="px-2 font-body text-sm cursor-pointer"
                        style={{ background: "#A8A8A8", color: "#6878A8", borderLeft: "2px solid #E01828" }}
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onDersSilId(d.id)}
                      className="px-2 font-body text-base cursor-pointer text-mario-light hover:text-mario-red transition-colors bg-mario-stone border-4 border-black border-l-0"
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
        <GameBox className="py-14 text-center">
          <span className="text-5xl block mb-3">📚</span>
          <p className="font-body text-xl" style={{ color: "#6878A8" }}>
            {dersler.length === 0
              ? "Henüz ders yok. Yukarıdan ders ekle!"
              : "Yukarıdan bir ders seç."}
          </p>
        </GameBox>
      ) : (
        <GameBox>
          {/* XP / Progress bar */}
          <div
            className="px-4 py-3"
            style={{
              background: "#6B3A20",
              borderBottom: "4px solid #5C3A1E",
              boxShadow: "inset 0 -2px 0 0 #8B5A30",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="font-pixel text-[12px]"
                style={{ color: "#FFD000", textShadow: "2px 2px 0 #804000" }}
              >
                {aktifDers.icon} {aktifDers.ad.toUpperCase()}
              </span>
              <span className="font-pixel text-[10px]" style={{ color: "#A8C8F8" }}>
                {tamamSayi}/{konular.length} ✅
              </span>
            </div>
            <div className="h-5 relative overflow-hidden" style={{ background: "#000058", border: "3px solid #000000" }}>
              <div
                className="absolute inset-y-0 left-0 transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: progress === 100
                    ? "linear-gradient(180deg, #FFD000, #C09000)"
                    : `linear-gradient(180deg, ${aktifDers.renk}, ${aktifDers.renk}CC)`,
                  boxShadow: "inset 0 -2px 0 0 rgba(0,0,0,0.3), inset 0 2px 0 0 rgba(255,255,255,0.2)",
                }}
              />
              {progress === 100 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-pixel text-[9px]" style={{ color: "#000000", textShadow: "0 1px 0 #FFD000" }}>
                    🏆 CLEAR!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Konu ekleme formu */}
          <form
            onSubmit={onKonuEkle}
            className="px-4 py-3 flex flex-col gap-2"
            style={{ background: "#ECD0A0", borderBottom: "3px solid #C49450" }}
          >
            <div className="flex gap-2 items-center">
              <input
                ref={konuInputRef}
                type="text"
                placeholder="Konu ekle…"
                value={konuBaslik}
                onChange={e => onKonuBaslik(e.target.value)}
                className="flex-1 px-3 py-2 font-body text-lg outline-none"
                style={{
                  background: "#F5E0B0",
                  border: "3px solid #5C3A1E",
                  color: "#3A2010",
                }}
              />
              <button
                type="button"
                onClick={() => onKonuOncelik(v => v === 3 ? 1 : v + 1)}
                className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0 transition-all cursor-pointer"
                style={{ background: "#F5E0B0", border: "3px solid #5C3A1E" }}
                title={ONCELIK[konuOncelik - 1].label}
              >
                <span style={{ color: ONCELIK[konuOncelik - 1].renk }}>
                  {ONCELIK[konuOncelik - 1].icon}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onShowNote(v => !v)}
                className="w-10 h-10 flex items-center justify-center text-lg flex-shrink-0 transition-all cursor-pointer"
                style={{ background: showNote ? "#FFD000" : "#A8A8A8", border: "3px solid #000000" }}
                title="Not ekle"
              >
                📝
              </button>
              <button
                type="submit"
                disabled={isPending || !konuBaslik.trim()}
                className="font-pixel text-[10px] px-3 h-10 flex-shrink-0 transition-all disabled:opacity-40 cursor-pointer"
                style={{
                  background: "#00A800",
                  color: "#FFF",
                  border: "3px solid #0A5A0A",
                  boxShadow: "2px 2px 0 0 #3A2010",
                }}
              >
                + EKLE
              </button>
            </div>
            {showNote && (
              <input
                type="text"
                placeholder="Not (opsiyonel)"
                value={konuAciklama}
                onChange={e => onKonuAciklama(e.target.value)}
                className="px-3 py-1.5 font-body text-base outline-none w-full"
                style={{
                  background: "#A8A8A8",
                  border: "3px solid #000000",
                  color: "#000000",
                }}
              />
            )}
            <div className="flex gap-3">
              {ONCELIK.map(o => (
                <button
                  key={o.val} type="button" onClick={() => onKonuOncelik(o.val)}
                  className="font-body text-sm flex items-center gap-1 transition-all cursor-pointer"
                  style={{
                    color: konuOncelik === o.val ? o.renk : "#A8C8F8",
                    fontWeight: konuOncelik === o.val ? "bold" : "normal",
                  }}
                >
                  <span>{o.icon}</span> {o.label}
                </button>
              ))}
            </div>
          </form>

          {/* Filtre sekmeleri */}
          <div className="flex" style={{ borderBottom: "3px solid #000000" }}>
            {([
              { key: "aktif", label: "Aktif", sayi: aktifSayi },
              { key: "tamamlanan", label: "Tamamlanan", sayi: tamamSayi },
              { key: "tumu", label: "Tümü", sayi: konular.length },
            ] as { key: Filtre; label: string; sayi: number }[]).map(f => (
              <button
                key={f.key}
                onClick={() => onFiltre(f.key)}
                className="flex-1 py-2 flex items-center justify-center gap-1.5 font-body text-base transition-all cursor-pointer"
                style={filtre === f.key ? {
                  background: "#000000",
                  color: "#FFD000",
                  borderRight: "3px solid #000000",
                } : {
                  background: "#A8A8A8",
                  color: "#6878A8",
                  borderRight: "3px solid #000000",
                }}
              >
                {f.label}
                {f.sayi > 0 && (
                  <span
                    className="text-xs px-1 leading-tight"
                    style={filtre === f.key
                      ? { border: "2px solid #FFFFFF", color: "#FFFFFF" }
                      : { border: "2px solid #000000", color: "#6878A8" }}
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
              <div className="py-10 text-center" style={{ background: "#A8A8A8" }}>
                <span className="text-4xl block mb-2">
                  {filtre === "aktif" ? "🏆" : filtre === "tamamlanan" ? "📭" : "📝"}
                </span>
                <p className="font-body text-lg" style={{ color: "#6878A8" }}>
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
                  onRefresh={onRefresh}
                />
              ))
            )}
          </div>
        </GameBox>
      )}
    </div>
  );
}
