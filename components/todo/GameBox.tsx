export function GameBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-mario-stone border-4 border-black shadow-pixel ${className}`}>
      {children}
    </div>
  );
}
