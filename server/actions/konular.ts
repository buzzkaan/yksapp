"use server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { DersWithKonular, Konu } from "@/lib/types";

export async function derslerGetir(): Promise<DersWithKonular[]> {
  const userId = await requireUserId();
  return db.ders.findMany({
    where: { userId },
    include: {
      konular: {
        orderBy: [{ tamamlandi: "asc" }, { oncelik: "desc" }],
      },
    },
    orderBy: { createdAt: "asc" },
  }) as Promise<DersWithKonular[]>;
}

export async function dersEkle(data: { ad: string; renk: string; icon: string }) {
  const userId = await requireUserId();
  await db.ders.create({ data: { ...data, userId } });
  revalidatePath("/konular");
}

export async function konuEkle(data: {
  baslik: string;
  dersId: string;
  oncelik: number;
  aciklama?: string;
}) {
  const userId = await requireUserId();
  const ders = await db.ders.findFirst({ where: { id: data.dersId, userId } });
  if (!ders) throw new Error("Ders bulunamadı");
  await db.konu.create({ data: { ...data, userId } });
  revalidatePath("/konular");
}

export async function konuTamamla(id: string) {
  const userId = await requireUserId();
  await db.konu.update({
    where: { id, userId },
    data: { tamamlandi: true },
  });
  revalidatePath("/konular");
}

export async function konuToggle(id: string, tamamlandi: boolean) {
  const userId = await requireUserId();
  await db.konu.update({
    where: { id, userId },
    data: { tamamlandi },
  });
  revalidatePath("/konular");
}

export async function dersSil(id: string) {
  const userId = await requireUserId();
  await db.ders.delete({ where: { id, userId } });
  revalidatePath("/konular");
}

export async function konuSil(id: string) {
  const userId = await requireUserId();
  await db.konu.delete({ where: { id, userId } });
  revalidatePath("/konular");
}

export async function konularGetir(dersId: string): Promise<Konu[]> {
  const userId = await requireUserId();
  return db.konu.findMany({
    where: { dersId, userId },
    orderBy: [{ tamamlandi: "asc" }, { oncelik: "desc" }],
  }) as Promise<Konu[]>;
}
