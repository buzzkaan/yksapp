export const MS_PER_DAY = 86_400_000;

export function formatDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function parseDateStr(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayBoundaries(): { bugun: Date; yarin: Date } {
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const yarin = new Date(bugun);
  yarin.setDate(yarin.getDate() + 1);
  return { bugun, yarin };
}

export function hesaplaGunler(hedef: Date): number {
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  return Math.ceil((hedef.getTime() - bugun.getTime()) / MS_PER_DAY);
}

export function hesaplaStreak(dateStrs: string[]): { current: number; best: number } {
  const dateSet = new Set(dateStrs);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let current = 0;
  const check = new Date(today);
  if (dateSet.has(formatDateStr(check))) {
    current++;
    check.setDate(check.getDate() - 1);
    while (dateSet.has(formatDateStr(check))) { current++; check.setDate(check.getDate() - 1); }
  } else {
    check.setDate(check.getDate() - 1);
    if (dateSet.has(formatDateStr(check))) {
      current++;
      check.setDate(check.getDate() - 1);
      while (dateSet.has(formatDateStr(check))) { current++; check.setDate(check.getDate() - 1); }
    }
  }

  const sorted = [...dateStrs].sort();
  let best = 0, run = 0;
  let prev: string | null = null;
  for (const ds of sorted) {
    if (!prev) { run = 1; }
    else {
      const diff = Math.round(
        (new Date(ds + "T12:00:00").getTime() - new Date(prev + "T12:00:00").getTime()) / MS_PER_DAY
      );
      run = diff === 1 ? run + 1 : 1;
    }
    if (run > best) best = run;
    prev = ds;
  }

  return { current, best };
}
