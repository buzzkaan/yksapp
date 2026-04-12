"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withQuery, withMutation } from "./_utils";
import type { DersWithKonular } from "@/lib/types";

export async function derslerGetir(): Promise<DersWithKonular[]> {
  return withQuery("derslerGetir", (userId) =>
    db.ders.findMany({
      where: { userId },
      include: { konular: { orderBy: [{ tamamlandi: "asc" }, { oncelik: "desc" }] } },
      orderBy: { createdAt: "asc" },
    }) as Promise<DersWithKonular[]>,
  []);
}

export async function dersEkle(data: { ad: string; renk: string; icon: string }): Promise<void> {
  await withMutation("dersEkle", "Ders eklenemedi", async (userId) => {
    await db.ders.create({ data: { ...data, userId } });
    revalidatePath("/todo");
  });
}

export async function konuEkle(data: {
  baslik: string;
  dersId: string;
  oncelik: number;
  aciklama?: string;
}): Promise<void> {
  await withMutation("konuEkle", "Konu eklenemedi", async (userId) => {
    const ders = await db.ders.findFirst({ where: { id: data.dersId, userId } });
    if (!ders) throw new Error("Ders bulunamadı");
    await db.konu.create({ data: { ...data, userId } });
    revalidatePath("/todo");
  });
}

export async function konuToggle(id: string, tamamlandi: boolean): Promise<void> {
  await withMutation("konuToggle", "Konu güncellenemedi", async (userId) => {
    await db.konu.update({ where: { id, userId }, data: { tamamlandi } });
    revalidatePath("/todo");
  });
}

export async function dersSil(id: string): Promise<void> {
  await withMutation("dersSil", "Ders silinemedi", async (userId) => {
    await db.ders.delete({ where: { id, userId } });
    revalidatePath("/todo");
  });
}

export async function konuSil(id: string): Promise<void> {
  await withMutation("konuSil", "Konu silinemedi", async (userId) => {
    await db.konu.delete({ where: { id, userId } });
    revalidatePath("/todo");
  });
}
