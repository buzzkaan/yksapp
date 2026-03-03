import { cn } from "@/lib/utils";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "wood" | "stone" | "gold" | "dark" | "green";
}

// Mario Block Variants:
// wood  → Tuğla Blok   | stone → Taş Blok | gold → ? Blok
// dark  → Yeraltı      | green → Boru

const variants: Record<string, { bg: string; border: string; shadow: string; text?: string; corner: string }> = {
  wood: {
    bg:     "#C88040",
    border: "#000000",
    shadow: "4px 4px 0 0 #8B4000",
    corner: "#FFD000",
  },
  stone: {
    bg:     "#A8A8A8",
    border: "#000000",
    shadow: "4px 4px 0 0 #505050",
    corner: "#FFFFFF",
  },
  gold: {
    bg:     "#FFD000",
    border: "#000000",
    shadow: "4px 4px 0 0 #804000",
    corner: "#FFFFFF",
  },
  dark: {
    bg:     "#000058",
    border: "#000000",
    shadow: "4px 4px 0 0 #000030",
    text:   "#FFFFFF",
    corner: "#FFD000",
  },
  green: {
    bg:     "#00A800",
    border: "#000000",
    shadow: "4px 4px 0 0 #006800",
    corner: "#FFD000",
  },
};

const CORNER_POSITIONS = [
  "absolute top-[-2px] left-[-2px]",
  "absolute top-[-2px] right-[-2px]",
  "absolute bottom-[-2px] left-[-2px]",
  "absolute bottom-[-2px] right-[-2px]",
];

export function PixelCard({ children, className, variant = "wood" }: PixelCardProps) {
  const v = variants[variant];
  return (
    <div
      className={cn("relative border-4 p-4", className)}
      style={{
        background: v.bg,
        borderColor: v.border,
        color: v.text,
        boxShadow: v.shadow,
        imageRendering: "pixelated",
      }}
    >
      {CORNER_POSITIONS.map((pos) => (
        <div
          key={pos}
          className={pos}
          style={{ position: "absolute", width: 10, height: 10, background: v.corner, border: "2px solid #000000", zIndex: 1 }}
        />
      ))}
      {children}
    </div>
  );
}
