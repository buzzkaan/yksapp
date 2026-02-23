"use client";
import { useState, useEffect, useRef } from "react";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { pomodoroKaydet } from "@/server/actions/pomodoro";
import toast from "react-hot-toast";

const DURATIONS = [25, 35, 50];

export function PomodoroTimer() {
  const [duration, setDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [konuId, setKonuId] = useState<string | undefined>();
  const startRef = useRef<Date | null>(null);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setActive(false);
          handleComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  async function handleComplete() {
    const baslangic = startRef.current ?? new Date();
    await pomodoroKaydet({
      baslangic,
      bitis: new Date(),
      sure: duration,
      tamamlandi: true,
      konuId,
    });
    setCompleted((c) => c + 1);
    toast.success(`⭐ ${duration} dk tamamlandı! +XP`);
  }

  function handleStart() {
    startRef.current = new Date();
    setActive(true);
  }

  function handleReset() {
    setActive(false);
    setSeconds(duration * 60);
  }

  function handleDurationChange(d: number) {
    setDuration(d);
    setSeconds(d * 60);
    setActive(false);
  }

  const dakika = Math.floor(seconds / 60).toString().padStart(2, "0");
  const saniye = (seconds % 60).toString().padStart(2, "0");
  const progress = ((duration * 60 - seconds) / (duration * 60)) * 100;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto">
      {/* Domates sayacı */}
      <PixelCard>
        <div className="flex justify-center gap-2 text-2xl">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className={i < completed % 4 ? "opacity-100" : "opacity-30"}>
              ⭐
            </span>
          ))}
        </div>
        <p className="text-center font-[family-name:var(--font-body)] text-sm text-[#585868] mt-1">
          Bugün {completed} oturum tamamlandı
        </p>
      </PixelCard>

      {/* Timer */}
      <PixelCard variant="dark" className="text-center">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#4088F0" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#48B848"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="square"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-[family-name:var(--font-pixel)] text-3xl text-[#F8D030] tracking-widest">
              {dakika}:{saniye}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {!active ? (
            <PixelButton onClick={handleStart} variant="primary" size="md">
              ▶ BAŞLAT
            </PixelButton>
          ) : (
            <PixelButton onClick={() => setActive(false)} variant="secondary" size="md">
              ⏸ DURDUR
            </PixelButton>
          )}
          <PixelButton onClick={handleReset} variant="ghost" size="md">
            ■ SIFIRLA
          </PixelButton>
        </div>
      </PixelCard>

      {/* Süre seçimi */}
      <PixelCard>
        <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-2">
          Süre Seç:
        </p>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <PixelButton
              key={d}
              onClick={() => handleDurationChange(d)}
              variant={duration === d ? "primary" : "ghost"}
              size="sm"
            >
              {d} dk
            </PixelButton>
          ))}
        </div>
      </PixelCard>

      {/* Konu notu */}
      <PixelCard>
        <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-2">
          Konu Notu (opsiyonel):
        </p>
        <input
          type="text"
          placeholder="Ör: Matematik — Türev"
          className="w-full border-4 border-[#101010] bg-white px-3 py-2 font-[family-name:var(--font-body)] text-lg text-[#101010] outline-none focus:border-[#4088F0]"
          onChange={(e) => setKonuId(e.target.value || undefined)}
        />
      </PixelCard>
    </div>
  );
}
