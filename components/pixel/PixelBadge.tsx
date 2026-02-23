import { cn } from "@/lib/utils";

interface PixelBadgeProps {
  children: React.ReactNode;
  variant?: "green" | "gold" | "red" | "purple" | "blue";
  className?: string;
}

const variantStyles: Record<string, { cls: string; shadow: string }> = {
  green:  { cls: "bg-[#18C018] border-[#0A5A0A] text-white",    shadow: "2px 2px 0 0 #101010" },
  gold:   { cls: "bg-[#F0D000] border-[#906000] text-[#101010]", shadow: "2px 2px 0 0 #504000" },
  red:    { cls: "bg-[#D81818] border-[#780A0A] text-white",    shadow: "2px 2px 0 0 #101010" },
  purple: { cls: "bg-[#9040C8] border-[#5A1878] text-white",    shadow: "2px 2px 0 0 #101010" },
  blue:   { cls: "bg-[#1860C8] border-[#0A3870] text-white",    shadow: "2px 2px 0 0 #101010" },
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
