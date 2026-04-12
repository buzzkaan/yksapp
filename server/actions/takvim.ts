"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { todayBoundaries, formatDateStr } from "@/lib/utils/date";
import { withQuery, withMutation } from "./_utils";
import type { Gorev } from "@/lib/types";

export async function gorevEkle(data: {
  tarih: Date;
  baslik: string;
  aciklama?: string;
  oncelik?: number;
  renk?: string;
}): Promise<void> {
  await withMutation("gorevEkle", "Görev eklenemedi", async (userId) => {
    await db.gunlukGorev.create({ data: { ...data, userId } });
    revalidatePath("/todo");
  });
}

export async function gorevTamamla(id: string): Promise<void> {
  await withMutation("gorevTamamla", "Görev tamamlanamadı", async (userId) => {
    await db.gunlukGorev.update({ where: { id, userId }, data: { tamamlandi: true } });
    revalidatePath("/todo");
  });
}

export async function gorevSil(id: string): Promise<void> {
  await withMutation("gorevSil", "Görev silinemedi", async (userId) => {
    await db.gunlukGorev.delete({ where: { id, userId } });
    revalidatePath("/todo");
  });
}

export async function aylikGorevlerGetir(yil: number, ay: number): Promise<Gorev[]> {
  return withQuery("aylikGorevlerGetir", async (userId) => {
    const baslangic = new Date(yil, ay - 1, 1);
    const bitis = new Date(yil, ay, 0, 23, 59, 59);
    return db.gunlukGorev.findMany({
      where: { userId, tarih: { gte: baslangic, lte: bitis } },
      orderBy: { tarih: "asc" },
    }) as Promise<Gorev[]>;
  }, []);
}

export async function bugunGorevleriGetir(): Promise<Gorev[]> {
  return withQuery("bugunGorevleriGetir", async (userId) => {
    const { bugun, yarin } = todayBoundaries();
    return db.gunlukGorev.findMany({
      where: { userId, tarih: { gte: bugun, lt: yarin } },
      orderBy: { createdAt: "asc" },
    }) as Promise<Gorev[]>;
  }, []);
}

export async function tamamlananGunleriGetir(): Promise<string[]> {
  return withQuery("tamamlananGunleriGetir", async (userId) => {
    const birYilOnce = new Date();
    birYilOnce.setFullYear(birYilOnce.getFullYear() - 1);
    const gorevler = await db.gunlukGorev.findMany({
      where: { userId, tamamlandi: true, tarih: { gte: birYilOnce } },
      select: { tarih: true },
    });
    const dates = new Set<string>();
    for (const g of gorevler) dates.add(formatDateStr(new Date(g.tarih)));
    return Array.from(dates);
  }, []);
}
