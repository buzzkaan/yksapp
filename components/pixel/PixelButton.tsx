"use client";
import { cn } from "@/lib/utils";

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "gold" | "blue";
  size?: "sm" | "md" | "lg";
}

const variants: Record<string, { base: string; shadow: string }> = {
  primary: {
    base:   "bg-[#18C018] border-[#0A5A0A] text-white hover:bg-[#20D820]",
    shadow: "4px 4px 0 0 #101010",
  },
  secondary: {
    base:   "bg-[#E87820] border-[#804010] text-white hover:bg-[#F08830]",
    shadow: "4px 4px 0 0 #101010",
  },
  danger: {
    base:   "bg-[#D81818] border-[#780A0A] text-white hover:bg-[#E82828]",
    shadow: "4px 4px 0 0 #101010",
  },
  ghost: {
    base:   "bg-[#FFFFFF] border-[#101010] text-[#101010] hover:bg-[#E8E8F0]",
    shadow: "4px 4px 0 0 #101010",
  },
  gold: {
    base:   "bg-[#F0D000] border-[#906000] text-[#101010] hover:bg-[#F8E020]",
    shadow: "4px 4px 0 0 #504000",
  },
  blue: {
    base:   "bg-[#1860C8] border-[#0A3870] text-white hover:bg-[#2070D8]",
    shadow: "4px 4px 0 0 #101010",
  },
};

const sizes = {
  sm: "px-3 py-1   text-[9px]  leading-tight",
  md: "px-4 py-2   text-[10px] leading-tight",
  lg: "px-6 py-3   text-xs     leading-tight",
};

export function PixelButton({
  children, className, variant = "primary", size = "md", ...props
}: PixelButtonProps) {
  const v = variants[variant];
  return (
    <button
      className={cn(
        "border-4 font-[family-name:var(--font-pixel)] cursor-pointer select-none",
        "transition-all duration-75",
        "active:translate-x-[4px] active:translate-y-[4px]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "disabled:active:translate-x-0 disabled:active:translate-y-0",
        v.base,
        sizes[size],
        className
      )}
      style={{ boxShadow: v.shadow }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 0 #101010";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = v.shadow;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = v.shadow;
      }}
      {...props}
    >
      {children}
    </button>
  );
}
