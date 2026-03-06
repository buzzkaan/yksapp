"use server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { formatDateStr, parseDateStr } from "@/lib/utils/date";

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

function getYilBasi(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
}

export async function getOzetIstatistik() {
  const userId = await requireUserId();
  const now = new Date();

  const bugun = new Date(now);
  bugun.setHours(0, 0, 0, 0);
  const yarin = new Date(now);
  yarin.setDate(now.getDate() + 1);
  yarin.setHours(0, 0, 0, 0);
  const haftaBasi = getHaftaBasi();
  const ayBasi = getAyBasi();

  const [ayGorevleri, pomodorolar] = await Promise.all([
    db.gunlukGorev.findMany({ where: { userId, tarih: { gte: ayBasi, lt: yarin } } }),
    db.pomodoroOturum.findMany({ where: { userId, createdAt: { gte: haftaBasi } } }),
  ]);

  const bugunGorevleri = ayGorevleri.filter(g => g.tarih >= bugun && g.tarih < yarin);
  const haftaGorevleri = ayGorevleri.filter(g => g.tarih >= haftaBasi);

  return {
    bugunGorev: { toplam: bugunGorevleri.length, tamamlanan: bugunGorevleri.filter(g => g.tamamlandi).length },
    haftaGorev: { toplam: haftaGorevleri.length, tamamlanan: haftaGorevleri.filter(g => g.tamamlandi).length },
    ayGorev: { toplam: ayGorevleri.length, tamamlanan: ayGorevleri.filter(g => g.tamamlandi).length },
    haftaPomodoro: pomodorolar.length,
  };
}

export async function getIstatistik() {
  const userId = await requireUserId();
  const now = new Date();

  const bugun = new Date(now);
  bugun.setHours(0, 0, 0, 0);
  const yarin = new Date(bugun);
  yarin.setDate(bugun.getDate() + 1);
  const haftaBasi = getHaftaBasi();
  const ayBasi = getAyBasi();
  const yilBasi = getYilBasi();
  const otuzGunOnce = new Date(now);
  otuzGunOnce.setDate(now.getDate() - 30);
  otuzGunOnce.setHours(0, 0, 0, 0);

  // 6 queries instead of 13
  const [tumPomodoro, tumGorev, toplamKonu, tamamlananKonu, toplamDeneme, denemeler] = await Promise.all([
    db.pomodoroOturum.findMany({ where: { userId, createdAt: { gte: yilBasi, lt: yarin } } }),
    db.gunlukGorev.findMany({ where: { userId, tarih: { gte: yilBasi, lt: yarin } } }),
    db.konu.count({ where: { userId } }),
    db.konu.count({ where: { userId, tamamlandi: true } }),
    db.deneme.count({ where: { userId } }),
    db.deneme.findMany({
      where: { userId },
      orderBy: { tarih: 'desc' },
      take: 30,
      include: { dersDetay: true },
    }),
  ]);

  // In-memory sub-period filtering
  const gunlukPomodoro = tumPomodoro.filter(p => p.createdAt >= bugun);
  const haftaPomodoro = tumPomodoro.filter(p => p.createdAt >= haftaBasi);
  const aylikPomodoro = tumPomodoro.filter(p => p.createdAt >= ayBasi);

  const gunlukGorev = tumGorev.filter(g => g.tarih >= bugun && g.tarih < yarin);
  const haftaGorev = tumGorev.filter(g => g.tarih >= haftaBasi);
  const aylikGorev = tumGorev.filter(g => g.tarih >= ayBasi);

  const dakika = (arr: typeof tumPomodoro) => arr.reduce((sum, p) => sum + (p.sure || 25), 0);

  const pomodoroByDay: Record<string, { dakika: number; sayi: number }> = {};
  const gorevByDay: Record<string, { toplam: number; tamamlanan: number }> = {};

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = formatDateStr(d);
    pomodoroByDay[dateStr] = { dakika: 0, sayi: 0 };
    gorevByDay[dateStr] = { toplam: 0, tamamlanan: 0 };
  }

  tumPomodoro
    .filter(p => p.createdAt >= otuzGunOnce)
    .forEach(p => {
      const dateStr = formatDateStr(new Date(p.createdAt));
      if (pomodoroByDay[dateStr]) {
        pomodoroByDay[dateStr].dakika += p.sure || 25;
        pomodoroByDay[dateStr].sayi += 1;
      }
    });

  tumGorev
    .filter(g => g.tarih >= otuzGunOnce)
    .forEach(g => {
      const dateStr = formatDateStr(new Date(g.tarih));
      if (gorevByDay[dateStr]) {
        gorevByDay[dateStr].toplam += 1;
        if (g.tamamlandi) gorevByDay[dateStr].tamamlanan += 1;
      }
    });

  const grafikVeri = Object.entries(pomodoroByDay).map(([tarih, veri]) => ({
    tarih,
    label: parseDateStr(tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
    dakika: veri.dakika,
    sayi: veri.sayi,
    gorevToplam: gorevByDay[tarih].toplam,
    gorevTamam: gorevByDay[tarih].tamamlanan,
  }));

  const denemeGrafik = denemeler.map(d => ({
    tarih: formatDateStr(d.tarih),
    label: d.tarih.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
    tur: d.tur,
    net: d.net,
    toplam: d.toplam,
  })).reverse();

  let netToplam = 0, enYuksek = 0, tytSayi = 0, aytSayi = 0;
  for (const d of denemeler) {
    netToplam += d.net;
    if (d.net > enYuksek) enYuksek = d.net;
    if (d.tur === 'TYT') tytSayi++;
    else if (d.tur === 'AYT') aytSayi++;
  }

  const denemeIstatistik = {
    toplam: toplamDeneme,
    ortalamaNet: toplamDeneme > 0 ? netToplam / toplamDeneme : 0,
    enYuksek,
    tytSayi,
    aytSayi,
  };

  const konuIstatistik = {
    toplam: toplamKonu,
    tamamlanan: tamamlananKonu,
    yuzde: toplamKonu > 0 ? Math.round((tamamlananKonu / toplamKonu) * 100) : 0,
  };

  return {
    pomodoro: {
      gunluk: { sayi: gunlukPomodoro.length, dakika: dakika(gunlukPomodoro) },
      hafta:  { sayi: haftaPomodoro.length,  dakika: dakika(haftaPomodoro)  },
      ay:     { sayi: aylikPomodoro.length,   dakika: dakika(aylikPomodoro)  },
      yil:    { sayi: tumPomodoro.length,     dakika: dakika(tumPomodoro)    },
    },
    gorev: {
      gunluk: { toplam: gunlukGorev.length, tamamlanan: gunlukGorev.filter(g => g.tamamlandi).length },
      hafta:  { toplam: haftaGorev.length,  tamamlanan: haftaGorev.filter(g => g.tamamlandi).length  },
      ay:     { toplam: aylikGorev.length,   tamamlanan: aylikGorev.filter(g => g.tamamlandi).length  },
      yil:    { toplam: tumGorev.length,     tamamlanan: tumGorev.filter(g => g.tamamlandi).length    },
    },
    konu: konuIstatistik,
    deneme: denemeIstatistik,
    grafik: grafikVeri,
    denemeGrafik,
  };
}
