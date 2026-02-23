"use server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { DersWithKonular, Konu } from "@/lib/types";

export async function derslerGetir(): Promise<DersWithKonular[]> {
  try {
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
  } catch (error) {
    console.error("[derslerGetir]", error);
    return [];
  }
}

export async function dersEkle(data: { ad: string; renk: string; icon: string }) {
  try {
    const userId = await requireUserId();
    await db.ders.create({ data: { ...data, userId } });
    revalidatePath("/todo");
  } catch (error) {
    console.error("[dersEkle]", error);
    throw new Error("Ders eklenemedi");
  }
}

export async function konuEkle(data: {
  baslik: string;
  dersId: string;
  oncelik: number;
  aciklama?: string;
}) {
  try {
    const userId = await requireUserId();
    const ders = await db.ders.findFirst({ where: { id: data.dersId, userId } });
    if (!ders) throw new Error("Ders bulunamadı");
    await db.konu.create({ data: { ...data, userId } });
    revalidatePath("/todo");
  } catch (error) {
    console.error("[konuEkle]", error);
    throw new Error("Konu eklenemedi");
  }
}

export async function konuToggle(id: string, tamamlandi: boolean) {
  try {
    const userId = await requireUserId();
    await db.konu.update({
      where: { id, userId },
      data: { tamamlandi },
    });
    revalidatePath("/todo");
  } catch (error) {
    console.error("[konuToggle]", error);
    throw new Error("Konu güncellenemedi");
  }
}

export async function dersSil(id: string) {
  try {
    const userId = await requireUserId();
    await db.ders.delete({ where: { id, userId } });
    revalidatePath("/todo");
  } catch (error) {
    console.error("[dersSil]", error);
    throw new Error("Ders silinemedi");
  }
}

export async function konuSil(id: string) {
  try {
    const userId = await requireUserId();
    await db.konu.delete({ where: { id, userId } });
    revalidatePath("/todo");
  } catch (error) {
    console.error("[konuSil]", error);
    throw new Error("Konu silinemedi");
  }
}

export async function konularGetir(dersId: string): Promise<Konu[]> {
  try {
    const userId = await requireUserId();
    return db.konu.findMany({
      where: { dersId, userId },
      orderBy: [{ tamamlandi: "asc" }, { oncelik: "desc" }],
    }) as Promise<Konu[]>;
  } catch (error) {
    console.error("[konularGetir]", error);
    return [];
  }
}
