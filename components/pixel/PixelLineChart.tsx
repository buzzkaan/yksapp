import { MARIO } from "@/lib/constants/mario-palette";

interface PixelLineChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export function PixelLineChart({ data, color, height = 100 }: PixelLineChartProps) {
  if (data.length < 2) return null;

  const W = 560;
  const H = height;
  const pad = 24;
  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const range = max - min || 1;

  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (W - pad * 2),
    y: pad + (1 - (d.value - min) / range) * (H - pad * 2),
    value: d.value,
    label: d.label,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="overflow-visible" style={{ imageRendering: "pixelated" }}>
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = pad + (1 - pct / 100) * (H - pad * 2);
        return (
          <line key={pct} x1={pad} y1={y} x2={W - pad} y2={y}
            stroke={MARIO.black} strokeWidth="1" strokeDasharray="4 4" />
        );
      })}
      <path d={pathD} fill="none" stroke={color || MARIO.blue} strokeWidth="3" strokeLinejoin="miter" />
      {points.map((p, i) => (
        <rect key={i} x={p.x - 4} y={p.y - 4} width="8" height="8"
          fill={MARIO.gold} stroke={MARIO.black} strokeWidth="2" />
      ))}
    </svg>
  );
}
