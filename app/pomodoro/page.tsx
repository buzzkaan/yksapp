import Image from "next/image";
import { PomodoroTimer } from "@/components/features/PomodoroTimer";

export default function PomodoroPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="relative border-b-4 px-4 py-5"
        style={{
          background: "#181838",
          borderColor: "#FFD000",
          boxShadow: "0 4px 0 0 #504000",
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: "#FFD000" }} />
        <div className="flex items-center gap-3 pl-3">
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image src="/icon/hourglass.png" alt="pomodoro" fill className="object-contain" />
          </div>
          <div>
            <h1
              className="font-[family-name:var(--font-pixel)] leading-tight"
              style={{ fontSize: "11px", color: "#FFD000", textShadow: "2px 2px 0 #504000", letterSpacing: "0.1em" }}
            >
              POMODORO
            </h1>
            <p className="font-[family-name:var(--font-body)] text-xl mt-1" style={{ color: "#8890B8" }}>
              Her oturum bir hasat!
            </p>
          </div>
        </div>
      </div>

      <PomodoroTimer />
    </div>
  );
}
