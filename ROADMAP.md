# YKS Quest — Proje Dokümantasyonu

> Pokémon esintili, pixel-art tasarımlı YKS/DGS/KPSS çalışma RPG uygulaması.

---

## İçindekiler

1. [Proje Genel Bakış](#1-proje-genel-bakış)
2. [Teknoloji Yığını](#2-teknoloji-yığını)
3. [Mimari](#3-mimari)
4. [Sayfa Kataloğu](#4-sayfa-kataloğu)
5. [Bileşen Kütüphanesi](#5-bileşen-kütüphanesi)
6. [Veritabanı Şeması](#6-veritabanı-şeması)
7. [Server Actions](#7-server-actions)
8. [Gamification Sistemi](#8-gamification-sistemi)
9. [Tasarım Sistemi](#9-tasarım-sistemi)
10. [PWA & Deployment](#10-pwa--deployment)
11. [Roadmap](#11-roadmap)

---

## 1. Proje Genel Bakış

**YKS Quest**, Türkiye'deki üniversite sınavlarına (YKS, DGS, KPSS) hazırlanan öğrenciler için geliştirilmiş bir çalışma takip uygulamasıdır. Sıradan bir to-do veya pomodoro uygulaması yerine, çalışmayı bir RPG oyununa dönüştürür:

- Konu tamamlama → XP kazanma
- Pomodoro oturumları → Combo bonusu
- Günlük giriş → Login bonusu
- Başarımlar unlock etme → Achievement sistemi
- Liderlik tablosu → Diğer oyuncularla yarışma

### Temel Özellikler

| Özellik | Açıklama |
|---|---|
| Çoklu sınav desteği | YKS, DGS, KPSS — her biri ayrı XP/seviye |
| Konu haritası | Ders + konu ağacı, tamamlanma takibi |
| Pomodoro | 25/5 dk timer, oturum kaydı |
| Günlük görevler | Takvim bazlı, öncelikli görev listesi |
| Deneme takibi | TYT/AYT net kaydı, ders bazlı analiz |
| İstatistikler | 30 günlük grafik, pomodoro/görev/konu metrikleri |
| Başarımlar | 20+ başarım, XP ödüllü |
| Liderlik tablosu | Sınav bazlı global sıralama |
| Net hesaplama | Sınav türüne göre net hesaplama aracı |
| Haftalık program | Günlük ders planı oluşturma |
| PWA | Mobile'a kurulabilir, offline-ready |

---

## 2. Teknoloji Yığını

### Runtime & Framework
| Paket | Versiyon | Kullanım |
|---|---|---|
| Next.js | 16.1.6 | App Router, Server Actions, Turbopack |
| React | 19.2.3 | UI runtime |
| TypeScript | ^5 | Tip güvenliği |

### Veritabanı & ORM
| Paket | Versiyon | Kullanım |
|---|---|---|
| Prisma | 7.4.1 | ORM, şema yönetimi |
| @prisma/adapter-neon | 7.4.1 | Neon serverless adaptörü |
| @neondatabase/serverless | 1.0.2 | Neon PostgreSQL bağlantısı |

### Kimlik Doğrulama
| Paket | Versiyon | Kullanım |
|---|---|---|
| @clerk/nextjs | 6.38.1 | Auth, kullanıcı yönetimi |

### UI & Stil
| Paket | Versiyon | Kullanım |
|---|---|---|
| Tailwind CSS | ^4 | Utility-first CSS |
| react-hot-toast | 2.6.0 | Toast bildirimleri |
| Press Start 2P | Google Font | Pixel başlık fontu |
| VT323 | Google Font | Pixel body fontu |

### Yardımcı Kütüphaneler
| Paket | Versiyon | Kullanım |
|---|---|---|
| clsx + tailwind-merge | — | Class birleştirme |
| date-fns | 4.1.0 | Tarih işlemleri (kısmi) |

---

## 3. Mimari

### Dizin Yapısı

```
my-app/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (Clerk, Navbar, PWA)
│   ├── page.tsx                # Ana sayfa (köy ekranı)
│   ├── ayarlar/                # Sınav seçimi, hedefler, profil
│   ├── basarimlar/             # Başarımlar galerisi
│   ├── denemeler/              # Deneme kaydı ve analizi
│   ├── harita/                 # Dünya haritası (konu görselleştirme)
│   ├── hesaplama/              # Net hesaplama aracı
│   ├── istatistik/             # Detaylı istatistikler + grafikler
│   ├── liderlik/               # Liderlik tablosu
│   ├── pomodoro/               # Pomodoro timer
│   ├── program/                # Haftalık program
│   ├── todo/                   # Görev + konu yönetimi
│   ├── yks/                    # Konu haritası (YKS ana sayfası)
│   └── sign-in / sign-up/      # Clerk auth sayfaları
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Desktop sidebar + mobile bottom bar
│   │   ├── PageHeader.tsx      # Sayfa başlığı bileşeni
│   │   └── PageContainer.tsx   # İçerik sarmalayıcı
│   ├── pixel/                  # Pixel-art UI kit
│   │   ├── PixelCard.tsx
│   │   ├── PixelButton.tsx
│   │   ├── PixelBadge.tsx
│   │   ├── PixelProgress.tsx
│   │   └── PixelLineChart.tsx
│   ├── features/               # Domain feature bileşenleri
│   │   ├── PomodoroTimer.tsx
│   │   ├── SinavGeriSayim.tsx
│   │   ├── DenemeForm.tsx
│   │   ├── KonuCard.tsx
│   │   └── CalendarGrid.tsx
│   ├── todo/                   # Todo sayfası alt bileşenleri
│   │   ├── TaskPanel.tsx
│   │   ├── SubjectPanel.tsx
│   │   ├── TodoItem.tsx
│   │   ├── GameBox.tsx
│   │   └── DarkBox.tsx
│   ├── UserLevelBadge.tsx      # XP / seviye göstergesi
│   ├── DailyLoginBonus.tsx     # Günlük giriş bonusu
│   ├── IstatistikOzet.tsx      # İstatistik özet kartı
│   ├── BasarimOzet.tsx         # Başarım özet kartı
│   └── PWAInit.tsx             # Service worker kaydı
│
├── server/
│   └── actions/                # Next.js Server Actions
│       ├── basarim.ts          # XP, seviye, başarım, login bonus
│       ├── denemeler.ts        # Deneme CRUD
│       ├── istatistik.ts       # İstatistik agregasyonları
│       ├── konular.ts          # Ders + konu CRUD
│       ├── pomodoro.ts         # Pomodoro oturum CRUD
│       └── takvim.ts           # Günlük görev CRUD
│
├── lib/
│   ├── db.ts                   # Prisma client singleton (Neon adapter)
│   ├── auth.ts                 # requireUserId helper
│   ├── types.ts                # Paylaşılan TypeScript tipleri
│   ├── sinav-data.ts           # Sınav metadata (renk, icon, dersler)
│   ├── yks-categories.ts       # Konu listeleri (YKS/DGS/KPSS)
│   ├── utils.ts                # cn() utility
│   ├── utils/
│   │   ├── date.ts             # formatDateStr, hesaplaStreak, vb.
│   │   └── sinav.ts            # localStorage sınav tipi yönetimi
│   ├── constants/
│   │   └── ui.ts               # Ay/gün isimleri, UI sabitleri
│   └── config/
│       └── sinav-tarihleri.ts  # Sınav tarihleri + renk/mesaj hesabı
│
├── prisma/
│   └── schema.prisma           # Veritabanı şeması
│
└── public/
    ├── manifest.json           # PWA manifest
    ├── sw.js                   # Service worker
    └── icon/                   # Pixel-art ikonlar
```

### Veri Akışı

```
Kullanıcı etkileşimi
       │
       ▼
Client Component (useState, useEffect)
       │
       ▼ Server Action çağrısı
Server Action (server/actions/*.ts)
       │
       ├── requireUserId() → Clerk auth kontrolü
       │
       ▼
Prisma Client → Neon PostgreSQL
       │
       ▼
Sonuç → Client state güncellemesi
```

### Rendering Stratejisi

| Sayfa | Strateji | Neden |
|---|---|---|
| `/` (Ana sayfa) | `force-dynamic` SSR | Gerçek zamanlı streak/görev verisi |
| `/harita` | `force-dynamic` SSR | Kişisel konu verileri |
| `/istatistik` | `force-dynamic` SSR | Gerçek zamanlı metrikler |
| `/liderlik` | `force-dynamic` SSR | Anlık sıralama |
| `/basarimlar` | `force-dynamic` SSR | Kişisel başarım durumu |
| `/denemeler` | Client CSR | Form etkileşimi, dynamik liste |
| `/pomodoro` | Client CSR | Timer state |
| `/ayarlar` | Client CSR | localStorage + form |
| `/todo` | Client CSR | Çift panel, ağır etkileşim |

---

## 4. Sayfa Kataloğu

### `/` — Ana Sayfa (Köy Ekranı)
**Render:** Server (force-dynamic)

Kullanıcının günlük durumunu özetleyen kontrol paneli.
- Sınav geri sayım (SinavGeriSayim bileşeni)
- Bugün/hafta/ay görev istatistikleri (4'lü grid)
- Bugünün görevleri + ilerleme çubuğu
- Pomodoro / konu / deneme özet kartları
- Streak ve combo rozetleri (header action)
- Hızlı başlat menüsü
- Son 3 deneme listesi

**Veri kaynakları:** `bugunPomodorolariGetir`, `bugunGorevleriGetir`, `denemeleriGetir`, `derslerGetir`, `tamamlananGunleriGetir`, `getOzetIstatistik`

---

### `/yks` — Konu Haritası
**Render:** Server

Ders → konu ağacı. Sınav türüne göre (YKS/DGS/KPSS) konuların listelenmesi ve tamamlanma takibi.

---

### `/harita` — Dünya Haritası
**Render:** Server (force-dynamic)

Konuların görsel harita üzerinde gösterimi, bölge bazlı ilerleme.

---

### `/todo` — Görev & Konu Yönetimi
**Render:** Client

İki panelli arayüz:
- **Sol:** Konu listesi (SubjectPanel) — ders ekleme, konu ekleme/silme/tamamlama
- **Sağ:** Görev listesi (TaskPanel) — takvim görünümü, görev ekleme/silme/tamamlama

---

### `/pomodoro` — Pomodoro Timer
**Render:** Client

Game Boy estetikli 25/5 dakika Pomodoro timer.
- Çalışma / mola modu geçişi
- Oturum tamamlandığında otomatik kayıt
- Günlük oturum sayacı

---

### `/denemeler` — Deneme Kayıtları
**Render:** Client

- Deneme ekleme formu (TYT / AYT, ders bazlı D/Y/B girişi)
- Net trendi çizgi grafiği (son 10 deneme)
- Ders bazlı performans analizi (useMemo ile hesaplanır)
- Deneme silme

---

### `/istatistik` — İstatistikler
**Render:** Server (force-dynamic)

- Pomodoro: günlük / haftalık / aylık / yıllık sayı + dakika
- Görev: günlük / haftalık / aylık / yıllık toplam + tamamlanan
- 30 günlük pomodoro + görev çizgi grafiği
- Deneme özet istatistikleri
- Konu tamamlanma yüzdesi

---

### `/liderlik` — Liderlik Tablosu
**Render:** Server (force-dynamic)

- YKS / DGS / KPSS sekme geçişi
- Kullanıcının anlık sıralaması ve XP durumu
- İlk 20 oyuncu listesi (altın/gümüş/bronz ikonları)
- Tüm sınavlardaki sıralama özet kartları

---

### `/basarimlar` — Başarımlar
**Render:** Server (force-dynamic)

20+ başarım; streak, pomodoro, görev, konu, deneme kategorilerinde. Kazanılan/kazanılmayan rozet galerisi.

---

### `/hesaplama` — Net Hesaplama
**Render:** Client (Static)

Sınav türüne göre ders seçimi + D/Y/B girişi → net hesaplama aracı. Sunucu gerektirmez.

---

### `/program` — Haftalık Program
**Render:** Client

Pazartesi–Pazar ders programı oluşturma, saat bloğu bazlı görünüm.

---

### `/ayarlar` — Ayarlar
**Render:** Client

- Clerk UserButton (profil/çıkış)
- Sınav tipi seçimi (localStorage)
- Hedef üniversite/bölüm/net (localStorage)
- İstatistik ve başarım özet widget'ları
- Detaylı sayfalara hızlı erişim linkleri

---

## 5. Bileşen Kütüphanesi

### Layout Bileşenleri

#### `PageHeader`
```tsx
<PageHeader
  icon="⚔️"
  title="SAYFA BAŞLIĞI"
  subtitle="Alt başlık metni"
  action={<SomeBadge />}        // opsiyonel
/>
```
Koyu arka plan (#181838), sarı alt çizgi (#FFD000), sol accent bar. Tüm sayfalarda tutarlı başlık.

#### `PageContainer`
```tsx
<PageContainer>
  <PixelCard>...</PixelCard>
  <PixelCard>...</PixelCard>
</PageContainer>
```
`max-w-4xl` ile ortalanmış, `gap-3` flex sütun. Tüm içerik sayfalarını sarar.

#### `Navbar`
- **Desktop:** 256px sabit sol sidebar. Logo, UserLevelBadge, sınav modu badge, gruplu nav linkleri (Core / ARAÇLAR / SKOR), alt Ayarlar.
- **Mobile:** Sabit alt bar. 5 ikon: Köy, Harita, Görev, Pomodoro, Profil.

---

### Pixel UI Kit

#### `PixelCard`
```tsx
<PixelCard variant="wood" | "stone" | "gold" | "dark" | "green">
```
4px border, köşe aksan noktaları, `imageRendering: pixelated`.

| Variant | Arka Plan | Kullanım |
|---|---|---|
| `wood` | #F8F0DC | Varsayılan beyaz kart |
| `stone` | #D0D0E8 | Bilgi kartları |
| `gold` | #FFD000 | Vurgu kartları |
| `dark` | #181838 | Koyu tema kartları |
| `green` | #B8F0A0 | Başarı/tamamlama |

#### `PixelButton`
```tsx
<PixelButton variant="primary" | "secondary" | "danger" | "ghost" | "gold" size="sm" | "md" | "lg">
```
Active state'te 3px aşağı/sağa kayma animasyonu. Disabled state'te opacity-40.

| Variant | Renk | Kullanım |
|---|---|---|
| `primary` | #2878F8 (mavi) | Ana aksiyon |
| `secondary` | #E01828 (kırmızı) | İkincil aksiyon |
| `danger` | #E01828 (kırmızı) | Silme/tehlikeli |
| `ghost` | #F8F0DC (bej) | Nötr aksiyon |
| `gold` | #FFD000 (sarı) | Öne çıkan aksiyon |

#### `PixelBadge`
Küçük etiket bileşeni, tur/durum göstergesi için.

#### `PixelProgress`
HP bar tarzı ilerleme çubuğu. `hpLabel`, `showPercent`, `size` prop'ları.

#### `PixelLineChart`
SVG tabanlı minimal çizgi grafik. `data: { label, value }[]` alır.

---

### Feature Bileşenleri

#### `PomodoroTimer`
Game Boy estetikli timer. Çalışma/mola modu, oturum tamamlandığında `pomodoroKaydet` çağrısı.

#### `SinavGeriSayim`
LocalStorage'dan sınav tipini okur → `SINAV_TARIHLERI`'nden tarihi alır → gün sayısına göre renk + mesaj döner. SSR-safe (client bileşen).

#### `DenemeForm`
Dinamik ders satırı ekleme destekli form. Her satır: ders adı + D/Y/B alanları. Net otomatik hesaplanır.

#### `KonuCard`
Konu tamamlama toggle'ı, öncelik göstergesi, silme butonu.

#### `UserLevelBadge`
`getBasarimIstatistik` server action'ı çağırır. XP progress bar + seviye numarası + sınav badge'i.

#### `DailyLoginBonus`
Her session başında `dailyLoginKontrol` çağırır. XP bonus varsa toast ile bildirir.

#### `BasarimOzet` / `IstatistikOzet`
Ayarlar sayfasında kullanılan özet widget'ları. Kendi veri çekimini yapar.

---

## 6. Veritabanı Şeması

### Modeller

#### `UserAyarlar` — Kullanıcı profili
```
userId (unique)     String
sinavTipi           String    // "YKS" | "DGS" | "KPSS"
hedefUni            String?
hedefBolum          String?
hedefNet            Float?
yksXp / yksSeviye   Int
dgsXp / dgsSeviye   Int
kpssXp / kpssSeviye Int
xp / seviye         Int       // global (tüm sınavların toplamı)
sonGirisTarih       DateTime? // günlük giriş takibi için
```

#### `Ders` + `Konu` — Konu ağacı
```
Ders:  userId, ad, renk, icon
Konu:  userId, baslik, aciklama, tamamlandi, oncelik, dersId (FK → Ders)
```

#### `GunlukGorev` — Görev sistemi
```
userId, tarih, baslik, aciklama, oncelik (1/2/3), tamamlandi, renk
```

#### `PomodoroOturum` — Pomodoro kayıtları
```
userId, baslangic, bitis, sure (dk), tamamlandi, notlar, konuId?
```

#### `Deneme` + `DenemeDetay` — Deneme kayıtları
```
Deneme:     userId, tarih, tur (TYT|AYT), toplam, dogru, yanlis, bos, net
DenemeDetay: denemeId (FK), dersAdi, dogru, yanlis, bos, net
```

#### `Basarim` — Başarım sistemi
```
userId, tur, anahtar (unique per user), ad, aciklama, puan, kazanildi, kazanildiTarih
@@unique([userId, anahtar])
```

#### `HaftalikProgram` — Haftalık program
```
userId, gun (0=Pzt..6=Paz), ders, baslangic, bitis, aktif
```

#### `KonuNot` — Konu notları
```
userId, konuId, icerik, kaynakLink
@@unique([userId, konuId])
```

### İndeksler
Tüm modellerde `@@index([userId])` — kullanıcı bazlı sorgular için optimize edilmiş.

---

## 7. Server Actions

### `server/actions/basarim.ts`
| Fonksiyon | Açıklama |
|---|---|
| `getBasarimIstatistik()` | Kullanıcının XP, seviye, sınav tipi ve başarım özetini döner |
| `xpKazan(miktar, sinavTipi)` | Belirtilen sınav tipinde XP ekler, seviye hesaplar |
| `basarimiKazanKontrol()` | Streak, pomodoro, görev, konu, deneme başarımlarını kontrol eder |
| `dailyLoginKontrol()` | Günlük giriş bonusu (sonGirisTarih kontrolü, XP ekler) |
| `getBasarimlar()` | Kullanıcının tüm başarım listesi |

**Seviye formülü:** `Math.floor(xp / 100) + 1`

### `server/actions/istatistik.ts`
| Fonksiyon | Açıklama |
|---|---|
| `getOzetIstatistik()` | Ana sayfa için özet metrikler — 2 DB sorgusu |
| `getIstatistik()` | Tam istatistik sayfası için — 6 DB sorgusu |

**Optimizasyon:** `tumPomodoro` (yılbaşından bugüne) ve `tumGorev` tek sorguda çekilir; günlük/haftalık/aylık/yıllık filtreler memory'de yapılır.

### `server/actions/konular.ts`
| Fonksiyon | Açıklama |
|---|---|
| `derslerGetir()` | Kullanıcının tüm ders + konu listesi |
| `dersEkle(ad, renk, icon)` | Yeni ders oluşturur |
| `dersSil(id)` | Ders + alt konuları siler (cascade) |
| `konuEkle(dersId, baslik, ...)` | Konuya bağlı konu ekler |
| `konuSil(id)` | Konu siler |
| `konuTamamla(id, tamamlandi)` | Tamamlanma durumunu toggle eder, XP kazandırır |

### `server/actions/pomodoro.ts`
| Fonksiyon | Açıklama |
|---|---|
| `pomodoroKaydet(sure)` | Oturum kaydeder + XP ekler |
| `bugunPomodorolariGetir()` | Bugünün oturumlarını döner |

### `server/actions/takvim.ts`
| Fonksiyon | Açıklama |
|---|---|
| `gorevEkle(tarih, baslik, ...)` | Yeni görev oluşturur |
| `gorevSil(id)` | Görevi siler |
| `gorevTamamla(id, tamamlandi)` | Görevi toggle eder, XP kazandırır |
| `bugunGorevleriGetir()` | Bugünün görevlerini döner |
| `tamamlananGunleriGetir()` | Streak hesabı için tamamlanan gün listesi |

### `server/actions/denemeler.ts`
| Fonksiyon | Açıklama |
|---|---|
| `denemeleriGetir()` | Tüm denemeler (son 30, include: dersDetay) |
| `denemeEkle(data)` | Deneme + DenemeDetay kaydeder, XP ekler |
| `denemeSil(id)` | Deneme + detayları siler (cascade) |

---

## 8. Gamification Sistemi

### XP Kazanım Tablosu
| Aksiyon | XP |
|---|---|
| Pomodoro oturumu tamamlama | 10 XP |
| Görev tamamlama | 5 XP |
| Konu tamamlama | 15 XP |
| Deneme kaydetme | 20 XP |
| Günlük giriş bonusu | 5–50 XP (streak'e göre) |

### Seviye Sistemi
- Seviye = `floor(xp / 100) + 1`
- Her sınav tipi (YKS/DGS/KPSS) için ayrı XP ve seviye
- Global XP: tüm aksiyonların toplamı

### Başarım Kategorileri
| Kategori | Örnekler |
|---|---|
| `streak` | 3/7/14/30 gün streak |
| `pomodoro` | 10/50/100/500 oturum |
| `gorev` | 10/50/100 görev |
| `konu` | 10/50/100 konu |
| `deneme` | 5/20/50 deneme |

### Streak Algoritması (`lib/utils/date.ts`)
- Bugün veya dünden başlayarak geriye doğru ardışık günleri sayar
- En uzun streak ayrıca hesaplanır (best streak)
- `tamamlananGunleriGetir()` ile beslenir

---

## 9. Tasarım Sistemi

### Renk Paleti

| Token | Hex | Kullanım |
|---|---|---|
| **Sarı / Ana** | `#FFD000` | Aktif durum, XP, başlıklar |
| **Sarı Gölge** | `#504000` | Sarı elementlerin gölgesi |
| **Lacivert BG** | `#181838` | Sidebar, kartlar, dark bg |
| **Koyu BG** | `#101010` | En koyu zemin, borderlar |
| **Mor BG** | `#0E0E28` | Logo alanı |
| **Mavi** | `#2878F8` | Butonlar, linkler |
| **Yeşil** | `#18C840` | Tamamlanan, pozitif |
| **Kırmızı** | `#E01828` | Tehlike, yanlış, silme |
| **Turuncu** | `#F89000` | Orta öncelik |
| **Bej** | `#F8F0DC` | Kart arka planı |
| **Gri** | `#606878` | Pasif metin |
| **Mavi Gri** | `#8890B8` | Alt başlık, açıklama |

### Tipografi

| Kullanım | Font | Boyut |
|---|---|---|
| Sayfa başlıkları | Press Start 2P (`--font-pixel`) | 11px |
| Nav section label | Press Start 2P | 8px |
| Rozet / badge | Press Start 2P | 9–10px |
| Normal metin | VT323 (`--font-body`) | xl–2xl (18–24px) |
| Küçük metin | VT323 | sm–base (14–16px) |

> VT323 büyük point size'da okunabilir; Press Start 2P küçük tutulur çünkü bitmap font.

### Gölge & Border Stili
- Kartlar: `4px 4px 0 0 #101010` (sert piksel gölge)
- Butonlar: `3px 3px 0 0 #101010`
- Header: `0 4px 0 0 #504000`
- Tüm border'lar: `border-4` (4px solid)

### Animasyonlar
- `animate-pixel-blink`: ▶ ve ★ ikonları için yanıp sönme
- Buton active: `translate-x-[3px] translate-y-[3px]` (basma hissi)
- Navbar scale: aktif ikonda `scale-125`

---

## 10. PWA & Deployment

### PWA Yapılandırması

**`public/manifest.json`**
```json
{
  "name": "YKS Quest",
  "display": "standalone",
  "background_color": "#181838",
  "theme_color": "#181838",
  "orientation": "portrait-primary"
}
```

**`public/sw.js`** — Service worker (cache stratejisi)

**`components/PWAInit.tsx`** — `window.load` eventinde SW kaydeder

### Deployment

Proje **Vercel** üzerinde deploy edilmiştir (`.vercel/project.json` mevcut).

**Ortam Değişkenleri:**
```env
DATABASE_URL=          # Neon PostgreSQL bağlantı URL'i
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

**Build Komutu:**
```bash
prisma generate && next build
```

### Geliştirme Ortamı Kurulumu
```bash
npm install
cp .env.example .env        # ortam değişkenlerini doldur
npx prisma db push          # şemayı uygula
npm run dev
```

---

## 11. Roadmap

### Tamamlanan ✅
- [x] Temel sayfa yapısı ve navigasyon
- [x] Clerk kimlik doğrulama
- [x] Konu haritası (Ders + Konu CRUD)
- [x] Pomodoro timer ve kayıt
- [x] Günlük görev sistemi
- [x] Deneme kayıt ve analiz
- [x] XP / seviye / başarım sistemi
- [x] Günlük giriş bonusu
- [x] İstatistik sayfası (30 günlük grafik)
- [x] Liderlik tablosu (YKS/DGS/KPSS)
- [x] Net hesaplama aracı
- [x] Haftalık program
- [x] PWA desteği
- [x] Yeniden kullanılabilir PageHeader + PageContainer bileşenleri
- [x] Navbar tek kaynak (CORE_ITEMS, NavSinavMode sub-component)
- [x] istatistik.ts query optimizasyonu (13 → 6 DB sorgusu)

### Planlanan 🗓️
- [ ] Push notification desteği (pomodoro bitiş, streak hatırlatma)
- [ ] Konu notu ekleme (KonuNot modeli hazır, UI yok)
- [ ] Gerçek harita sayfası (bölge bazlı ilerleme görselleştirme)
- [ ] Arkadaş sistemi (liderlik tablosunda isim görünümü)
- [ ] Deneme analizi: zaman bazlı trend grafiği
- [ ] Program sayfası: DB entegrasyonu (şu an localStorage)
- [ ] Konu tekrar sistemi (spaced repetition önerisi)
- [ ] Dark mode toggle (şu an koyu sidebar, açık içerik)
- [ ] Bildirim sistemi (offline-first, SW push)
- [ ] Takvim görünümü geliştirme (aylık görünüm)

### Teknik Borç 🔧
- [ ] `viewport` metadata uyarıları giderilmeli (Next.js 16 `export const viewport` API'ine geçiş)
- [ ] `app/takvim/page.tsx` redirect'i temizlenmeli
- [ ] `server/actions/istatistik.ts` → `getOzetIstatistik` testler eklenmeli
- [ ] Liderlik tablosunda kullanıcı adı gösterimi (şu an "Oyuncu #N")
