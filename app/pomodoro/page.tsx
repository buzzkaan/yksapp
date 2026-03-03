import Image from "next/image";
import { PomodoroTimer } from "@/components/features/PomodoroTimer";
import { ICONS } from "@/lib/constants/icons";

export default function PomodoroPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="relative border-b-4 px-4 py-5"
        style={{
          background: "#000058",
          borderColor: "#000000",
          boxShadow: "0 4px 0 0 #000000",
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: "#FFD000" }} />
        <div className="absolute right-0 top-0 bottom-0 w-1.5" style={{ background: "#FFD000" }} />
        <div className="flex items-center gap-3 pl-3">
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image src={ICONS.hourglass} alt="pomodoro" fill className="object-contain" />
          </div>
          <div>
            <h1
              className="font-[family-name:var(--font-pixel)] leading-tight"
              style={{ fontSize: "11px", color: "#FFD000", textShadow: "2px 2px 0 #804000", letterSpacing: "0.1em" }}
            >
              POMODORO
            </h1>
            <p className="font-[family-name:var(--font-body)] text-xl mt-1" style={{ color: "#A8C8F8" }}>
              Her oturum bir hasat!
            </p>
          </div>
        </div>
      </div>

      <PomodoroTimer />
    </div>
  );
}
