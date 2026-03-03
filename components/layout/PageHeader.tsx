import type { ReactNode } from "react";

interface PageHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ icon, title, subtitle, action }: PageHeaderProps) {
  return (
    <div
      className="relative border-b-4 px-4 py-2 sm:py-4"
      style={{
        background:  "#000058",
        borderColor: "#000000",
        boxShadow:   "0 4px 0 0 #000000",
      }}
    >
      {/* Sol altın şerit */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: "#FFD000" }} />
      {/* Sağ altın şerit */}
      <div className="absolute right-0 top-0 bottom-0 w-1.5" style={{ background: "#FFD000" }} />

      {/* Content */}
      <div className="flex items-center justify-between gap-3 px-3 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-2xl sm:text-4xl leading-none flex-shrink-0">{icon}</span>
          <div className="min-w-0">
            <h1
              className="font-[family-name:var(--font-pixel)] leading-tight truncate"
              style={{
                fontSize:      "11px",
                color:         "#FFD000",
                textShadow:    "2px 2px 0 #804000",
                letterSpacing: "0.1em",
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="font-[family-name:var(--font-body)] text-lg sm:text-xl mt-0.5 leading-tight"
                style={{ color: "#A8C8F8" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
