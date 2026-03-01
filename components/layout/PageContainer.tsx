import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col py-4 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}
