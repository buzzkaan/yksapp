import type { ReactNode } from "react";

export function PageHeader({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative border-b-4 border-black bg-mario-navy px-4 py-2 sm:py-4 shadow-[0_4px_0_0_#000000]">
      {/* Gold side stripes */}
      <div className="absolute left-0 inset-y-0 w-1.5 bg-mario-gold" />
      <div className="absolute right-0 inset-y-0 w-1.5 bg-mario-gold" />

      <div className="flex items-center justify-between gap-3 px-3 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-2xl sm:text-4xl leading-none shrink-0">{icon}</span>
          <div className="min-w-0">
            <h1 className="font-pixel text-[11px] leading-tight tracking-widest text-mario-gold text-shadow-gold truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="font-body text-lg sm:text-xl mt-0.5 leading-tight text-mario-light">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
