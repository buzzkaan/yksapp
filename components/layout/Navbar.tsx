"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SINAV_META, type SinavTipi } from "@/lib/sinav-data";
import { getSinavTipi } from "@/lib/utils/sinav";
import { UserLevelBadge } from "@/components/UserLevelBadge";

// ─── Types ──────────────────────────────────────────────────────────────────

type NavItem = { href: string; iconSrc: string; iconAlt: string; label: string };

// ─── Data (single source of truth) ──────────────────────────────────────────

const CORE_ITEMS: NavItem[] = [
  { href: "/",         iconSrc: "/icon/home.png",      iconAlt: "home",     label: "Köy"      },
  { href: "/harita",   iconSrc: "/icon/note.png",      iconAlt: "harita",   label: "Harita"   },
  { href: "/todo",     iconSrc: "/icon/chat.png",       iconAlt: "görevler", label: "Görevler" },
  { href: "/pomodoro", iconSrc: "/icon/hourglass.png",  iconAlt: "pomodoro", label: "Pomodoro" },
];

const SETTINGS_ITEM: NavItem = {
  href: "/ayarlar", iconSrc: "/icon/user.png", iconAlt: "ayarlar", label: "Ayarlar",
};

// Mobile uses the 4 core items + settings (label shortened to fit)
const mobileItems: NavItem[] = [
  ...CORE_ITEMS.map((i) => i.href === "/todo" ? { ...i, label: "Görev" } : i),
  { ...SETTINGS_ITEM, label: "Profil" },
];

const desktopSections: { label?: string; items: NavItem[] }[] = [
  { items: CORE_ITEMS },
  {
    label: "ARAÇLAR",
    items: [
      { href: "/denemeler", iconSrc: "/icon/docs.png",      iconAlt: "denemeler",  label: "Denemeler" },
      { href: "/program",   iconSrc: "/icon/calendar.png",  iconAlt: "program",    label: "Program"   },
      { href: "/hesaplama", iconSrc: "/icon/docs.png",      iconAlt: "hesaplama",  label: "Hesapla"   },
    ],
  },
  {
    label: "SKOR",
    items: [
      { href: "/liderlik",   iconSrc: "/icon/flag.png",        iconAlt: "liderlik",   label: "Liderlik"   },
      { href: "/istatistik", iconSrc: "/icon/docs.png",        iconAlt: "istatistik", label: "İstatistik" },
      { href: "/basarimlar", iconSrc: "/icon/party-card.png",  iconAlt: "basarimlar", label: "Başarımlar" },
    ],
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function NavItemDesktop({ item, active }: { item: NavItem; active: boolean }) {
  const [hovered, setHovered] = useState(false);
  const showHover = !active && hovered;

  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 px-4 py-3 mx-2 my-0.5 border-2 transition-all duration-75 relative"
      style={{
        borderColor: active ? "#FFD000" : showHover ? "#303058" : "transparent",
        background:  active ? "#101010" : showHover ? "#18183A" : "transparent",
        color:       active ? "#FFD000" : showHover ? "#B0C0D8" : "#606878",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {active && <span className="absolute left-0 top-1 bottom-1 w-[3px]" style={{ background: "#FFD000" }} />}
      <div className="w-8 h-8 relative flex-shrink-0">
        <Image src={item.iconSrc} alt={item.iconAlt} width={32} height={32} className="object-contain" />
      </div>
      <span className="font-[family-name:var(--font-body)] text-xl leading-none flex-1">{item.label}</span>
      {active && (
        <span className="font-[family-name:var(--font-pixel)] text-[9px] animate-pixel-blink" style={{ color: "#FFD000" }}>▶</span>
      )}
    </Link>
  );
}

function NavItemMobile({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className="flex flex-col items-center gap-0.5 px-1.5 py-1.5 transition-all min-w-0 relative"
      style={{ color: active ? "#FFD000" : "#606878" }}
    >
      {active && <span className="absolute top-0 left-1 right-1 h-[3px]" style={{ background: "#FFD000" }} />}
      <div className={`relative w-6 h-6 transition-transform ${active ? "scale-125" : ""}`}>
        <Image src={item.iconSrc} alt={item.iconAlt} width={24} height={24} className="object-contain" />
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

// Sınav modu badge — kendi state'ini yönetir
function NavSinavMode() {
  const [sinavTipi] = useState<SinavTipi>(getSinavTipi);

  return (
    <div className="px-3 py-2.5 border-b-2" style={{ borderColor: "#101010" }}>
      <div
        className="flex items-center gap-2.5 px-3 py-2 border-2"
        style={{ background: "#181838", borderColor: "#FFD000", boxShadow: "2px 2px 0 0 #504000" }}
      >
        <div className="w-6 h-6 relative">
          <Image src={SINAV_META[sinavTipi].icon} alt={SINAV_META[sinavTipi].isim} width={24} height={24} className="object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-[family-name:var(--font-pixel)] text-[9px] leading-tight" style={{ color: "#FFD000" }}>
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
        <span className="font-[family-name:var(--font-pixel)] text-[8px] animate-pixel-blink" style={{ color: "#FFD000" }}>★</span>
      </div>
    </div>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* DESKTOP — fixed left sidebar */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col z-50"
        style={{ background: "#181838", borderRight: "4px solid #101010", boxShadow: "4px 0 0 0 #000000" }}
      >
        {/* Logo */}
        <div className="px-4 py-5 border-b-4" style={{ background: "#0E0E28", borderColor: "#FFD000" }}>
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

        {/* XP / Seviye */}
        <div className="px-3 py-2 border-b-2" style={{ borderColor: "#101010" }}>
          <UserLevelBadge />
        </div>

        {/* Sınav modu */}
        <NavSinavMode />

        {/* Nav sections */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {desktopSections.map((section, i) => (
            <div key={i}>
              {section.label && (
                <div
                  className="px-5 pt-3 pb-1 font-[family-name:var(--font-pixel)] text-[8px] tracking-widest"
                  style={{ color: "#303058" }}
                >
                  {section.label}
                </div>
              )}
              {section.items.map((item) => (
                <NavItemDesktop key={item.href} item={item} active={pathname === item.href} />
              ))}
            </div>
          ))}
          <div className="mt-2 border-t-2" style={{ borderColor: "#101010" }}>
            <NavItemDesktop item={SETTINGS_ITEM} active={pathname === SETTINGS_ITEM.href} />
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t-2" style={{ borderColor: "#101010" }}>
          <div className="font-[family-name:var(--font-body)] text-sm text-center" style={{ color: "#8890B8" }}>
            ✦ Macera Devam Ediyor! ✦
          </div>
        </div>
      </aside>

      {/* MOBILE — fixed bottom bar (5 core items) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ background: "#181838", borderTop: "4px solid #FFD000", boxShadow: "0 -4px 0 0 #080828" }}
      >
        <div className="flex justify-around items-end py-1 px-1">
          {mobileItems.map((item) => (
            <NavItemMobile key={item.href} item={item} active={pathname === item.href} />
          ))}
        </div>
      </nav>
    </>
  );
}
