"use server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const BASARIM_TANIMLARI = [
  // Streak başarımları
  { tur: "streak", anahtar: "3_gun_streak", ad: "🔥 3 Gün Streak", aciklama: "3 gün üst üste görev tamamla", puan: 10 },
  { tur: "streak", anahtar: "7_gun_streak", ad: "🔥 7 Gün Streak", aciklama: "7 gün üst üste görev tamamla", puan: 25 },
  { tur: "streak", anahtar: "14_gun_streak", ad: "🔥 14 Gün Streak", aciklama: "14 gün üst üste görev tamamla", puan: 50 },
  { tur: "streak", anahtar: "30_gun_streak", ad: "🔥 30 Gün Streak", aciklama: "30 gün üst üste görev tamamla", puan: 100 },
  
  // Pomodoro başarımları
  { tur: "pomodoro", anahtar: "ilk_pomodoro", ad: "🍅 İlk Pomodoro", aciklama: "İlk pomodoro oturumunu tamamla", puan: 5 },
  { tur: "pomodoro", anahtar: "10_pomodoro", ad: "🍅 10 Pomodoro", aciklama: "10 pomodoro oturumu tamamla", puan: 15 },
  { tur: "pomodoro", anahtar: "50_pomodoro", ad: "🍅 50 Pomodoro", aciklama: "50 pomodoro oturumu tamamla", puan: 40 },
  { tur: "pomodoro", anahtar: "100_pomodoro", ad: "🍅 100 Pomodoro", aciklama: "100 pomodoro oturumu tamamla", puan: 80 },
  
  // Görev başarımları
  { tur: "gorev", anahtar: "ilk_gorev", ad: "✅ İlk Görev", aciklama: "İlk görevini tamamla", puan: 5 },
  { tur: "gorev", anahtar: "10_gorev", ad: "✅ 10 Görev", aciklama: "10 görev tamamla", puan: 15 },
  { tur: "gorev", anahtar: "50_gorev", ad: "✅ 50 Görev", aciklama: "50 görev tamamla", puan: 40 },
  { tur: "gorev", anahtar: "100_gorev", ad: "✅ 100 Görev", aciklama: "100 görev tamamla", puan: 80 },
  
  // Konu başarımları
  { tur: "konu", anahtar: "ilk_konu", ad: "📚 İlk Konu", aciklama: "İlk konuyu tamamla", puan: 5 },
  { tur: "konu", anahtar: "10_konu", ad: "📚 10 Konu", aciklama: "10 konu tamamla", puan: 15 },
  { tur: "konu", anahtar: "50_konu", ad: "📚 50 Konu", aciklama: "50 konu tamamla", puan: 40 },
  { tur: "konu", anahtar: "100_konu", ad: "📚 100 Konu", aciklama: "100 konu tamamla", puan: 80 },
  
  // Deneme başarımları
  { tur: "deneme", anahtar: "ilk_deneme", ad: "📝 İlk Deneme", aciklama: "İlk denemeni gir", puan: 5 },
  { tur: "deneme", anahtar: "5_deneme", ad: "📝 5 Deneme", aciklama: "5 deneme gir", puan: 15 },
  { tur: "deneme", anahtar: "10_deneme", ad: "📝 10 Deneme", aciklama: "10 deneme gir", puan: 30 },
  { tur: "deneme", anahtar: "25_deneme", ad: "📝 25 Deneme", aciklama: "25 deneme gir", puan: 60 },
];

export async function basarimlariGetir() {
  const userId = await requireUserId();
  
  let basarimlar = await db.basarim.findMany({ where: { userId } });
  
  if (basarimlar.length === 0) {
    for (const b of BASARIM_TANIMLARI) {
      await db.basarim.create({
        data: { userId, ...b, kazanildi: false },
      });
    }
    basarimlar = await db.basarim.findMany({ where: { userId } });
  }
  
  return basarimlar;
}

export async function basarimlariKontrolEt() {
  const userId = await requireUserId();
  
  const [pomodoroSayi, gorevSayi, konuSayi, denemeSayi, basarimlar] = await Promise.all([
    db.pomodoroOturum.count({ where: { userId, tamamlandi: true } }),
    db.gunlukGorev.count({ where: { userId, tamamlandi: true } }),
    db.konu.count({ where: { userId, tamamlandi: true } }),
    db.deneme.count({ where: { userId } }),
    db.basarim.findMany({ where: { userId, kazanildi: false } }),
  ]);
  
  const yeniKazanimlar: string[] = [];
  
  for (const b of basarimlar) {
    let kazanildi = false;
    
    switch (b.tur) {
      case "streak":
        if (b.anahtar === "3_gun_streak") kazanildi = gorevSayi >= 3;
        else if (b.anahtar === "7_gun_streak") kazanildi = gorevSayi >= 7;
        else if (b.anahtar === "14_gun_streak") kazanildi = gorevSayi >= 14;
        else if (b.anahtar === "30_gun_streak") kazanildi = gorevSayi >= 30;
        break;
      case "pomodoro":
        if (b.anahtar === "ilk_pomodoro") kazanildi = pomodoroSayi >= 1;
        else if (b.anahtar === "10_pomodoro") kazanildi = pomodoroSayi >= 10;
        else if (b.anahtar === "50_pomodoro") kazanildi = pomodoroSayi >= 50;
        else if (b.anahtar === "100_pomodoro") kazanildi = pomodoroSayi >= 100;
        break;
      case "gorev":
        if (b.anahtar === "ilk_gorev") kazanildi = gorevSayi >= 1;
        else if (b.anahtar === "10_gorev") kazanildi = gorevSayi >= 10;
        else if (b.anahtar === "50_gorev") kazanildi = gorevSayi >= 50;
        else if (b.anahtar === "100_gorev") kazanildi = gorevSayi >= 100;
        break;
      case "konu":
        if (b.anahtar === "ilk_konu") kazanildi = konuSayi >= 1;
        else if (b.anahtar === "10_konu") kazanildi = konuSayi >= 10;
        else if (b.anahtar === "50_konu") kazanildi = konuSayi >= 50;
        else if (b.anahtar === "100_konu") kazanildi = konuSayi >= 100;
        break;
      case "deneme":
        if (b.anahtar === "ilk_deneme") kazanildi = denemeSayi >= 1;
        else if (b.anahtar === "5_deneme") kazanildi = denemeSayi >= 5;
        else if (b.anahtar === "10_deneme") kazanildi = denemeSayi >= 10;
        else if (b.anahtar === "25_deneme") kazanildi = denemeSayi >= 25;
        break;
    }
    
    if (kazanildi) {
      await db.basarim.update({
        where: { id: b.id },
        data: { kazanildi: true, kazanildiTarih: new Date() },
      });
      yeniKazanimlar.push(b.ad);
      
      await userAyarlariniGuncelle({ xpArttir: b.puan });
    }
  }
  
  return yeniKazanimlar;
}

