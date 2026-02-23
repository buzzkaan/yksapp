"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SINAV_META, type SinavTipi } from "@/lib/sinav-data";
import { getSinavTipi } from "@/lib/utils/sinav";

const navItems = [
  { href: "/", iconSrc: "/icon/home.png", iconAlt: "home", label: "Köy" },
  { href: "/todo", iconSrc: "/icon/chat.png", iconAlt: "tasks", label: "Görevler" },
  { href: "/pomodoro", iconSrc: "/icon/hourglass.png", iconAlt: "pomodoro", label: "Pomodoro" },
  { href: "/denemeler", iconSrc: "/icon/docs.png", iconAlt: "exams", label: "Denemeler" },
  { href: "/ayarlar", iconSrc: "/icon/flag.png", iconAlt: "settings", label: "Ayarlar" },
];

type NavItem = { href: string; iconSrc: string; iconAlt: string; label: string };

function NavItem({ item, active, mobile = false }: { item: NavItem; active: boolean; mobile?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const showHover = !active && hovered;

  if (mobile) {
    return (
      <Link
        href={item.href}
        className="flex flex-col items-center gap-0.5 px-1.5 py-1.5 transition-all min-w-0 relative"
        style={{ color: active ? "#FFD000" : "#606878" }}
      >
        {active && (
          <span className="absolute top-0 left-1 right-1 h-[3px]" style={{ background: "#FFD000" }} />
        )}
        <div className={`relative w-6 h-6 transition-transform ${active ? "scale-125" : ""}`}>
          <Image src={item.iconSrc} alt={item.iconAlt} fill className="object-contain" />
        </div>
        <span
          className="font-[family-name:var(--font-body)] text-sm leading-none truncate"
          style={{ color: active ? "#FFD000" : "#606878" }}
        >
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 px-4 py-3 mx-2 my-0.5 border-2 transition-all duration-75 relative"
      style={{
        borderColor: active ? "#FFD000" : showHover ? "#303058" : "transparent",
        background: active ? "#101010" : showHover ? "#18183A" : "transparent",
        color: active ? "#FFD000" : showHover ? "#B0C0D8" : "#606878",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {active && (
        <span className="absolute left-0 top-1 bottom-1 w-[3px]" style={{ background: "#FFD000" }} />
      )}
      <div className="w-8 h-8 relative flex-shrink-0">
        <Image src={item.iconSrc} alt={item.iconAlt} fill className="object-contain" />
      </div>
      <span className="font-[family-name:var(--font-body)] text-xl leading-none flex-1">
        {item.label}
      </span>
      {active && (
        <span
          className="font-[family-name:var(--font-pixel)] text-[9px] animate-pixel-blink"
          style={{ color: "#FFD000" }}
        >
          ▶
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [sinavTipi, setSinavTipi] = useState<SinavTipi>("YKS");

  useEffect(() => {
    setSinavTipi(getSinavTipi());
  }, []);

  const sinavItem: NavItem = { href: "/yks", iconSrc: SINAV_META[sinavTipi].icon, iconAlt: SINAV_META[sinavTipi].isim, label: sinavTipi };
  const allItems: NavItem[] = [navItems[0], navItems[1], sinavItem, navItems[2], navItems[3], navItems[4]];

  return (
    <>
      {/* ════════════════════════════════════════════
          DESKTOP — fixed left sidebar
          ════════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col z-50"
        style={{
          background: "#181838",
          borderRight: "4px solid #101010",
          boxShadow: "4px 0 0 0 #000000",
        }}
      >
        {/* ── Logo banner ── */}
        <div
          className="px-4 py-5 border-b-4"
          style={{ background: "#0E0E28", borderColor: "#FFD000" }}
        >
          <div
            className="font-[family-name:var(--font-pixel)] text-[11px] leading-relaxed tracking-wider"
            style={{ color: "#FFD000", textShadow: "2px 2px 0 #504000" }}
          >
            ⚔️ YKS QUEST
          </div>
          <div className="font-[family-name:var(--font-body)] text-xl mt-1 leading-tight" style={{ color: "#8890B8" }}>
            Pixel Akademi
          </div>
        </div>

        {/* ── Active exam badge ── */}
        <div className="px-3 py-2.5 border-b-2" style={{ borderColor: "#101010" }}>
          <div
            className="flex items-center gap-2.5 px-3 py-2 border-2"
            style={{
              background: "#181838",
              borderColor: "#FFD000",
              boxShadow: "2px 2px 0 0 #504000",
            }}
          >
            <div className="w-6 h-6 relative">
              <Image src={SINAV_META[sinavTipi].icon} alt={SINAV_META[sinavTipi].isim} fill className="object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="font-[family-name:var(--font-pixel)] text-[9px] leading-tight"
                style={{ color: "#FFD000" }}
              >
                {sinavTipi} MODU
              </div>
              <Link
                href="/ayarlar"
                className="font-[family-name:var(--font-body)] text-sm leading-none transition-colors hover:text-[#FFD000]"
                style={{ color: "#8890B8" }}
              >
                değiştir →
              </Link>
            </div>
            <span
              className="font-[family-name:var(--font-pixel)] text-[8px] animate-pixel-blink"
              style={{ color: "#FFD000" }}
            >
              ★
            </span>
          </div>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {allItems.map((item) => (
            <NavItem key={item.href} item={item} active={pathname === item.href} />
          ))}
        </nav>

        {/* ── Footer ── */}
        <div className="px-4 py-3 border-t-2" style={{ borderColor: "#101010" }}>
          <div className="font-[family-name:var(--font-body)] text-sm text-center" style={{ color: "#8890B8" }}>
            ✦ Macera Devam Ediyor! ✦
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════
          MOBILE — fixed bottom bar
          ════════════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "#181838",
          borderTop: "4px solid #FFD000",
          boxShadow: "0 -4px 0 0 #080828",
        }}
      >
        <div className="flex justify-around items-end py-1 px-1">
          {allItems.map((item) => (
            <NavItem key={item.href} item={item} active={pathname === item.href} mobile />
          ))}
        </div>
      </nav>
    </>
  );
}
