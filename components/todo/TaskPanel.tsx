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
  gorevRenk: string;
  onMonthChange: (y: number, m: number) => void;
  onSelectDate: React.Dispatch<React.SetStateAction<string | null>>;
  onShowGorevForm: React.Dispatch<React.SetStateAction<boolean>>;
  onGorevBaslik: React.Dispatch<React.SetStateAction<string>>;
  onGorevRenk: React.Dispatch<React.SetStateAction<string>>;
  onGorevEkle: (e: React.FormEvent) => Promise<void>;
  onGorevTamamla: (id: string) => Promise<void>;
  onGorevSil: (id: string) => Promise<void>;
}

export function TaskPanel({
  yil, ay, gorevler, selectedDate, showGorevForm, gorevBaslik, gorevRenk,
  onMonthChange, onSelectDate, onShowGorevForm, onGorevBaslik, onGorevRenk,
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
              style={{ color: "#F0D000", textShadow: "2px 2px 0 #3A1A08" }}
            >
              🗓️ {selectedDateLabel}
            </span>
            <button
              onClick={() => onShowGorevForm(v => !v)}
              className="font-[family-name:var(--font-pixel)] text-[10px] px-3 py-1 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: "#48B848",
                color: "#FFF",
                border: "3px solid #186818",
                boxShadow: "2px 2px 0 0 #101010",
                textShadow: "1px 1px 0 #186818",
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
              style={{ background: "#E8E0D0", borderBottom: "3px solid #C0C0D0" }}
            >
              <input
                type="text"
                placeholder="Görev başlığı..."
                value={gorevBaslik}
                onChange={e => onGorevBaslik(e.target.value)}
                autoFocus
                className="px-3 py-2 font-[family-name:var(--font-body)] text-lg outline-none w-full"
                style={{
                  background: "#F5E6C8",
                  border: "3px solid #5C3A1E",
                  color: "#3A2010",
                }}
              />
              <div className="flex gap-1.5 flex-wrap">
                {GOREV_RENKLER.map(r => (
                  <button
                    key={r} type="button" onClick={() => onGorevRenk(r)}
                    className="w-7 h-7 transition-transform cursor-pointer"
                    style={{
                      backgroundColor: r,
                      border: `3px solid ${gorevRenk === r ? "#101010" : "#C0C0D0"}`,
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
                    background: "#48B848",
                    color: "#FFF",
                    border: "3px solid #186818",
                    boxShadow: "2px 2px 0 0 #101010",
                  }}
                >
                  EKLE
                </button>
                <button
                  type="button" onClick={() => onShowGorevForm(false)}
                  className="font-[family-name:var(--font-pixel)] text-[10px] px-4 py-1.5 cursor-pointer"
                  style={{
                    background: "#F8F8F0",
                    color: "#585868",
                    border: "3px solid #C0C0D0",
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
              <p className="font-[family-name:var(--font-body)] text-lg" style={{ color: "#8B7A5A" }}>
                Bu gün için görev yok.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {selectedGorevler.map(g => (
                <div
                  key={g.id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{
                    background: g.tamamlandi ? "#E0F0E0" : "#F8F8F0",
                    borderBottom: "3px solid #C0C0D0",
                    borderLeft: `5px solid ${g.renk}`,
                  }}
                >
                  <button
                    onClick={() => !g.tamamlandi && onGorevTamamla(g.id)}
                    className="w-7 h-7 flex-shrink-0 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor: g.tamamlandi ? g.renk : "#F8F8F0",
                      border: "3px solid #101010",
                      boxShadow: g.tamamlandi ? "none" : "2px 2px 0 0 #101010",
                    }}
                    disabled={g.tamamlandi}
                  >
                    {g.tamamlandi && (
                      <span className="text-white text-base font-bold leading-none" style={{ textShadow: "1px 1px 0 #101010" }}>✓</span>
                    )}
                  </button>
                  <span
                    className={`flex-1 font-[family-name:var(--font-body)] text-lg ${g.tamamlandi ? "line-through" : ""}`}
                    style={{ color: g.tamamlandi ? "#585868" : "#101010" }}
                  >
                    {g.baslik}
                  </span>
                  <button
                    onClick={() => onGorevSil(g.id)}
                    className="font-[family-name:var(--font-body)] text-lg w-6 h-6 flex items-center justify-center cursor-pointer transition-colors"
                    title="Sil"
                    style={{ color: "#A0A8C0" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#E04048")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A0A8C0")}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </GameBox>
      ) : (
        <GameBox className="py-10 text-center">
          <span className="text-5xl block mb-3">🗺️</span>
          <p className="font-[family-name:var(--font-body)] text-lg" style={{ color: "#8B7A5A" }}>
            Takvimden bir gün seç!
          </p>
        </GameBox>
      )}
    </div>
  );
}
