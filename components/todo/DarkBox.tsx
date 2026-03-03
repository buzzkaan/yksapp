export function DarkBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-mario-navy border-4 border-black shadow-pixel-navy ${className}`}>
      {children}
    </div>
  );
}
