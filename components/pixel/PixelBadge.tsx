import { cn } from "@/lib/utils";

interface PixelBadgeProps {
  children: React.ReactNode;
  variant?: "green" | "gold" | "red" | "purple" | "blue";
  className?: string;
}

const variantStyles: Record<string, { cls: string; shadow: string }> = {
  green: { cls: "bg-[#18C840] border-[#107030] text-white", shadow: "2px 2px 0 0 #101010" },
  gold: { cls: "bg-[#FFD000] border-[#806000] text-[#101010]", shadow: "2px 2px 0 0 #504000" },
  red: { cls: "bg-[#E01828] border-[#780010] text-white", shadow: "2px 2px 0 0 #101010" },
  purple: { cls: "bg-[#8838C8] border-[#501870] text-white", shadow: "2px 2px 0 0 #101010" },
  blue: { cls: "bg-[#2878F8] border-[#1060C0] text-white", shadow: "2px 2px 0 0 #101010" },
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
