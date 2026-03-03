"use client";
import { cn } from "@/lib/utils";

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "gold" | "blue";
  size?: "sm" | "md" | "lg";
}

// Mario Button Variants:
// primary   → Mario Kırmızı  | secondary → Boru Yeşili
// danger    → Koyu Kırmızı   | ghost     → Taş Gri
// gold      → Jeton Altın    | blue      → Yeraltı Mavi

const variants: Record<string, { base: string; shadow: string; activeShadow: string }> = {
  primary: {
    base:        "bg-[#E40000] border-[#880000] text-white hover:bg-[#C00000]",
    shadow:      "3px 3px 0 0 #000000",
    activeShadow:"0 0 0 0 #000000",
  },
  secondary: {
    base:        "bg-[#00A800] border-[#006800] text-white hover:bg-[#008800]",
    shadow:      "3px 3px 0 0 #000000",
    activeShadow:"0 0 0 0 #000000",
  },
  danger: {
    base:        "bg-[#880000] border-[#440000] text-white hover:bg-[#660000]",
    shadow:      "3px 3px 0 0 #000000",
    activeShadow:"0 0 0 0 #000000",
  },
  ghost: {
    base:        "bg-[#A8A8A8] border-[#000000] text-[#000000] hover:bg-[#C8C8C8]",
    shadow:      "3px 3px 0 0 #505050",
    activeShadow:"0 0 0 0 #505050",
  },
  gold: {
    base:        "bg-[#FFD000] border-[#000000] text-[#000000] hover:bg-[#FFE040]",
    shadow:      "3px 3px 0 0 #804000",
    activeShadow:"0 0 0 0 #804000",
  },
  blue: {
    base:        "bg-[#0058F8] border-[#003090] text-white hover:bg-[#0048D0]",
    shadow:      "3px 3px 0 0 #000000",
    activeShadow:"0 0 0 0 #000000",
  },
};

const sizes = {
  sm: "px-3 py-1   text-[9px]  leading-tight",
  md: "px-4 py-2   text-[10px] leading-tight",
  lg: "px-6 py-3   text-xs     leading-tight",
};

export function PixelButton({
  children, className, variant = "primary", size = "md", style, ...props
}: PixelButtonProps) {
  const v = variants[variant];
  return (
    <button
      className={cn(
        "border-4 font-[family-name:var(--font-pixel)] cursor-pointer select-none",
        "transition-all duration-75",
        "active:translate-x-[3px] active:translate-y-[3px]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "disabled:active:translate-x-0 disabled:active:translate-y-0",
        v.base,
        sizes[size],
        className
      )}
      style={{ boxShadow: v.shadow, ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
