import { cn } from "@/lib/utils";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "wood" | "stone" | "gold" | "dark" | "green";
}

const variants: Record<string, { bg: string; border: string; shadow: string; text?: string; corner: string }> = {
  wood: {
    bg:     "#FFFFFF",
    border: "#101010",
    shadow: "4px 4px 0 0 #101010",
    corner: "#F0D000",
  },
  stone: {
    bg:     "#D8D8D8",
    border: "#505050",
    shadow: "4px 4px 0 0 #202020",
    corner: "#F0D000",
  },
  gold: {
    bg:     "#F0D800",
    border: "#906000",
    shadow: "4px 4px 0 0 #504000",
    corner: "#FFFFFF",
  },
  dark: {
    bg:     "#181828",
    border: "#4060D0",
    shadow: "4px 4px 0 0 #080818",
    text:   "#F8F8F8",
    corner: "#4060D0",
  },
  green: {
    bg:     "#C8F0B0",
    border: "#188018",
    shadow: "4px 4px 0 0 #085008",
    corner: "#F0D000",
  },
};

export function PixelCard({ children, className, variant = "wood" }: PixelCardProps) {
  const v = variants[variant];
  return (
    <div
      className={cn("relative border-4 p-4", className)}
      style={{
        background:      v.bg,
        borderColor:     v.border,
        color:           v.text,
        boxShadow:       v.shadow,
        imageRendering:  "pixelated",
      }}
    >
      {/* Corner pixel marks */}
      <div style={{ position: "absolute", top: -2,   left: -2,   width: 10, height: 10, background: v.corner, border: "2px solid #101010", zIndex: 1 }} />
      <div style={{ position: "absolute", top: -2,   right: -2,  width: 10, height: 10, background: v.corner, border: "2px solid #101010", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: -2, left: -2,  width: 10, height: 10, background: v.corner, border: "2px solid #101010", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: -2, right: -2, width: 10, height: 10, background: v.corner, border: "2px solid #101010", zIndex: 1 }} />

      {children}
    </div>
  );
}
