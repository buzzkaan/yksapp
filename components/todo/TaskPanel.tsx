"use client";
import React from "react";
import { CalendarGrid } from "@/components/features/CalendarGrid";
import { GameBox } from "./GameBox";
import { formatDateStr } from "@/lib/utils/date";
import { GOREV_RENKLER } from "./constants";
import type { Gorev } from "@/lib/types";

interface TaskPanelProps {
  yil: number;
  ay: number;
  gorevler: Gorev[];
  selectedDate: string | null;
  showGorevForm: boolean;
  gorevBaslik: string;
  gorevAciklama: string;
  gorevOncelik: number;
  gorevRenk: string;
  istatistikler?: {
    bugun: Gorev[];
    bugunTamamlanan: number;
    bugunAktif: number;
    toplamTamam: number;
    toplamAktif: number;
    yuksekOncelik: number;
  };
  onMonthChange: (y: number, m: number) => void;
  onSelectDate: React.Dispatch<React.SetStateAction<string | null>>;
  onShowGorevForm: React.Dispatch<React.SetStateAction<boolean>>;
  onGorevBaslik: React.Dispatch<React.SetStateAction<string>>;
  onGorevAciklama: React.Dispatch<React.SetStateAction<string>>;
  onGorevOncelik: React.Dispatch<React.SetStateAction<number>>;
  onGorevRenk: React.Dispatch<React.SetStateAction<string>>;
  onGorevEkle: (e: React.FormEvent) => Promise<void>;
  onGorevTamamla: (id: string) => Promise<void>;
  onGorevSil: (id: string) => Promise<void>;
}

