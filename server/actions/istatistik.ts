"use server";
import { LS_SINAV_KEY, type SinavTipi } from "@/lib/sinav-data";

const VALID_SINAV: SinavTipi[] = ["YKS", "DGS", "KPSS"];

export async function getSinavTipiServer(): Promise<SinavTipi> {
  const { cookies } = await import("next/headers");
  return "YKS";
}

function getHaftaBasi(): Date {
  const now = new Date();
  const gun = now.getDay();
  const fark = gun === 0 ? 6 : gun - 1;
  const haftaBasi = new Date(now);
  haftaBasi.setDate(now.getDate() - fark);
  haftaBasi.setHours(0, 0, 0, 0);
  return haftaBasi;
}

function getAyBasi(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getOzetIstatistik() {
  const { db } = await import("@/lib/db");
  const { requireUserId } = await import("@/lib/auth");
  const { formatDateStr } = await import("@/lib/utils/date");
  
  const userId = await requireUserId();
  const now = new Date();
  
  const bugun = new Date(now);
  bugun.setHours(0, 0, 0, 0);
  const yarin = new Date(now);
  yarin.setDate(now.getDate() + 1);
  yarin.setHours(0, 0, 0, 0);
  const haftaBasi = getHaftaBasi();
  const ayBasi = getAyBasi();
  
  const [bugunGorevleri, haftaGorevleri, ayGorevleri, pomodorolar] = await Promise.all([
    db.gunlukGorev.findMany({ where: { userId, tarih: { gte: bugun, lt: yarin } } }),
    db.gunlukGorev.findMany({ where: { userId, tarih: { gte: haftaBasi, lt: yarin } } }),
    db.gunlukGorev.findMany({ where: { userId, tarih: { gte: ayBasi, lt: yarin } } }),
    db.pomodoroOturum.findMany({ where: { userId, createdAt: { gte: haftaBasi } } }),
  ]);
  
  const bugunTamam = bugunGorevleri.filter(g => g.tamamlandi).length;
  const haftaTamam = haftaGorevleri.filter(g => g.tamamlandi).length;
  const ayTamam = ayGorevleri.filter(g => g.tamamlandi).length;
  
  const haftaPomodoro = pomodorolar.length;
  
  return {
    bugunGorev: { toplam: bugunGorevleri.length, tamamlanan: bugunTamam },
    haftaGorev: { toplam: haftaGorevleri.length, tamamlanan: haftaTamam },
    ayGorev: { toplam: ayGorevleri.length, tamamlanan: ayTamam },
    haftaPomodoro,
  };
}
