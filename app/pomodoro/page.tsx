import { PageHeader } from "@/components/layout/PageHeader";
import { PomodoroTimer } from "@/components/features/PomodoroTimer";

export default function PomodoroPage() {
  return (
    <div>
      <PageHeader
        icon="⏱️"
        title="POMODORO ÇİFTLİĞİ"
        subtitle="Her oturum bir hasat!"
      />
      <PomodoroTimer />
    </div>
  );
}
