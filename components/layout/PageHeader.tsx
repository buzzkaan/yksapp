interface PageHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ icon, title, subtitle, action }: PageHeaderProps) {
  return (
    <div
      className="relative border-b-4 px-4 py-5"
      style={{
        background: "#181828",
        borderColor: "#4088F0",
        boxShadow: "0 4px 0 0 #080818",
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: "#F8D030" }}
      />

      {/* Content */}
      <div className="flex items-center justify-between gap-4 pl-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-4xl leading-none flex-shrink-0">
            {icon}
          </span>
          <div className="min-w-0">
            <h1
              className="font-[family-name:var(--font-pixel)] leading-tight truncate"
              style={{
                fontSize: "11px",
                color: "#F8D030",
                textShadow: "2px 2px 0 #504000",
                letterSpacing: "0.1em",
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="font-[family-name:var(--font-body)] text-xl mt-1 leading-tight" style={{ color: "#A0A8C0" }}>
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
