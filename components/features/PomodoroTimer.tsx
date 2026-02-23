"use client";
import { useState, useEffect, useRef } from "react";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { pomodoroKaydet } from "@/server/actions/pomodoro";
import toast from "react-hot-toast";

const DURATIONS = [
  { min: 25, desc: "KLASİK" },
  { min: 35, desc: "UZUN" },
  { min: 50, desc: "ULTRA" },
];

export function PomodoroTimer() {
  const [duration, setDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [konu, setKonu] = useState("");
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
      konuId: konu || undefined,
    });
    setCompleted((c) => c + 1);
    setTotalMinutes((t) => t + duration);
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
    if (active) return;
    setDuration(d);
    setSeconds(d * 60);
  }

  const dakika = Math.floor(seconds / 60).toString().padStart(2, "0");
  const saniye = (seconds % 60).toString().padStart(2, "0");
  const progress = ((duration * 60 - seconds) / (duration * 60)) * 100;

  const isPaused = !active && seconds < duration * 60 && seconds > 0;
  const isFinished = seconds === 0;

  const statusLabel = isFinished
    ? "★ TAMAMLANDI ★"
    : active
      ? "ODAKLAN..."
      : isPaused
        ? "DURAKLATILDI"
        : "HAZIR";

  const statusColor = isFinished
    ? "#18C840"
    : active
      ? "#FFD000"
      : isPaused
        ? "#F89000"
        : "#484858";

  const timerColor = active ? "#FFD000" : isPaused ? "#F8D080" : "#484858";

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

        {/* ── Sol: Timer + Kontroller ── */}
        <div className="flex flex-col gap-3">

          {/* GBC Ekranı */}
          <div
            style={{
              background: "#0E0E1E",
              border: "4px solid #101010",
              boxShadow: "4px 4px 0 0 #101010",
            }}
          >
            {/* Ekran başlığı */}
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{ background: "#181838", borderBottom: "3px solid #101010" }}
            >
              <span className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>
                POMODORO
              </span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3"
                    style={{
                      background: i < completed % 4 ? "#FFD000" : "#1E1E38",
                      border: `2px solid ${i < completed % 4 ? "#504000" : "#303050"}`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Saat */}
            <div className="flex flex-col items-center py-12 px-4">
              <div
                className="font-[family-name:var(--font-pixel)] leading-none tabular-nums"
                style={{
                  fontSize: "clamp(48px, 12vw, 72px)",
                  color: timerColor,
                  textShadow: active ? `0 0 24px ${timerColor}60` : "none",
                  letterSpacing: "0.05em",
                }}
              >
                {dakika}:{saniye}
              </div>
              <div
                className={`font-[family-name:var(--font-pixel)] text-[9px] mt-5 ${active || isFinished ? "animate-pixel-blink" : ""}`}
                style={{ color: statusColor }}
              >
                {statusLabel}
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 pb-4">
              <PixelProgress
                value={progress}
                color={isFinished ? "#18C840" : active ? "#FFD000" : "#303050"}
                size="lg"
              />
            </div>
          </div>

          {/* Kontroller */}
          <div className="flex gap-2">
            {!active ? (
              <button
                onClick={handleStart}
                disabled={isFinished}
                className="flex-1 font-[family-name:var(--font-pixel)] text-[11px] py-3 cursor-pointer transition-all"
                style={{
                  background: isFinished ? "#1E1E38" : "#18C840",
                  color: isFinished ? "#484858" : "#FFF",
                  border: `3px solid ${isFinished ? "#303050" : "#101010"}`,
                  boxShadow: isFinished ? "none" : "3px 3px 0 0 #101010",
                }}
              >
                ▶ {isPaused ? "DEVAM ET" : "BAŞLAT"}
              </button>
            ) : (
              <button
                onClick={() => setActive(false)}
                className="flex-1 font-[family-name:var(--font-pixel)] text-[11px] py-3 cursor-pointer"
                style={{
                  background: "#F89000",
                  color: "#FFF",
                  border: "3px solid #101010",
                  boxShadow: "3px 3px 0 0 #101010",
                }}
              >
                ⏸ DURDUR
              </button>
            )}
            <button
              onClick={handleReset}
              className="font-[family-name:var(--font-pixel)] text-[10px] px-5 py-3 cursor-pointer transition-all"
              style={{ background: "#181838", color: "#606878", border: "3px solid #303050" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#E01828"; e.currentTarget.style.borderColor = "#E01828"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#606878"; e.currentTarget.style.borderColor = "#303050"; }}
            >
              ■ SIFIRLA
            </button>
          </div>

          {/* Bugünkü özet */}
          {completed > 0 && (
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: "#181838", border: "4px solid #101010", boxShadow: "4px 4px 0 0 #101010" }}
            >
              <span className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>
                BUGÜN
              </span>
              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-pixel)] text-[11px]" style={{ color: "#FFD000" }}>
                  {completed} OTURUM
                </span>
                <span className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#606878" }}>
                  {totalMinutes} DK
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Sağ: Ayarlar ── */}
        <div className="flex flex-col gap-3">

          {/* Süre seçimi */}
          <div style={{ background: "#F8F0DC", border: "4px solid #101010", boxShadow: "4px 4px 0 0 #101010" }}>
            <div className="px-4 py-2" style={{ background: "#181838", borderBottom: "3px solid #101010" }}>
              <span className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>
                SÜRE SEÇ{active && <span style={{ color: "#303050" }}> (aktifken değişmez)</span>}
              </span>
            </div>
            <div className="flex gap-2 p-3">
              {DURATIONS.map((d) => {
                const isSel = duration === d.min;
                return (
                  <button
                    key={d.min}
                    onClick={() => handleDurationChange(d.min)}
                    disabled={active}
                    className="flex-1 py-3 cursor-pointer transition-all flex flex-col items-center gap-1"
                    style={{
                      background: isSel ? "#181838" : "#F0E8D8",
                      border: `3px solid ${isSel ? "#FFD000" : "#C0B890"}`,
                      boxShadow: isSel ? "2px 2px 0 0 #504000" : "none",
                      opacity: active && !isSel ? 0.4 : 1,
                    }}
                  >
                    <span className="font-[family-name:var(--font-pixel)] text-[13px]" style={{ color: isSel ? "#FFD000" : "#484858" }}>
                      {d.min}
                    </span>
                    <span className="font-[family-name:var(--font-pixel)] text-[8px]" style={{ color: isSel ? "#8890B8" : "#A09070" }}>
                      {d.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Konu notu */}
          <div style={{ background: "#F8F0DC", border: "4px solid #101010", boxShadow: "4px 4px 0 0 #101010" }}>
            <div className="px-4 py-2" style={{ background: "#181838", borderBottom: "3px solid #101010" }}>
              <span className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>
                KONU <span style={{ color: "#303050" }}>(OPSİYONEL)</span>
              </span>
            </div>
            <div className="p-3">
              <input
                type="text"
                placeholder="Ör: Matematik — Türev"
                value={konu}
                onChange={(e) => setKonu(e.target.value)}
                className="w-full px-3 py-2 font-[family-name:var(--font-body)] text-xl outline-none"
                style={{
                  background: "#FAFAF0",
                  border: "3px solid #101010",
                  color: "#101010",
                  boxShadow: "inset 2px 2px 0 0 #D0C8B0",
                }}
              />
            </div>
          </div>

          {/* Nasıl çalışır */}
          <div style={{ background: "#F8F0DC", border: "4px solid #101010", boxShadow: "4px 4px 0 0 #101010" }}>
            <div className="px-4 py-2" style={{ background: "#181838", borderBottom: "3px solid #101010" }}>
              <span className="font-[family-name:var(--font-pixel)] text-[9px]" style={{ color: "#484858" }}>
                NASIL ÇALIŞIR
              </span>
            </div>
            <div className="flex flex-col gap-2 p-3">
              {[
                { n: "01", text: "Süre seç ve başlat" },
                { n: "02", text: "Odaklanarak çalış" },
                { n: "03", text: "Oturum biter, XP kazan" },
                { n: "04", text: "4 oturumda bir uzun mola" },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-pixel)] text-[9px] flex-shrink-0" style={{ color: "#FFD000" }}>
                    {s.n}
                  </span>
                  <span className="font-[family-name:var(--font-body)] text-lg" style={{ color: "#484858" }}>
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