export async function userAyarlariniGetir() {
  const userId = await requireUserId();
  
  let ayarlar = await db.userAyarlar.findUnique({ where: { userId } });
  
  if (!ayarlar) {
    ayarlar = await db.userAyarlar.create({
      data: { userId },
    });
  }
  
  return ayarlar;
}

export async function userAyarlariniGuncelle(data: {
  sinavTipi?: string;
  hedefUni?: string;
  hedefBolum?: string;
  hedefNet?: number;
  xpArttir?: number;
}) {
  const userId = await requireUserId();
  
  const mevcut = await db.userAyarlar.findUnique({ where: { userId } });
  const sinavTipi = mevcut?.sinavTipi || "YKS";
  
  if (!mevcut) {
    await db.userAyarlar.create({
      data: { userId },
    });
  }
  
  const yksXp = data.xpArttir ? (mevcut?.yksXp || 0) + (sinavTipi === "YKS" ? data.xpArttir : 0) : undefined;
  const dgsXp = data.xpArttir ? (mevcut?.dgsXp || 0) + (sinavTipi === "DGS" ? data.xpArttir : 0) : undefined;
  const kpssXp = data.xpArttir ? (mevcut?.kpssXp || 0) + (sinavTipi === "KPSS" ? data.xpArttir : 0) : undefined;
  
  const xp = data.xpArttir ? (mevcut?.xp || 0) + data.xpArttir : undefined;
  
  await db.userAyarlar.update({
    where: { userId },
    data: {
      ...(data.sinavTipi && { sinavTipi: data.sinavTipi }),
      ...(data.hedefUni !== undefined && { hedefUni: data.hedefUni }),
      ...(data.hedefBolum !== undefined && { hedefBolum: data.hedefBolum }),
      ...(data.hedefNet !== undefined && { hedefNet: data.hedefNet }),
      ...(yksXp !== undefined && { yksXp, yksSeviye: Math.floor(yksXp / 100) + 1 }),
      ...(dgsXp !== undefined && { dgsXp, dgsSeviye: Math.floor(dgsXp / 100) + 1 }),
      ...(kpssXp !== undefined && { kpssXp, kpssSeviye: Math.floor(kpssXp / 100) + 1 }),
      ...(xp !== undefined && { xp }),
      ...(xp !== undefined && { seviye: Math.floor(xp / 100) + 1 }),
    },
  });
  
  revalidatePath("/");
}

export async function girisYapildi() {
  const userId = await requireUserId();
  
  let ayarlar = await db.userAyarlar.findUnique({ where: { userId } });
  
  const simdi = new Date();
  const bugun = new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate());
  const sinavTipi = ayarlar?.sinavTipi || "YKS";
  const bonusXp = 5;
  
  if (!ayarlar) {
    await db.userAyarlar.create({
      data: { 
        userId, 
        sonGirisTarih: bugun, 
        xp: bonusXp,
        yksXp: sinavTipi === "YKS" ? bonusXp : 0,
        dgsXp: sinavTipi === "DGS" ? bonusXp : 0,
        kpssXp: sinavTipi === "KPSS" ? bonusXp : 0,
      },
    });
    return { yeniGiris: true, xpKazan: bonusXp };
  }
  
  const sonGiris = ayarlar.sonGirisTarih ? new Date(ayarlar.sonGirisTarih) : null;
  const sonGirinBugun = sonGiris && sonGiris.getFullYear() === bugun.getFullYear() && 
                         sonGiris.getMonth() === bugun.getMonth() && 
                         sonGiris.getDate() === bugun.getDate();
  
  if (!sonGirinBugun) {
    const updateData: Record<string, number | Date> = {
      sonGirisTarih: bugun,
      xp: ayarlar.xp + bonusXp,
    };
    
    if (sinavTipi === "YKS") {
      updateData.yksXp = (ayarlar as any).yksXp + bonusXp || bonusXp;
    } else if (sinavTipi === "DGS") {
      updateData.dgsXp = (ayarlar as any).dgsXp + bonusXp || bonusXp;
    } else if (sinavTipi === "KPSS") {
      updateData.kpssXp = (ayarlar as any).kpssXp + bonusXp || bonusXp;
    }
    
    await db.userAyarlar.update({
      where: { userId },
      data: updateData,
    });
    return { yeniGiris: true, xpKazan: bonusXp };
  }
  
  return { yeniGiris: false, xpKazan: 0 };
}