export function TaskPanel({
  yil, ay, gorevler, selectedDate, showGorevForm,
  gorevBaslik, gorevAciklama, gorevOncelik, gorevRenk,
  onMonthChange, onSelectDate, onShowGorevForm,
  onGorevBaslik, onGorevAciklama, onGorevOncelik, onGorevRenk,
  onGorevEkle, onGorevTamamla, onGorevSil,
}: TaskPanelProps) {
  const selectedGorevler = selectedDate
    ? gorevler.filter(g => formatDateStr(new Date(g.tarih)) === selectedDate)
    : [];

  const selectedDateLabel = selectedDate
    ? (() => {
      const [y, m, d] = selectedDate.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
    })()
    : null;

  return (
    <div className="flex flex-col gap-4" style={{ marginTop: "-4px" }}>
      <CalendarGrid
        yil={yil}
        ay={ay}
        gorevler={gorevler}
        onMonthChange={onMonthChange}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      {selectedDate ? (
        <GameBox>
          {/* Tarih başlığı */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{
              background: "#6B3A20",
              borderBottom: "4px solid #5C3A1E",
              boxShadow: "inset 0 -2px 0 0 #8B5A30",
            }}
          >
            <span
              className="font-[family-name:var(--font-pixel)] text-[12px]"
              style={{ color: "#FFD000", textShadow: "2px 2px 0 #3A1A08" }}
            >
              🗓️ {selectedDateLabel}
            </span>
            <button
              onClick={() => onShowGorevForm(v => !v)}
              className="font-[family-name:var(--font-pixel)] text-[10px] px-3 py-1 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: "#18C840",
                color: "#FFF",
                border: "3px solid #107030",
                boxShadow: "2px 2px 0 0 #101010",
                textShadow: "1px 1px 0 #107030",
              }}
            >
              + GÖREV
            </button>
          </div>

          {/* Görev ekleme formu */}
          {showGorevForm && (
            <form
              onSubmit={onGorevEkle}
              className="px-4 py-3 flex flex-col gap-2"
              style={{ background: "#E8D4B0", borderBottom: "3px solid #D0D0E8" }}
            >
              <input
                type="text"
                placeholder="Görev başlığı..."
                value={gorevBaslik}
                onChange={e => onGorevBaslik(e.target.value)}
                autoFocus
                className="px-3 py-2 font-[family-name:var(--font-body)] text-lg outline-none w-full"
                style={{
                  background: "#F5E0B0",
                  border: "3px solid #5C3A1E",
                  color: "#3A2010",
                }}
              />
              <input
                type="text"
                placeholder="Açıklama (opsiyonel)..."
                value={gorevAciklama}
                onChange={e => onGorevAciklama(e.target.value)}
                className="px-3 py-1.5 font-[family-name:var(--font-body)] text-sm outline-none w-full"
                style={{
                  background: "#F5E0B0",
                  border: "2px solid #C09060",
                  color: "#5A4030",
                }}
              />
              <div className="flex items-center gap-2">
                <span className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#5A4030" }}>Öncelik:</span>
                {[
                  { val: 1, label: "Düşük", color: "#18C840" },
                  { val: 2, label: "Orta", color: "#F89000" },
                  { val: 3, label: "Yüksek", color: "#E01828" },
                ].map(p => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => onGorevOncelik(p.val)}
                    className="font-[family-name:var(--font-pixel)] text-[9px] px-2 py-1 cursor-pointer"
                    style={{
                      background: gorevOncelik === p.val ? p.color : "#D0C4A0",
                      color: gorevOncelik === p.val ? "#FFF" : "#484858",
                      border: `2px solid ${gorevOncelik === p.val ? "#101010" : "#988860"}`,
                      boxShadow: gorevOncelik === p.val ? "2px 2px 0 0 #101010" : "none",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="font-[family-name:var(--font-body)] text-xs mr-1" style={{ color: "#5A4030" }}>Renk:</span>
                {GOREV_RENKLER.map(r => (
                  <button
                    key={r} type="button" onClick={() => onGorevRenk(r)}
                    className="w-6 h-6 transition-transform cursor-pointer"
                    style={{
                      backgroundColor: r,
                      border: `3px solid ${gorevRenk === r ? "#101010" : "#D0D0E8"}`,
                      transform: gorevRenk === r ? "scale(1.15)" : "scale(1)",
                      boxShadow: gorevRenk === r ? "2px 2px 0 0 #101010" : "none",
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="font-[family-name:var(--font-pixel)] text-[10px] px-4 py-1.5 cursor-pointer"
                  style={{
                    background: "#18C840",
                    color: "#FFF",
                    border: "3px solid #107030",
                    boxShadow: "2px 2px 0 0 #101010",
                  }}
                >
                  EKLE
                </button>
                <button
                  type="button" onClick={() => onShowGorevForm(false)}
                  className="font-[family-name:var(--font-pixel)] text-[10px] px-4 py-1.5 cursor-pointer"
                  style={{
                    background: "#F8F0DC",
                    color: "#484858",
                    border: "3px solid #D0D0E8",
                  }}
                >
                  İPTAL
                </button>
              </div>
            </form>
          )}

          {/* Görev listesi */}
          {selectedGorevler.length === 0 ? (
            <div className="py-8 text-center">
              <span className="text-3xl block mb-2">🌱</span>
              <p className="font-[family-name:var(--font-body)] text-lg" style={{ color: "#7A6840" }}>
                Bu gün için görev yok.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {selectedGorevler.map(g => {
                const isOverdue = !g.tamamlandi && selectedDate && selectedDate < formatDateStr(new Date());
                const oncelikColor = g.oncelik === 3 ? "#E01828" : g.oncelik === 2 ? "#F89000" : "#18C840";
                const oncelikLabel = g.oncelik === 3 ? "YÜKSEK" : g.oncelik === 2 ? "ORTA" : "DÜŞÜK";
                return (
                <div
                  key={g.id}
                  className="flex items-start gap-3 px-4 py-3"
                  style={{
                    background: g.tamamlandi ? "#CCF0B8" : isOverdue ? "#FFE8E8" : "#F8F0DC",
                    borderBottom: "3px solid #D0D0E8",
                    borderLeft: `5px solid ${g.renk}`,
                  }}
                >
                  <button
                    onClick={() => !g.tamamlandi && onGorevTamamla(g.id)}
                    className="w-7 h-7 flex-shrink-0 flex items-center justify-center transition-all hover:scale-110 cursor-pointer mt-0.5"
                    style={{
                      backgroundColor: g.tamamlandi ? g.renk : "#F8F0DC",
                      border: "3px solid #101010",
                      boxShadow: g.tamamlandi ? "none" : "2px 2px 0 0 #101010",
                    }}
                    disabled={g.tamamlandi}
                  >
                    {g.tamamlandi && (
                      <span className="text-white text-base font-bold leading-none" style={{ textShadow: "1px 1px 0 #101010" }}>✓</span>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-[family-name:var(--font-body)] text-lg ${g.tamamlandi ? "line-through" : ""}`}
                        style={{ color: g.tamamlandi ? "#484858" : "#101010" }}
                      >
                        {g.baslik}
                      </span>
                      {!g.tamamlandi && g.oncelik && g.oncelik !== 1 && (
                        <span
                          className="font-[family-name:var(--font-pixel)] text-[8px] px-1.5 py-0.5 flex-shrink-0"
                          style={{ backgroundColor: oncelikColor, color: "#FFF", textShadow: "1px 1px 0 #101010" }}
                        >
                          {oncelikLabel}
                        </span>
                      )}
                      {isOverdue && (
                        <span
                          className="font-[family-name:var(--font-pixel)] text-[8px] px-1.5 py-0.5 flex-shrink-0 animate-pulse"
                          style={{ backgroundColor: "#E01828", color: "#FFF" }}
                        >
                          GEÇ!
                        </span>
                      )}
                    </div>
                    {g.aciklama && (
                      <p
                        className="font-[family-name:var(--font-body)] text-sm mt-1"
                        style={{ color: "#484858" }}
                      >
                        {g.aciklama}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onGorevSil(g.id)}
                    className="font-[family-name:var(--font-body)] text-lg w-6 h-6 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                    title="Sil"
                    style={{ color: "#8890B8" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#E01828")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#8890B8")}
                  >
                    ✕
                  </button>
                </div>
              )})}
            </div>
          )}
        </GameBox>
      ) : (
        <GameBox className="py-10 text-center">
          <span className="text-5xl block mb-3">🗺️</span>
          <p className="font-[family-name:var(--font-body)] text-lg" style={{ color: "#7A6840" }}>
            Takvimden bir gün seç!
          </p>
        </GameBox>
      )}
    </div>
  );
}
