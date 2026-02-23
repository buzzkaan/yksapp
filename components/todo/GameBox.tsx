export function GameBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: "#F8F0DC",
        border: "4px solid #101010",
        boxShadow: "4px 4px 0 0 #101010",
      }}
    >
      {children}
    </div>
  );
}
