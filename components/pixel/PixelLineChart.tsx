interface PixelLineChartProps {
  data: { label: string; value: number }[];
  color?: string;
}

export function PixelLineChart({ data, color }: PixelLineChartProps) {
  if (data.length < 2) return null;

  const W = 280;
  const H = 80;
  const pad = 20;
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
    <svg width={W} height={H} className="overflow-visible" style={{ imageRendering: "pixelated" }}>
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = pad + (1 - pct / 100) * (H - pad * 2);
        return (
          <line key={pct} x1={pad} y1={y} x2={W - pad} y2={y}
            stroke="#D0D0E8" strokeWidth="1" strokeDasharray="4 4" />
        );
      })}
      <path d={pathD} fill="none" stroke={color || "#2878F8"} strokeWidth="3" strokeLinejoin="miter" />
      {points.map((p, i) => (
        <rect key={i} x={p.x - 4} y={p.y - 4} width="8" height="8"
          fill="#FFD000" stroke="#101010" strokeWidth="2" />
      ))}
    </svg>
  );
}
