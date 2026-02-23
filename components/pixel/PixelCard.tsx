import { cn } from "@/lib/utils";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "wood" | "stone" | "gold" | "dark" | "green";
}

const variants: Record<string, { bg: string; border: string; shadow: string; text?: string; corner: string }> = {
  wood: {
    bg: "#F8F0DC",
    border: "#101010",
    shadow: "4px 4px 0 0 #101010",
    corner: "#FFD000",
  },
  stone: {
    bg: "#D0D0E8",
    border: "#101010",
    shadow: "4px 4px 0 0 #101010",
    corner: "#2878F8",
  },
  gold: {
    bg: "#FFD000",
    border: "#806000",
    shadow: "4px 4px 0 0 #504000",
    corner: "#FFFFFF",
  },
  dark: {
    bg: "#181838",
    border: "#101010",
    shadow: "4px 4px 0 0 #080828",
    text: "#F0F0F0",
    corner: "#FFD000",
  },
  green: {
    bg: "#B8F0A0",
    border: "#107010",
    shadow: "4px 4px 0 0 #064818",
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
          style={{ position: "absolute", width: 10, height: 10, background: v.corner, border: "2px solid #101010", zIndex: 1 }}
        />
      ))}
      {children}
    </div>
  );
}
