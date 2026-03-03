export function GameBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: "#A8A8A8",
        border: "4px solid #000000",
        boxShadow: "4px 4px 0 0 #000000",
      }}
    >
      {children}
    </div>
  );
}
