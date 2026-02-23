export function DarkBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: "#181838",
        border: "4px solid #101010",
        boxShadow: "4px 4px 0 0 #080828",
      }}
    >
      {children}
    </div>
  );
}
