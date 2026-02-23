"use server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { todayBoundaries, formatDateStr } from "@/lib/utils/date";
import type { Gorev } from "@/lib/types";

export async function gorevEkle(data: {
  tarih: Date;
  baslik: string;
  aciklama?: string;
  renk?: string;
}): Promise<void> {
  try {
    const userId = await requireUserId();
    await db.gunlukGorev.create({ data: { ...data, userId } });
    revalidatePath("/todo");
  } catch (error) {
    console.error("[gorevEkle]", error);
    throw new Error("Görev eklenemedi");
  }
}

export async function gorevTamamla(id: string): Promise<void> {
  try {
    const userId = await requireUserId();
    await db.gunlukGorev.update({
      where: { id, userId },
      data: { tamamlandi: true },
    });
    revalidatePath("/todo");
  } catch (error) {
    console.error("[gorevTamamla]", error);
    throw new Error("Görev tamamlanamadı");
  }
}

export async function gorevSil(id: string): Promise<void> {
  try {
    const userId = await requireUserId();
    await db.gunlukGorev.delete({ where: { id, userId } });
    revalidatePath("/todo");
  } catch (error) {
    console.error("[gorevSil]", error);
    throw new Error("Görev silinemedi");
  }
}

export async function aylikGorevlerGetir(yil: number, ay: number): Promise<Gorev[]> {
  try {
    const userId = await requireUserId();
    const baslangic = new Date(yil, ay - 1, 1);
    const bitis = new Date(yil, ay, 0, 23, 59, 59);
    return db.gunlukGorev.findMany({
      where: { userId, tarih: { gte: baslangic, lte: bitis } },
      orderBy: { tarih: "asc" },
    }) as Promise<Gorev[]>;
  } catch (error) {
    console.error("[aylikGorevlerGetir]", error);
    return [];
  }
}

export async function bugunGorevleriGetir(): Promise<Gorev[]> {
  try {
    const userId = await requireUserId();
    const { bugun, yarin } = todayBoundaries();
    return db.gunlukGorev.findMany({
      where: { userId, tarih: { gte: bugun, lt: yarin } },
      orderBy: { createdAt: "asc" },
    }) as Promise<Gorev[]>;
  } catch (error) {
    console.error("[bugunGorevleriGetir]", error);
    return [];
  }
}

export async function tamamlananGunleriGetir(): Promise<string[]> {
  try {
    const userId = await requireUserId();
    const birYilOnce = new Date();
    birYilOnce.setFullYear(birYilOnce.getFullYear() - 1);
    const gorevler = await db.gunlukGorev.findMany({
      where: { userId, tamamlandi: true, tarih: { gte: birYilOnce } },
      select: { tarih: true },
    });
    const dates = new Set<string>();
    for (const g of gorevler) {
      dates.add(formatDateStr(new Date(g.tarih)));
    }
    return Array.from(dates);
  } catch (error) {
    console.error("[tamamlananGunleriGetir]", error);
    return [];
  }
}
