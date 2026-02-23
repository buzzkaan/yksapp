interface PixelProgressProps {
  value: number;
  color?: string;
  label?: string;
  showPercent?: boolean;
  size?: "sm" | "md" | "lg";
  hpLabel?: string;
}

function fillColor(v: number, custom?: string) {
  if (custom) return custom;
  if (v >= 50) return "#48B848";
  if (v >= 25) return "#F8D030";
  return "#E04048";
}

const heights: Record<string, number> = { sm: 14, md: 20, lg: 28 };

export function PixelProgress({
  value, color, label, showPercent = false, size = "md", hpLabel,
}: PixelProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const fill = fillColor(clamped, color);
  const isDanger = !color && clamped < 25;
  const h = heights[size];

  return (
    <div className="w-full">
      {(label || showPercent || hpLabel) && (
        <div className="flex justify-between items-center mb-1">
          <span className="font-[family-name:var(--font-pixel)] text-[9px] text-[#101010] tracking-wide">
            {hpLabel ?? label}
          </span>
          {showPercent && (
            <span
              className={`font-[family-name:var(--font-pixel)] text-[9px] tabular-nums ${isDanger ? "animate-hp-pulse" : ""}`}
              style={{ color: fill }}
            >
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}

      {/* Bar shell — GBC HP bar */}
      <div
        className="w-full relative overflow-hidden border-4 border-[#101010]"
        style={{
          height: h,
          background: "#181828",
          imageRendering: "pixelated",
        }}
      >
        {/* Fill bar */}
        {clamped > 0 && (
          <div
            className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ${isDanger ? "animate-hp-pulse" : ""}`}
            style={{
              width: `${clamped}%`,
              background: fill,
            }}
          />
        )}

        {/* Segment tick marks — every 25% */}
        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: `${pct}%`,
              width: 2,
              background: "#101010",
              zIndex: 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
