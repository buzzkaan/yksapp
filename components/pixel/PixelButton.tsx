"use client";
import { cn } from "@/lib/utils";

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "gold" | "blue";
  size?: "sm" | "md" | "lg";
}

const variants: Record<string, { base: string; shadow: string; activeShadow: string }> = {
  primary: {
    base: "bg-[#2878F8] border-[#1060C0] text-white hover:bg-[#2060D0]",
    shadow: "3px 3px 0 0 #101010",
    activeShadow: "0 0 0 0 #101010",
  },
  secondary: {
    base: "bg-[#E01828] border-[#780010] text-white hover:bg-[#C01020]",
    shadow: "3px 3px 0 0 #101010",
    activeShadow: "0 0 0 0 #101010",
  },
  danger: {
    base: "bg-[#E01828] border-[#780010] text-white hover:bg-[#C01020]",
    shadow: "3px 3px 0 0 #101010",
    activeShadow: "0 0 0 0 #101010",
  },
  ghost: {
    base: "bg-[#F8F0DC] border-[#101010] text-[#101010] hover:bg-[#E8E0C8]",
    shadow: "3px 3px 0 0 #101010",
    activeShadow: "0 0 0 0 #101010",
  },
  gold: {
    base: "bg-[#FFD000] border-[#806000] text-[#101010] hover:bg-[#FFDC00]",
    shadow: "3px 3px 0 0 #504000",
    activeShadow: "0 0 0 0 #504000",
  },
  blue: {
    base: "bg-[#2878F8] border-[#1060C0] text-white hover:bg-[#2060D0]",
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
