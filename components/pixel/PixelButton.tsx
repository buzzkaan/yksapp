"use client";
import { cn } from "@/lib/utils";

// Mario button variants:
// primary → Mario Red | secondary → Pipe Green
// danger  → Dark Red  | ghost     → Stone Gray
// gold    → Coin Gold | blue      → Underground Blue

type Variant = "primary" | "secondary" | "danger" | "ghost" | "gold" | "blue";
type Size    = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:   "bg-mario-red        border-mario-red-dark       text-white  hover:bg-[#C00000]  shadow-pixel-btn",
  secondary: "bg-mario-green      border-mario-green-dark     text-white  hover:bg-[#008800]  shadow-pixel-btn",
  danger:    "bg-mario-red-dark   border-[#440000]            text-white  hover:bg-[#660000]  shadow-pixel-btn",
  ghost:     "bg-mario-stone      border-black                text-black  hover:bg-[#C8C8C8]  shadow-pixel-btn-stone",
  gold:      "bg-mario-gold       border-black                text-black  hover:bg-[#FFE040]  shadow-pixel-btn-gold",
  blue:      "bg-mario-blue       border-[#003090]            text-white  hover:bg-[#0048D0]  shadow-pixel-btn",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1 text-[9px]  leading-tight",
  md: "px-4 py-2 text-[10px] leading-tight",
  lg: "px-6 py-3 text-xs     leading-tight",
};

export function PixelButton({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: {
  variant?: Variant;
  size?: Size;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "border-4 font-pixel cursor-pointer select-none",
        "transition-all duration-75",
        "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
