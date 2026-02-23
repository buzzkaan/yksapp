"use server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { todayBoundaries } from "@/lib/utils/date";
import type { PomodoroOturum } from "@/lib/types";

export async function pomodoroKaydet(data: {
  baslangic: Date;
  bitis?: Date;
  sure: number;
  tamamlandi: boolean;
  konuId?: string;
  notlar?: string;
}): Promise<void> {
  try {
    const userId = await requireUserId();
    await db.pomodoroOturum.create({ data: { ...data, userId } });
    revalidatePath("/pomodoro");
  } catch (error) {
    console.error("[pomodoroKaydet]", error);
    throw new Error("Pomodoro kaydedilemedi");
  }
}

export async function bugunPomodorolariGetir(): Promise<PomodoroOturum[]> {
  try {
    const userId = await requireUserId();
    const { bugun, yarin } = todayBoundaries();
    return db.pomodoroOturum.findMany({
      where: {
        userId,
        baslangic: { gte: bugun, lt: yarin },
        tamamlandi: true,
      },
      orderBy: { baslangic: "desc" },
    }) as Promise<PomodoroOturum[]>;
  } catch (error) {
    console.error("[bugunPomodorolariGetir]", error);
    return [];
  }
}

export async function toplamPomodoroGetir(): Promise<number> {
  try {
    const userId = await requireUserId();
    return db.pomodoroOturum.count({ where: { userId, tamamlandi: true } });
  } catch (error) {
    console.error("[toplamPomodoroGetir]", error);
    return 0;
  }
}
