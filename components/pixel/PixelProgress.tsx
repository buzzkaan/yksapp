// Mario HP bar: Pipe green (high) → Coin gold (mid) → Mario red (low)

type Size = "sm" | "md" | "lg";

const FILL_COLORS = { high: "#00A800", mid: "#FFD000", low: "#E40000" } as const;
const HEIGHTS: Record<Size, number> = { sm: 14, md: 20, lg: 28 };

function resolveFill(value: number, custom?: string): string {
  if (custom) return custom;
  if (value >= 50) return FILL_COLORS.high;
  if (value >= 25) return FILL_COLORS.mid;
  return FILL_COLORS.low;
}

export function PixelProgress({
  value,
  color,
  label,
  showPercent = false,
  size = "md",
  hpLabel,
}: {
  value: number;
  color?: string;
  label?: string;
  showPercent?: boolean;
  size?: Size;
  hpLabel?: string;
}) {
  const clamped  = Math.max(0, Math.min(100, value));
  const fill     = resolveFill(clamped, color);
  const isDanger = !color && clamped < 25;
  const height   = HEIGHTS[size];

  return (
    <div className="w-full">
      {(label || showPercent || hpLabel) && (
        <div className="flex justify-between items-center mb-1">
          <span className="font-pixel text-[9px] text-black tracking-wide">
            {hpLabel ?? label}
          </span>
          {showPercent && (
            <span
              className={`font-pixel text-[9px] tabular-nums ${isDanger ? "animate-hp-pulse" : ""}`}
              style={{ color: fill }}
            >
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}

      {/* Bar shell */}
      <div
        className="w-full relative overflow-hidden border-4 border-black bg-mario-navy image-pixel"
        style={{ height }}
      >
        {/* Fill */}
        {clamped > 0 && (
          <div
            className={`absolute inset-y-0 left-0 transition-all duration-700 ${isDanger ? "animate-hp-pulse" : ""}`}
            style={{ width: `${clamped}%`, background: fill }}
          />
        )}

        {/* 25% segment ticks */}
        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            className="absolute inset-y-0 w-[2px] bg-black pointer-events-none z-[2]"
            style={{ left: `${pct}%` }}
          />
        ))}
      </div>
    </div>
  );
}
