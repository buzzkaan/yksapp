import type { Konu, Ders, PomodoroOturum, Deneme, DenemeDetay, GunlukGorev } from "@prisma/client";
import { DenemeType } from "@prisma/client";

export type { Konu, Ders, PomodoroOturum, Deneme, DenemeDetay, GunlukGorev };
export { DenemeType };

export type DersWithKonular = Ders & {
  konular: Konu[];
};

export type DenemeWithDetay = Deneme & {
  dersDetay: DenemeDetay[];
};

export type Gorev = GunlukGorev;
