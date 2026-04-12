interface Props {
  label: string;
  value: React.ReactNode;
  labelColor?: string;
  valueColor?: string;
  bg?: string;
  /** sm: border-2, text-2xl değer | lg: border-4, text-lg değer + gölge */
  variant?: "sm" | "lg";
}

export function PixelStatCard({
  label,
  value,
  labelColor = "#6878A8",
  valueColor = "#000000",
  bg = "#A8A8A8",
  variant = "sm",
}: Props) {
  const lg = variant === "lg";
  return (
    <div
      className={lg ? "border-4 border-[#000000] p-2 text-center" : "border-2 border-[#000000] px-3 py-2 text-center"}
      style={{ background: bg, ...(lg && { boxShadow: "3px 3px 0 0 #000000" }) }}
    >
      <div className={lg ? "font-pixel text-[10px]" : "font-pixel text-[8px]"} style={{ color: labelColor }}>
        {label}
      </div>
      <div className={lg ? "font-pixel text-lg" : "font-pixel text-2xl"} style={{ color: valueColor }}>
        {value}
      </div>
    </div>
  );
}
