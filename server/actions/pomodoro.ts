"use server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function pomodoroKaydet(data: {
  baslangic: Date;
  bitis?: Date;
  sure: number;
  tamamlandi: boolean;
  konuId?: string;
  notlar?: string;
}) {
  const userId = await requireUserId();
  await db.pomodoroOturum.create({ data: { ...data, userId } });
  revalidatePath("/pomodoro");
}

export async function bugunPomodorolariGetir() {
  const userId = await requireUserId();
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const yarin = new Date(bugun);
  yarin.setDate(yarin.getDate() + 1);

  return db.pomodoroOturum.findMany({
    where: {
      userId,
      baslangic: { gte: bugun, lt: yarin },
      tamamlandi: true,
    },
    orderBy: { baslangic: "desc" },
  });
}

export async function toplamPomodoroGetir() {
  const userId = await requireUserId();
  return db.pomodoroOturum.count({ where: { userId, tamamlandi: true } });
}
