"use server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { netHesapla } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function denemeEkle(data: {
  tur: "TYT" | "AYT";
  tarih: Date;
  dersler: Array<{
    dersAdi: string;
    dogru: number;
    yanlis: number;
    bos: number;
  }>;
}) {
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
}

export async function denemeGetir(id: string) {
  const userId = await requireUserId();
  return db.deneme.findFirst({
    where: { id, userId },
    include: { dersDetay: true },
  });
}

export async function denemeleriGetir() {
  const userId = await requireUserId();
  return db.deneme.findMany({
    where: { userId },
    include: { dersDetay: true },
    orderBy: { tarih: "desc" },
  });
}

export async function denemeSil(id: string) {
  const userId = await requireUserId();
  await db.deneme.delete({ where: { id, userId } });
  revalidatePath("/denemeler");
}
