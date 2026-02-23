"use client";
import { cn } from "@/lib/utils";

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "gold" | "blue";
  size?: "sm" | "md" | "lg";
}

const variants: Record<string, { base: string; shadow: string; activeShadow: string }> = {
  primary: {
    base: "bg-[#4088F0] border-[#1858A0] text-white hover:bg-[#50A0FF]",
    shadow: "3px 3px 0 0 #101010",
    activeShadow: "0 0 0 0 #101010",
  },
  secondary: {
    base: "bg-[#E04048] border-[#901820] text-white hover:bg-[#F05058]",
    shadow: "3px 3px 0 0 #101010",
    activeShadow: "0 0 0 0 #101010",
  },
  danger: {
    base: "bg-[#E04048] border-[#901820] text-white hover:bg-[#F05058]",
    shadow: "3px 3px 0 0 #101010",
    activeShadow: "0 0 0 0 #101010",
  },
  ghost: {
    base: "bg-[#F8F8F0] border-[#101010] text-[#101010] hover:bg-[#E8E8E0]",
    shadow: "3px 3px 0 0 #101010",
    activeShadow: "0 0 0 0 #101010",
  },
  gold: {
    base: "bg-[#F8D030] border-[#906000] text-[#101010] hover:bg-[#FFE050]",
    shadow: "3px 3px 0 0 #504000",
    activeShadow: "0 0 0 0 #504000",
  },
  blue: {
    base: "bg-[#4088F0] border-[#1858A0] text-white hover:bg-[#50A0FF]",
    shadow: "3px 3px 0 0 #101010",
    activeShadow: "0 0 0 0 #101010",
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
