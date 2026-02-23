import { cn } from "@/lib/utils";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "wood" | "stone" | "gold" | "dark" | "green";
}

const variants: Record<string, { bg: string; border: string; shadow: string; text?: string; corner: string }> = {
  wood: {
    bg: "#F8F8F0",
    border: "#101010",
    shadow: "4px 4px 0 0 #101010",
    corner: "#F8D030",
  },
  stone: {
    bg: "#D8D8E0",
    border: "#101010",
    shadow: "4px 4px 0 0 #101010",
    corner: "#4088F0",
  },
  gold: {
    bg: "#F8D030",
    border: "#906000",
    shadow: "4px 4px 0 0 #504000",
    corner: "#FFFFFF",
  },
  dark: {
    bg: "#181828",
    border: "#4088F0",
    shadow: "4px 4px 0 0 #080818",
    text: "#F8F8F8",
    corner: "#4088F0",
  },
  green: {
    bg: "#C8F0B0",
    border: "#188018",
    shadow: "4px 4px 0 0 #085008",
    corner: "#F8D030",
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
          style={{ position: "absolute", width: 10, height: 10, background: v.corner, border: "2px solid #101010", zIndex: 1 }}
        />
      ))}
      {children}
    </div>
  );
}
