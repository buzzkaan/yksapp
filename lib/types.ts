import type { Konu, Ders, PomodoroOturum, Deneme, DenemeDetay, GunlukGorev, Prisma } from "@prisma/client";
import { DenemeType } from "@prisma/client";

export type { Konu, Ders, PomodoroOturum, Deneme, DenemeDetay, GunlukGorev };
export { DenemeType };

export type DersWithKonular = Prisma.DersGetPayload<{ include: { konular: true } }>;
export type DenemeWithDetay = Prisma.DenemeGetPayload<{ include: { dersDetay: true } }>;
export type Gorev = GunlukGorev & { oncelik: number };
