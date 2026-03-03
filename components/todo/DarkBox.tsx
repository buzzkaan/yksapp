export function DarkBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: "#000058",
        border: "4px solid #000000",
        boxShadow: "4px 4px 0 0 #080828",
      }}
    >
      {children}
    </div>
  );
}
