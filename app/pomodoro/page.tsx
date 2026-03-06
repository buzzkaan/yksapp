import { PomodoroTimer } from "@/components/features/PomodoroTimer";
import { PageHeader } from "@/components/layout/PageHeader";

export default function PomodoroPage() {
  return (
    <>
      <PageHeader icon="🍅" title="POMODORO" subtitle="Her oturum bir hasat!" />
      <PomodoroTimer />
    </>
  );
}
