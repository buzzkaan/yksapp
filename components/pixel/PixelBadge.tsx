import { cn } from "@/lib/utils";

// Mario badge variants: Pipe Green | Coin Gold | Mario Red | Purple | Underground Blue

type Variant = "green" | "gold" | "red" | "purple" | "blue";

const VARIANTS: Record<Variant, string> = {
  green:  "bg-mario-green  border-black text-white  shadow-pixel-sm-green",
  gold:   "bg-mario-gold   border-black text-black  shadow-pixel-sm-gold",
  red:    "bg-mario-red    border-black text-white  shadow-pixel-sm-red",
  purple: "bg-[#8838C8]    border-black text-white  shadow-pixel-sm",
  blue:   "bg-mario-blue   border-black text-white  shadow-pixel-sm",
};

export function PixelBadge({
  children,
  variant = "green",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block border-2 px-2 py-0.5 font-pixel text-[9px]",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
