import { cn } from "@/lib/utils";
import { PIXEL_CORNERS } from "@/lib/constants/ui";

// Mario block variants:
// wood → Brick Block | stone → Stone Block | gold → ? Block
// dark → Underground  | green → Pipe

type Variant = "wood" | "stone" | "gold" | "dark" | "green";

const VARIANTS: Record<Variant, { card: string; shadow: string; corner: string }> = {
  wood:  { card: "bg-mario-brown  border-black text-black", shadow: "shadow-pixel-brown", corner: "bg-mario-gold"  },
  stone: { card: "bg-mario-stone  border-black text-black", shadow: "shadow-pixel-stone", corner: "bg-white"       },
  gold:  { card: "bg-mario-gold   border-black text-black", shadow: "shadow-pixel-gold",  corner: "bg-white"       },
  dark:  { card: "bg-mario-navy   border-black text-white", shadow: "shadow-pixel-navy",  corner: "bg-mario-gold"  },
  green: { card: "bg-mario-green  border-black text-white", shadow: "shadow-pixel-green", corner: "bg-mario-gold"  },
};

export function PixelCard({
  children,
  className,
  variant = "wood",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}) {
  const v = VARIANTS[variant];
  return (
    <div className={cn("relative border-4 p-4 image-pixel", v.card, v.shadow, className)}>
      {PIXEL_CORNERS.map((pos) => (
        <div
          key={pos}
          className={cn("absolute w-[10px] h-[10px] border-2 border-black z-10", pos, v.corner)}
        />
      ))}
      {children}
    </div>
  );
}
