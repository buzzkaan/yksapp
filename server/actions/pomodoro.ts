"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { todayBoundaries } from "@/lib/utils/date";
import { withQuery, withMutation } from "./_utils";
import type { PomodoroOturum } from "@/lib/types";

export async function pomodoroKaydet(data: {
  baslangic: Date;
  bitis?: Date;
  sure: number;
  tamamlandi: boolean;
  konuId?: string;
  notlar?: string;
}): Promise<void> {
  await withMutation("pomodoroKaydet", "Pomodoro kaydedilemedi", async (userId) => {
    await db.pomodoroOturum.create({ data: { ...data, userId } });
    revalidatePath("/pomodoro");
  });
}

export async function bugunPomodorolariGetir(): Promise<PomodoroOturum[]> {
  return withQuery("bugunPomodorolariGetir", async (userId) => {
    const { bugun, yarin } = todayBoundaries();
    return db.pomodoroOturum.findMany({
      where: { userId, baslangic: { gte: bugun, lt: yarin }, tamamlandi: true },
      orderBy: { baslangic: "desc" },
    }) as Promise<PomodoroOturum[]>;
  }, []);
}
