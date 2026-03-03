"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SINAV_META, type SinavTipi } from "@/lib/sinav-data";
import { getSinavTipi } from "@/lib/utils/sinav";
import { UserLevelBadge } from "@/components/UserLevelBadge";
import { ICONS } from "@/lib/constants/icons";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type NavItem = { href: string; iconSrc: string; iconAlt: string; label: string };

// ─── Data ────────────────────────────────────────────────────────────────────

const CORE_ITEMS: NavItem[] = [
  { href: "/",         iconSrc: ICONS.home,      iconAlt: "home",     label: "Köy"      },
  { href: "/harita",   iconSrc: ICONS.note,      iconAlt: "konular",  label: "Konular"  },
  { href: "/todo",     iconSrc: ICONS.chat,      iconAlt: "görevler", label: "Görevler" },
  { href: "/pomodoro", iconSrc: ICONS.hourglass, iconAlt: "pomodoro", label: "Pomodoro" },
];

const SETTINGS_ITEM: NavItem = {
  href: "/ayarlar", iconSrc: ICONS.user, iconAlt: "ayarlar", label: "Ayarlar",
};

const MOBILE_ITEMS: NavItem[] = [
  ...CORE_ITEMS.map((i) => i.href === "/todo" ? { ...i, label: "Görev" } : i),
  { ...SETTINGS_ITEM, label: "Profil" },
];

const DESKTOP_SECTIONS: { label?: string; items: NavItem[] }[] = [
  { items: CORE_ITEMS },
  {
    label: "ARAÇLAR",
    items: [
      { href: "/denemeler", iconSrc: ICONS.docs,     iconAlt: "denemeler", label: "Denemeler" },
      { href: "/program",   iconSrc: ICONS.calendar, iconAlt: "program",   label: "Program"   },
    ],
  },
  {
    label: "SKOR",
    items: [
      { href: "/liderlik",   iconSrc: ICONS.flag,      iconAlt: "liderlik",   label: "Liderlik"   },
      { href: "/istatistik", iconSrc: ICONS.docs,      iconAlt: "istatistik", label: "İstatistik" },
      { href: "/basarimlar", iconSrc: ICONS.partyCard, iconAlt: "basarimlar", label: "Başarımlar" },
    ],
  },
];

// ─── Desktop nav item ─────────────────────────────────────────────────────────

function NavItemDesktop({ item, active }: { item: NavItem; active: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 mx-2 my-0.5 border-2 transition-all duration-75 relative",
        active           && "border-mario-gold bg-black       text-mario-gold",
        !active && hovered && "border-mario-gold bg-mario-navy-dark text-mario-light",
        !active && !hovered && "border-transparent text-mario-slate"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {active && <span className="absolute left-0 inset-y-1 w-[3px] bg-mario-gold" />}
      <div className="w-8 h-8 relative shrink-0">
        <Image src={item.iconSrc} alt={item.iconAlt} width={32} height={32} className="object-contain" />
      </div>
      <span className="font-body text-xl leading-none flex-1">{item.label}</span>
      {active && <span className="font-pixel text-[9px] text-mario-gold animate-pixel-blink">▶</span>}
    </Link>
  );
}

// ─── Mobile nav item ──────────────────────────────────────────────────────────

function NavItemMobile({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link href={item.href} className="flex flex-col items-center gap-0.5 px-1.5 py-1.5 min-w-0 relative">
      {active && <span className="absolute top-0 inset-x-1 h-[3px] bg-mario-gold" />}
      <div className={cn("relative w-6 h-6 transition-transform", active && "scale-125")}>
        <Image src={item.iconSrc} alt={item.iconAlt} width={24} height={24} className="object-contain" />
      </div>
      <span className={cn(
        "font-body text-sm leading-none truncate",
        active ? "text-mario-brown-dark font-bold" : "text-mario-brown-dark/60"
      )}>
        {item.label}
      </span>
    </Link>
  );
}

// ─── Exam mode badge ──────────────────────────────────────────────────────────

function NavSinavMode() {
  const [sinavTipi, setSinavTipi] = useState<SinavTipi>("YKS");

  useEffect(() => {
    setSinavTipi(getSinavTipi());
  }, []);

  return (
    <div className="px-3 py-2.5 border-b-2 border-black">
      <div className="flex items-center gap-2.5 px-3 py-2 border-2 bg-mario-navy-dark border-mario-gold shadow-pixel-sm-gold">
        <div className="w-6 h-6 relative">
          <Image src={SINAV_META[sinavTipi].icon} alt={SINAV_META[sinavTipi].isim} width={24} height={24} className="object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-pixel text-[9px] leading-tight text-mario-gold">
            {sinavTipi} MODU
          </div>
          <Link href="/ayarlar" className="font-body text-sm leading-none text-mario-light hover:text-mario-gold transition-colors">
            değiştir →
          </Link>
        </div>
        <span className="font-pixel text-[8px] text-mario-gold animate-pixel-blink">★</span>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* DESKTOP — fixed left sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col z-50 bg-mario-navy border-r-4 border-black shadow-[4px_0_0_0_#000000]">
        {/* Logo */}
        <div className="px-4 py-5 border-b-4 border-mario-gold bg-mario-navy-dark">
          <div className="font-pixel text-[11px] leading-relaxed tracking-wider text-mario-gold text-shadow-gold">
            ⚔️ YKS QUEST
          </div>
          <div className="font-body text-xl mt-1 leading-tight text-mario-light">
            Pixel Akademi
          </div>
        </div>

        {/* XP / Level */}
        <div className="px-3 py-2 border-b-2 border-black">
          <UserLevelBadge />
        </div>

        {/* Exam mode */}
        <NavSinavMode />

        {/* Nav sections */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {DESKTOP_SECTIONS.map((section, i) => (
            <div key={i}>
              {section.label && (
                <div className="px-5 pt-3 pb-1 font-pixel text-[8px] tracking-widest text-mario-slate-dark">
                  {section.label}
                </div>
              )}
              {section.items.map((item) => (
                <NavItemDesktop key={item.href} item={item} active={pathname === item.href} />
              ))}
            </div>
          ))}
          <div className="mt-2 border-t-2 border-black">
            <NavItemDesktop item={SETTINGS_ITEM} active={pathname === SETTINGS_ITEM.href} />
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t-2 border-black">
          <div className="font-body text-sm text-center text-mario-light">
            ✦ Macera Devam Ediyor! ✦
          </div>
        </div>
      </aside>

      {/* MOBILE — fixed bottom bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t-4 border-black shadow-[0_-2px_0_0_#000000]"
        style={{
          background: "#C88040",
          backgroundImage: [
            "linear-gradient(to bottom, #58C800 0px, #58C800 6px, #006800 6px, #006800 9px, transparent 9px)",
            "linear-gradient(rgba(0,0,0,0.10) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(0,0,0,0.10) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "100% 100%, 32px 28px, 32px 28px",
          backgroundPosition: "0 0, 0 9px, 0 9px",
        }}
      >
        <div className="flex justify-around items-end py-1 px-1">
          {MOBILE_ITEMS.map((item) => (
            <NavItemMobile key={item.href} item={item} active={pathname === item.href} />
          ))}
        </div>
      </nav>
    </>
  );
}
