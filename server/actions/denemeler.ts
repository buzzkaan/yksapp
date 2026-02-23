"use server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { netHesapla } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import type { DenemeWithDetay, DenemeType } from "@/lib/types";

type DersInput = {
  dersAdi: string;
  dogru: number;
  yanlis: number;
  bos: number;
};

export async function denemeEkle(data: {
  tur: DenemeType;
  tarih: Date;
  dersler: DersInput[];
}): Promise<void> {
  try {
    const userId = await requireUserId();
    const toplam = data.dersler.reduce(
      (acc, d) => ({
        dogru: acc.dogru + d.dogru,
        yanlis: acc.yanlis + d.yanlis,
        bos: acc.bos + d.bos,
      }),
      { dogru: 0, yanlis: 0, bos: 0 }
    );
    const toplamSoru = toplam.dogru + toplam.yanlis + toplam.bos;
    const net = netHesapla(toplam.dogru, toplam.yanlis);
    await db.deneme.create({
      data: {
        userId,
        tur: data.tur,
        tarih: data.tarih,
        toplam: toplamSoru,
        ...toplam,
        net,
        dersDetay: {
          create: data.dersler.map((d) => ({
            ...d,
            net: netHesapla(d.dogru, d.yanlis),
          })),
        },
      },
    });
    revalidatePath("/denemeler");
  } catch (error) {
    console.error("[denemeEkle]", error);
    throw new Error("Deneme eklenemedi");
  }
}

export async function denemeGetir(id: string): Promise<DenemeWithDetay | null> {
  try {
    const userId = await requireUserId();
    return db.deneme.findFirst({
      where: { id, userId },
      include: { dersDetay: true },
    }) as Promise<DenemeWithDetay | null>;
  } catch (error) {
    console.error("[denemeGetir]", error);
    return null;
  }
}

export async function denemeleriGetir(): Promise<DenemeWithDetay[]> {
  try {
    const userId = await requireUserId();
    return db.deneme.findMany({
      where: { userId },
      include: { dersDetay: true },
      orderBy: { tarih: "desc" },
    }) as Promise<DenemeWithDetay[]>;
  } catch (error) {
    console.error("[denemeleriGetir]", error);
    return [];
  }
}

export async function denemeSil(id: string): Promise<void> {
  try {
    const userId = await requireUserId();
    await db.deneme.delete({ where: { id, userId } });
    revalidatePath("/denemeler");
  } catch (error) {
    console.error("[denemeSil]", error);
    throw new Error("Deneme silinemedi");
  }
}
