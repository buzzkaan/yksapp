export function DarkBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: "#181828",
        border: "4px solid #4088F0",
        boxShadow: "4px 4px 0 0 #080818",
      }}
    >
      {children}
    </div>
  );
}
