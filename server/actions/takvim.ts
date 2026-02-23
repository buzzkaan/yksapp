"use server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function gorevEkle(data: {
  tarih: Date;
  baslik: string;
  aciklama?: string;
  renk?: string;
}) {
  const userId = await requireUserId();
  await db.gunlukGorev.create({ data: { ...data, userId } });
  revalidatePath("/konular");
}

export async function gorevTamamla(id: string) {
  const userId = await requireUserId();
  await db.gunlukGorev.update({
    where: { id, userId },
    data: { tamamlandi: true },
  });
  revalidatePath("/konular");
}

export async function gorevSil(id: string) {
  const userId = await requireUserId();
  await db.gunlukGorev.delete({ where: { id, userId } });
  revalidatePath("/konular");
}

export async function aylikGorevlerGetir(yil: number, ay: number) {
  const userId = await requireUserId();
  const baslangic = new Date(yil, ay - 1, 1);
  const bitis = new Date(yil, ay, 0, 23, 59, 59);
  return db.gunlukGorev.findMany({
    where: { userId, tarih: { gte: baslangic, lte: bitis } },
    orderBy: { tarih: "asc" },
  });
}

export async function bugunGorevleriGetir() {
  const userId = await requireUserId();
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const yarin = new Date(bugun);
  yarin.setDate(yarin.getDate() + 1);
  return db.gunlukGorev.findMany({
    where: { userId, tarih: { gte: bugun, lt: yarin } },
    orderBy: { createdAt: "asc" },
  });
}

export async function tamamlananGunleriGetir() {
  const userId = await requireUserId();
  const birYilOnce = new Date();
  birYilOnce.setFullYear(birYilOnce.getFullYear() - 1);
  const gorevler = await db.gunlukGorev.findMany({
    where: { userId, tamamlandi: true, tarih: { gte: birYilOnce } },
    select: { tarih: true },
  });
  const dates = new Set<string>();
  for (const g of gorevler) {
    const d = new Date(g.tarih);
    dates.add(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    );
  }
  return Array.from(dates);
}
