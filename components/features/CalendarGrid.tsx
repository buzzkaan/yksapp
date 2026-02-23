"use client";
import { AYLAR_TAM, GUNLER_KISALT } from "@/lib/constants/ui";
import type { Gorev } from "@/lib/types";

interface CalendarGridProps {
  yil: number;
  ay: number;
  gorevler: Gorev[];
  onMonthChange: (yil: number, ay: number) => void;
  selectedDate: string | null;
  onSelectDate: (dateStr: string) => void;
}

export function CalendarGrid({
  yil, ay, gorevler, onMonthChange, selectedDate, onSelectDate
}: CalendarGridProps) {
  const ilkGun = new Date(yil, ay - 1, 1);
  const sonGun = new Date(yil, ay, 0);
  const baslangicGunu = (ilkGun.getDay() + 6) % 7;

  const gunler: (number | null)[] = [
    ...Array(baslangicGunu).fill(null),
    ...Array.from({ length: sonGun.getDate() }, (_, i) => i + 1),
  ];

  const gorevByDay: Record<number, { count: number; tamamlandi: number; renk: string; oncelik: number }> = {};
  for (const g of gorevler) {
    const d = new Date(g.tarih).getDate();
    if (!gorevByDay[d]) gorevByDay[d] = { count: 0, tamamlandi: 0, renk: g.renk, oncelik: 0 };
    gorevByDay[d].count++;
    if (g.tamamlandi) gorevByDay[d].tamamlandi++;
    if (g.oncelik && g.oncelik > gorevByDay[d].oncelik) gorevByDay[d].oncelik = g.oncelik;
  }

  const today = new Date();
  const isThisMonth = today.getFullYear() === yil && today.getMonth() + 1 === ay;

  function prevMonth() {
    if (ay === 1) onMonthChange(yil - 1, 12);
    else onMonthChange(yil, ay - 1);
  }

  function nextMonth() {
    if (ay === 12) onMonthChange(yil + 1, 1);
    else onMonthChange(yil, ay + 1);
  }

  return (
    <div
      style={{
        background: "#F8F0DC",
        border: "4px solid #101010",
        boxShadow: "4px 4px 0 0 #101010",
      }}
    >
      {/* ── Başlık: GBC menü stili ── */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: "#181838",
          borderBottom: "4px solid #101010",
        }}
      >
        <button
          onClick={prevMonth}
          className="font-[family-name:var(--font-pixel)] text-[12px] px-2 py-1 transition-all hover:scale-110 active:scale-95 cursor-pointer select-none"
          style={{
            color: "#F8F0DC",
            background: "#101010",
            border: "3px solid #FFD000",
            boxShadow: "2px 2px 0 0 #504000",
          }}
        >
          ◀
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base">◆</span>
          <span
            className="font-[family-name:var(--font-pixel)] text-[14px]"
            style={{ color: "#FFD000", textShadow: "2px 2px 0 #504000" }}
          >
            {AYLAR_TAM[ay - 1].toUpperCase()} {yil}
          </span>
          <span className="text-base">◆</span>
        </div>
        <button
          onClick={nextMonth}
          className="font-[family-name:var(--font-pixel)] text-[12px] px-2 py-1 transition-all hover:scale-110 active:scale-95 cursor-pointer select-none"
          style={{
            color: "#F8F0DC",
            background: "#101010",
            border: "3px solid #FFD000",
            boxShadow: "2px 2px 0 0 #504000",
          }}
        >
          ▶
        </button>
      </div>

      {/* ── Gün isimleri ── */}
      <div
        className="grid grid-cols-7"
        style={{
          background: "#E8D4B0",
          borderBottom: "3px solid #D0D0E8",
        }}
      >
        {GUNLER_KISALT.map((g, i) => (
          <div
            key={g}
            className="text-center py-1.5 font-[family-name:var(--font-pixel)] text-[10px]"
            style={{
              color: i >= 5 ? "#E01828" : "#101010",
              borderRight: i < 6 ? "2px solid #D0D0E8" : "none",
            }}
          >
            {g}
          </div>
        ))}
      </div>

      {/* ── Günler ── */}
      <div className="grid grid-cols-7">
        {gunler.map((gun, idx) => {
          if (gun === null) {
            return (
              <div
                key={`empty-${idx}`}
                className="h-11 sm:h-12"
                style={{
                  background: "#F0E8D0",
                  borderRight: "2px solid #D0D0E8",
                  borderBottom: "2px solid #D0D0E8",
                }}
              />
            );
          }

          const dateStr = `${yil}-${String(ay).padStart(2, "0")}-${String(gun).padStart(2, "0")}`;
          const isToday = isThisMonth && gun === today.getDate();
          const isSelected = selectedDate === dateStr;
          const gorevInfo = gorevByDay[gun];
          const isWeekend = (baslangicGunu + gun - 1) % 7 >= 5;

          return (
            <button
              key={gun}
              onClick={() => onSelectDate(dateStr)}
              className="h-11 sm:h-12 relative flex flex-col items-center justify-center transition-all cursor-pointer group"
              style={{
                background: isSelected
                  ? "#2878F8"
                  : isToday
                    ? "#FFD000"
                    : "#F8F0DC",
                borderRight: "2px solid #D0D0E8",
                borderBottom: "2px solid #D0D0E8",
                boxShadow: isSelected
                  ? "inset 0 0 0 2px #1060C0"
                  : isToday
                    ? "inset 0 0 0 2px #C09000"
                    : "none",
              }}
            >
              <span
                className="font-[family-name:var(--font-pixel)] text-[11px] leading-none"
                style={{
                  color: isSelected
                    ? "#FFFFFF"
                    : isToday
                      ? "#101010"
                      : isWeekend
                        ? "#E01828"
                        : "#101010",
                }}
              >
                {gun}
              </span>

              {gorevInfo && (
                <div className="flex gap-[2px] mt-0.5">
                  {gorevInfo.tamamlandi > 0 && gorevInfo.tamamlandi === gorevInfo.count ? (
                    <div
                      className="w-[5px] h-[5px]"
                      style={{
                        backgroundColor: isSelected ? "#FFF" : "#18C840",
                        border: `1px solid ${isSelected ? "#1060C0" : "#107030"}`,
                      }}
                      title="Tümü tamamlandı"
                    />
                  ) : gorevInfo.tamamlandi > 0 ? (
                    <>
                      <div
                        className="w-[5px] h-[5px]"
                        style={{
                          backgroundColor: isSelected ? "#FFD000" : "#18C840",
                          border: `1px solid ${isSelected ? "#C09000" : "#107030"}`,
                        }}
                        title={`${gorevInfo.tamamlandi}/${gorevInfo.count} tamamlandı`}
                      />
                      <div
                        className="w-[5px] h-[5px]"
                        style={{
                          backgroundColor: isSelected ? "#FFF" : gorevInfo.renk,
                          border: `1px solid ${isSelected ? "#1060C0" : "#101010"}`,
                        }}
                      />
                    </>
                  ) : gorevInfo.oncelik === 3 ? (
                    <div
                      className="w-[5px] h-[5px]"
                      style={{
                        backgroundColor: isSelected ? "#FFF" : "#E01828",
                        border: `1px solid ${isSelected ? "#1060C0" : "#A02020"}`,
                      }}
                      title="Yüksek öncelik"
                    />
                  ) : (
                    <div
                      className="w-[5px] h-[5px]"
                      style={{
                        backgroundColor: isSelected ? "#FFD000" : gorevInfo.renk,
                        border: `1px solid ${isSelected ? "#C09000" : "#101010"}`,
                      }}
                    />
                  )}
                </div>
              )}

              {!isSelected && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: "#FFD00020",
                    border: "2px solid #FFD000",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
