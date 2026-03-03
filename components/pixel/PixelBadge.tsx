import { cn } from "@/lib/utils";

interface PixelBadgeProps {
  children: React.ReactNode;
  variant?: "green" | "gold" | "red" | "purple" | "blue";
  className?: string;
}

// Mario Badge Variants: Boru Yeşil | Jeton Altın | Mario Kırmızı | Mor | Yeraltı Mavi
const variantStyles: Record<string, { cls: string; shadow: string }> = {
  green:  { cls: "bg-[#00A800] border-[#000000] text-white",    shadow: "2px 2px 0 0 #006800" },
  gold:   { cls: "bg-[#FFD000] border-[#000000] text-[#000000]",shadow: "2px 2px 0 0 #804000" },
  red:    { cls: "bg-[#E40000] border-[#000000] text-white",    shadow: "2px 2px 0 0 #880000" },
  purple: { cls: "bg-[#8838C8] border-[#000000] text-white",    shadow: "2px 2px 0 0 #000000" },
  blue:   { cls: "bg-[#0058F8] border-[#000000] text-white",    shadow: "2px 2px 0 0 #000000" },
};

export function PixelBadge({ children, variant = "green", className }: PixelBadgeProps) {
  const v = variantStyles[variant];
  return (
    <span
      className={cn(
        "inline-block border-2 px-2 py-0.5",
        "font-[family-name:var(--font-pixel)] text-[9px]",
        v.cls,
        className
      )}
      style={{ boxShadow: v.shadow }}
    >
      {children}
    </span>
  );
}
