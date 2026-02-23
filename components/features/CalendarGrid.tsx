"use client";
import { useState } from "react";
import { PixelButton } from "@/components/pixel/PixelButton";
import { gorevTamamla } from "@/server/actions/takvim";
import toast from "react-hot-toast";

interface Gorev {
  id: string;
  tarih: Date;
  baslik: string;
  tamamlandi: boolean;
  renk: string;
}

interface CalendarGridProps {
  yil: number;
  ay: number;
  gorevler: Gorev[];
  onMonthChange: (yil: number, ay: number) => void;
  selectedDate: string | null;
  onSelectDate: (dateStr: string) => void;
}

const AYLAR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const GUNLER = ["Pt","Sl","Ça","Pe","Cu","Ct","Pz"];

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

  const gorevByDay: Record<number, { count: number; renk: string }> = {};
  for (const g of gorevler) {
    const d = new Date(g.tarih).getDate();
    if (!gorevByDay[d]) gorevByDay[d] = { count: 0, renk: g.renk };
    gorevByDay[d].count++;
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
    <div className="flex flex-col gap-0">
      {/* Başlık */}
      <div className="flex items-center justify-between px-4 py-3 border-b-4 border-[#101010]">
        <PixelButton onClick={prevMonth} variant="ghost" size="sm">◀</PixelButton>
        <span className="font-[family-name:var(--font-pixel)] text-xs text-[#101010]">
          {AYLAR[ay - 1]} {yil}
        </span>
        <PixelButton onClick={nextMonth} variant="ghost" size="sm">▶</PixelButton>
      </div>

      {/* Gün isimleri */}
      <div className="grid grid-cols-7 border-b-2 border-[#101010]">
        {GUNLER.map((g) => (
          <div key={g} className="text-center py-1 font-[family-name:var(--font-body)] text-sm text-[#505068]">
            {g}
          </div>
        ))}
      </div>

      {/* Günler */}
      <div className="grid grid-cols-7">
        {gunler.map((gun, idx) => {
          if (gun === null) {
            return <div key={`empty-${idx}`} className="h-10 border border-[#C0C0D0]" />;
          }
          const dateStr = `${yil}-${String(ay).padStart(2,"0")}-${String(gun).padStart(2,"0")}`;
          const isToday = isThisMonth && gun === today.getDate();
          const isSelected = selectedDate === dateStr;
          const gorevInfo = gorevByDay[gun];

          return (
            <button
              key={gun}
              onClick={() => onSelectDate(dateStr)}
              className={`h-10 border border-[#C0C0D0] relative flex flex-col items-center justify-center transition-colors
                ${isSelected ? "bg-[#4060D0] border-[#101010]" : isToday ? "bg-[#F0D000]/30" : "hover:bg-[#4060D0]/15"}
              `}
            >
              <span className={`font-[family-name:var(--font-body)] text-sm leading-none
                ${isSelected ? "text-white font-bold" : isToday ? "text-[#101010] font-bold" : "text-[#101010]"}
              `}>
                {gun}
              </span>
              {gorevInfo && (
                <span
                  className="w-2 h-2 rounded-none absolute bottom-1"
                  style={{ backgroundColor: gorevInfo.renk }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface GorevListesiProps {
  gorevler: Gorev[];
  tarihStr: string;
}

export function GorevListesi({ gorevler, tarihStr }: GorevListesiProps) {
  const gunGorevler = gorevler.filter((g) => {
    const d = new Date(g.tarih);
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return ds === tarihStr;
  });

  async function handleToggle(id: string) {
    await gorevTamamla(id);
    toast.success("✅ Görev tamamlandı!");
  }

  if (gunGorevler.length === 0) {
    return (
      <p className="font-[family-name:var(--font-body)] text-lg text-[#505068] text-center py-4">
        Bu gün için görev yok.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {gunGorevler.map((g) => (
        <div
          key={g.id}
          className={`flex items-center gap-3 border-4 border-[#101010] p-2 ${g.tamamlandi ? "opacity-60 bg-[#E0F0E0]" : "bg-[#FFFFFF]"}`}
          style={{ borderLeftColor: g.renk, borderLeftWidth: "6px" }}
        >
          <button
            onClick={() => !g.tamamlandi && handleToggle(g.id)}
            className="w-5 h-5 border-4 border-[#101010] flex-shrink-0 flex items-center justify-center bg-white hover:bg-[#18C018] transition-colors"
          >
            {g.tamamlandi && <span className="text-xs text-white">✓</span>}
          </button>
          <span
            className={`font-[family-name:var(--font-body)] text-lg ${
              g.tamamlandi ? "line-through text-[#505068]" : "text-[#101010]"
            }`}
          >
            {g.baslik}
          </span>
        </div>
      ))}
    </div>
  );
}
