"use client";

type Option<T extends string> = { key: T; label: string };

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Tailwind sınıfları — her buton için. */
  buttonClass?: string;
  className?: string;
}

/**
 * Koyu arka planlı toggle grup seçici.
 * Aktif öğe sarı vurgulu, pasif öğe soluk.
 */
export function PixelToggleGroup<T extends string>({
  options,
  value,
  onChange,
  buttonClass = "flex-1 py-2 px-3 border-2 font-body text-xl transition-all",
  className = "flex gap-2",
}: Props<T>) {
  return (
    <div className={className}>
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={buttonClass}
          style={{
            borderColor: value === key ? "#FFD000" : "#303058",
            background:  value === key ? "#101010"  : "transparent",
            color:       value === key ? "#FFD000"  : "#606878",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
