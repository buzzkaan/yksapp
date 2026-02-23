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
      return new Date(y, m - 1, d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
    })()
    : null;

  const tamamlanan = selectedGorevler.filter(g => g.tamamlandi).length;
  const toplam = selectedGorevler.length;
  const todayStr = formatDateStr(new Date());

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
          {/* ── Tarih başlığı ── */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{
              background: "#181838",
              borderBottom: "4px solid #101010",
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#606878" }}>◆</span>
              <span
                className="font-[family-name:var(--font-pixel)] text-[11px] truncate"
                style={{ color: "#FFD000", textShadow: "2px 2px 0 #504000" }}
              >
                {selectedDateLabel}
              </span>
              {toplam > 0 && (
                <span
                  className="font-[family-name:var(--font-pixel)] text-[9px] px-1.5 py-0.5 flex-shrink-0"
                  style={{
                    background: tamamlanan === toplam ? "#18C840" : "#101010",
                    color: tamamlanan === toplam ? "#FFF" : "#8890B8",
                    border: "2px solid #101010",
                  }}
                >
                  {tamamlanan}/{toplam}
                </span>
              )}
            </div>
            <button
              onClick={() => onShowGorevForm(v => !v)}
              className="font-[family-name:var(--font-pixel)] text-[10px] px-3 py-1.5 transition-all cursor-pointer flex-shrink-0"
              style={{
                background: showGorevForm ? "#484858" : "#18C840",
                color: "#FFF",
                border: "3px solid #101010",
                boxShadow: showGorevForm ? "none" : "2px 2px 0 0 #101010",
              }}
            >
              {showGorevForm ? "✕ İPTAL" : "+ GÖREV"}
            </button>
          </div>

          {/* ── Görev ekleme formu ── */}
          {showGorevForm && (
            <form
              onSubmit={onGorevEkle}
              className="px-4 py-3 flex flex-col gap-2.5"
              style={{ background: "#F0E8D8", borderBottom: "4px solid #101010" }}
            >
              <input
                type="text"
                placeholder="Görev başlığı..."
                value={gorevBaslik}
                onChange={e => onGorevBaslik(e.target.value)}
                autoFocus
                className="px-3 py-2 font-[family-name:var(--font-body)] text-xl outline-none w-full"
                style={{
                  background: "#FAFAF0",
                  border: "3px solid #101010",
                  color: "#101010",
                  boxShadow: "inset 2px 2px 0 0 #D0C8B0",
                }}
              />
              <input
                type="text"
                placeholder="Açıklama (opsiyonel)..."
                value={gorevAciklama}
                onChange={e => onGorevAciklama(e.target.value)}
                className="px-3 py-1.5 font-[family-name:var(--font-body)] text-lg outline-none w-full"
                style={{
                  background: "#FAFAF0",
                  border: "2px solid #C0B890",
                  color: "#484858",
                  boxShadow: "inset 1px 1px 0 0 #D0C8B0",
                }}
              />

              {/* Öncelik */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#606878" }}>ÖNCELİK</span>
                {[
                  { val: 1, label: "DÜŞÜK", color: "#18C840", dark: "#107030" },
                  { val: 2, label: "ORTA", color: "#F89000", dark: "#C07000" },
                  { val: 3, label: "YÜKSEK", color: "#E01828", dark: "#A01020" },
                ].map(p => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => onGorevOncelik(p.val)}
                    className="font-[family-name:var(--font-pixel)] text-[9px] px-2.5 py-1 cursor-pointer transition-all"
                    style={{
                      background: gorevOncelik === p.val ? p.color : "#E8E0D0",
                      color: gorevOncelik === p.val ? "#FFF" : "#606878",
                      border: `2px solid ${gorevOncelik === p.val ? "#101010" : "#C0B890"}`,
                      boxShadow: gorevOncelik === p.val ? "2px 2px 0 0 #101010" : "none",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Renk */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#606878" }}>RENK</span>
                {GOREV_RENKLER.map(r => (
                  <button
                    key={r} type="button" onClick={() => onGorevRenk(r)}
                    className="w-6 h-6 cursor-pointer transition-transform"
                    style={{
                      backgroundColor: r,
                      border: `3px solid ${gorevRenk === r ? "#101010" : "#C0B890"}`,
                      transform: gorevRenk === r ? "scale(1.2)" : "scale(1)",
                      boxShadow: gorevRenk === r ? "2px 2px 0 0 #101010" : "none",
                    }}
                  />
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="font-[family-name:var(--font-pixel)] text-[10px] px-4 py-2 cursor-pointer"
                  style={{
                    background: "#18C840",
                    color: "#FFF",
                    border: "3px solid #101010",
                    boxShadow: "2px 2px 0 0 #101010",
                  }}
                >
                  ✓ EKLE
                </button>
                <button
                  type="button"
                  onClick={() => onShowGorevForm(false)}
                  className="font-[family-name:var(--font-pixel)] text-[10px] px-4 py-2 cursor-pointer"
                  style={{
                    background: "#E8E0D0",
                    color: "#484858",
                    border: "3px solid #C0B890",
                  }}
                >
                  İPTAL
                </button>
              </div>
            </form>
          )}

          {/* ── Görev listesi ── */}
          {selectedGorevler.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center gap-3">
              <div
                className="font-[family-name:var(--font-pixel)] text-[9px]"
                style={{ color: "#A09870" }}
              >
                [ GÖREV YOK ]
              </div>
              <button
                onClick={() => onShowGorevForm(true)}
                className="font-[family-name:var(--font-body)] text-xl cursor-pointer"
                style={{ color: "#2878F8", borderBottom: "2px dotted #2878F8" }}
              >
                + görev ekle
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {selectedGorevler.map((g, idx) => {
                const isOverdue = !g.tamamlandi && selectedDate < todayStr;
                const oncelikColor = g.oncelik === 3 ? "#E01828" : g.oncelik === 2 ? "#F89000" : "#18C840";
                const oncelikLabel = g.oncelik === 3 ? "!" : g.oncelik === 2 ? "·" : "";
                return (
                  <div
                    key={g.id}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{
                      background: g.tamamlandi ? "#E8F4E0" : isOverdue ? "#FFF0F0" : "#F8F0DC",
                      borderBottom: idx < selectedGorevler.length - 1 ? "2px solid #D8D0C0" : "none",
                      borderLeft: `5px solid ${g.tamamlandi ? "#18C840" : g.renk}`,
                    }}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => !g.tamamlandi && onGorevTamamla(g.id)}
                      className="w-7 h-7 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer"
                      style={{
                        background: g.tamamlandi ? "#18C840" : "#FAFAF0",
                        border: `3px solid ${g.tamamlandi ? "#107030" : "#101010"}`,
                        boxShadow: g.tamamlandi ? "none" : "2px 2px 0 0 #101010",
                      }}
                      disabled={g.tamamlandi}
                    >
                      {g.tamamlandi && (
                        <span className="text-white text-base font-bold leading-none">✓</span>
                      )}
                    </button>

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-[family-name:var(--font-body)] text-xl leading-tight"
                          style={{
                            color: g.tamamlandi ? "#70A060" : "#101010",
                            textDecoration: g.tamamlandi ? "line-through" : "none",
                          }}
                        >
                          {g.baslik}
                        </span>
                        {!g.tamamlandi && g.oncelik !== 1 && (
                          <span
                            className="font-[family-name:var(--font-pixel)] text-[8px] px-1.5 py-0.5 flex-shrink-0"
                            style={{ background: oncelikColor, color: "#FFF", border: "2px solid #101010" }}
                          >
                            {g.oncelik === 3 ? "YÜKSEK" : "ORTA"}
                          </span>
                        )}
                        {isOverdue && (
                          <span
                            className="font-[family-name:var(--font-pixel)] text-[8px] px-1.5 py-0.5 flex-shrink-0"
                            style={{ background: "#E01828", color: "#FFF", border: "2px solid #101010" }}
                          >
                            GEÇ
                          </span>
                        )}
                      </div>
                      {g.aciklama && (
                        <p className="font-[family-name:var(--font-body)] text-base mt-0.5" style={{ color: "#707080" }}>
                          {g.aciklama}
                        </p>
                      )}
                    </div>

                    {/* Sil */}
                    <button
                      onClick={() => onGorevSil(g.id)}
                      className="font-[family-name:var(--font-pixel)] text-[10px] w-7 h-7 flex items-center justify-center cursor-pointer flex-shrink-0 transition-all"
                      title="Sil"
                      style={{
                        color: "#A09080",
                        border: "2px solid transparent",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = "#E01828";
                        e.currentTarget.style.borderColor = "#E01828";
                        e.currentTarget.style.background = "#FFE8E8";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = "#A09080";
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              {/* Tümü tamamlandı banner */}
              {tamamlanan === toplam && toplam > 0 && (
                <div
                  className="px-4 py-2.5 text-center"
                  style={{ background: "#D4ECC8", borderTop: "3px solid #18C840" }}
                >
                  <span className="font-[family-name:var(--font-body)] text-xl" style={{ color: "#107030" }}>
                    🏆 Günün görevleri tamamlandı!
                  </span>
                </div>
              )}
            </div>
          )}
        </GameBox>
      ) : (
        <GameBox>
          <div className="py-10 text-center flex flex-col items-center gap-3">
            <div
              className="font-[family-name:var(--font-pixel)] text-[9px]"
              style={{ color: "#A09870" }}
            >
              [ GÜN SEÇİLMEDİ ]
            </div>
            <p className="font-[family-name:var(--font-body)] text-xl" style={{ color: "#606878" }}>
              Takvimden bir gün seç
            </p>
          </div>
        </GameBox>
      )}
    </div>
  );
}
