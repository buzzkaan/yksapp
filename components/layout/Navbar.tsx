"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LS_SINAV_KEY, type SinavTipi } from "@/lib/sinav-data";

const SINAV_ICON: Record<SinavTipi, string> = {
  YKS: "🎯", DGS: "🏫", KPSS: "🏛️",
};

const navItems = [
  { href: "/",          icon: "🏠", label: "Köy"       },
  { href: "/konular",   icon: "✅", label: "Görevler"  },
  { href: "/pomodoro",  icon: "🍅", label: "Pomodoro"  },
  { href: "/denemeler", icon: "📝", label: "Denemeler" },
  { href: "/ayarlar",   icon: "⚙️", label: "Ayarlar"  },
];

export function Navbar() {
  const pathname = usePathname();
  const [sinavTipi] = useState<SinavTipi>(() => {
    if (typeof window === "undefined") return "YKS";
    const s = localStorage.getItem(LS_SINAV_KEY) as SinavTipi | null;
    return s && ["YKS", "DGS", "KPSS"].includes(s) ? s : "YKS";
  });

  const sinavItem = { href: "/yks", icon: SINAV_ICON[sinavTipi], label: sinavTipi };
  const allItems = [navItems[0], navItems[1], sinavItem, navItems[2], navItems[3], navItems[4]];

  return (
    <>
      {/* ════════════════════════════════════════════
          DESKTOP — fixed left sidebar (hidden on mobile)
          ════════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col z-50"
        style={{
          background:  "#181828",
          borderRight: "4px solid #4060D0",
          boxShadow:   "4px 0 0 0 #080818",
        }}
      >
        {/* ── Logo banner ── */}
        <div
          className="px-4 py-5 border-b-4"
          style={{
            background:  "#181828",
            borderColor: "#4060D0",
          }}
        >
          <div
            className="font-[family-name:var(--font-pixel)] text-[11px] leading-relaxed tracking-wider"
            style={{ color: "#F0D000", textShadow: "2px 2px 0 #504000" }}
          >
            🌾 YKS FARM
          </div>
          <div className="font-[family-name:var(--font-body)] text-xl mt-1 leading-tight" style={{ color: "#A0A8C0" }}>
            Çiftlik Akademisi
          </div>
        </div>

        {/* ── Active exam badge ── */}
        <div className="px-3 py-2.5 border-b-2" style={{ borderColor: "#2A2A48" }}>
          <div
            className="flex items-center gap-2.5 px-3 py-2 border-2"
            style={{
              background:  "#181828",
              borderColor: "#F0D000",
              boxShadow:   "2px 2px 0 0 #504000",
            }}
          >
            <span className="text-xl leading-none">{SINAV_ICON[sinavTipi]}</span>
            <div className="min-w-0 flex-1">
              <div
                className="font-[family-name:var(--font-pixel)] text-[9px] leading-tight"
                style={{ color: "#F0D000" }}
              >
                {sinavTipi} MODU
              </div>
              <Link
                href="/ayarlar"
                className="font-[family-name:var(--font-body)] text-sm leading-none transition-colors"
                style={{ color: "#A0A8C0" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F0D000")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#A0A8C0")}
              >
                değiştir →
              </Link>
            </div>
            <span
              className="font-[family-name:var(--font-pixel)] text-[8px] animate-pixel-blink"
              style={{ color: "#F0D000" }}
            >
              ★
            </span>
          </div>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {allItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 mx-2 my-0.5 border-2 transition-all duration-75 relative group"
                style={{
                  borderColor: active ? "#4060D0" : "transparent",
                  background:  active ? "#4060D0" : "transparent",
                  color:       active ? "#F0D000" : "#A0A8C0",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background   = "#2A2A48";
                    e.currentTarget.style.borderColor  = "#4060D0";
                    e.currentTarget.style.color        = "#F8F8F8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background   = "transparent";
                    e.currentTarget.style.borderColor  = "transparent";
                    e.currentTarget.style.color        = "#A0A8C0";
                  }
                }}
              >
                {/* Active indicator bar */}
                {active && (
                  <span
                    className="absolute left-0 top-1 bottom-1 w-[3px]"
                    style={{ background: "#F0D000" }}
                  />
                )}

                <span className="text-2xl w-8 text-center leading-none flex-shrink-0">
                  {item.icon}
                </span>

                <span className="font-[family-name:var(--font-body)] text-xl leading-none flex-1">
                  {item.label}
                </span>

                {active && (
                  <span
                    className="font-[family-name:var(--font-pixel)] text-[9px] animate-pixel-blink"
                    style={{ color: "#F0D000" }}
                  >
                    ▶
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer ── */}
        <div className="px-4 py-3 border-t-2" style={{ borderColor: "#2A2A48" }}>
          <div className="font-[family-name:var(--font-body)] text-sm text-center" style={{ color: "#A0A8C0" }}>
            ✦ İyi Çalışmalar! ✦
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════
          MOBILE — fixed bottom bar (hidden on desktop)
          ════════════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "#181828",
          borderTop:  "4px solid #4060D0",
          boxShadow:  "0 -4px 0 0 #080818",
        }}
      >
        <div className="flex justify-around items-end py-1 px-1">
          {allItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-1.5 py-1.5 transition-all min-w-0 relative"
                style={{ color: active ? "#F0D000" : "#A0A8C0" }}
              >
                {/* Active top gold bar */}
                {active && (
                  <span
                    className="absolute top-0 left-1 right-1 h-[3px]"
                    style={{ background: "#F0D000" }}
                  />
                )}
                <span className={`text-2xl leading-none transition-transform ${active ? "scale-125" : ""}`}>
                  {item.icon}
                </span>
                <span
                  className="font-[family-name:var(--font-body)] text-sm leading-none truncate"
                  style={{ color: active ? "#F0D000" : "#A0A8C0" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
