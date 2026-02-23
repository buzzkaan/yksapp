export type SinavTipi = "YKS" | "DGS" | "KPSS";

export const LS_SINAV_KEY = "yks_farm_sinav_v1";

export interface DersBilgi {
  key: string;
  isim: string;
  icon: string;
  renk: string;
  konular: string[];
}

export interface SinavBolum {
  key: string;
  isim: string;
  aciklama: string;
  renk: string;
  icon: string;
  dersler: DersBilgi[];
}

export interface SinavMeta {
  tip: SinavTipi;
  isim: string;
  tamIsim: string;
  icon: string;
  renk: string;
  aciklama: string;
}

export const SINAV_META: Record<SinavTipi, SinavMeta> = {
  YKS: {
    tip: "YKS",
    isim: "YKS",
    tamIsim: "Yükseköğretim Kurumları Sınavı",
    icon: "/icon/flag.png",
    renk: "#3498DB",
    aciklama: "TYT + AYT · Üniversite giriş sınavı",
  },
  DGS: {
    tip: "DGS",
    isim: "DGS",
    tamIsim: "Dikey Geçiş Sınavı",
    icon: "/icon/degree.png",
    renk: "#27AE60",
    aciklama: "Sayısal + Sözel · Önlisanstan lisansa geçiş",
  },
  KPSS: {
    tip: "KPSS",
    isim: "KPSS",
    tamIsim: "Kamu Personeli Seçme Sınavı",
    icon: "/icon/party-card.png",
    renk: "#8E44AD",
    aciklama: "GY + GK · Kamu kurumu personel sınavı",
  },
};

// ─── DGS Bölümleri ────────────────────────────────────────────────────────────
export const DGS_BOLUMLER: SinavBolum[] = [
  {
    key: "sayisal",
    isim: "Sayısal Bölüm",
    aciklama: "Matematik ve geometri ağırlıklı",
    renk: "#3498DB",
    icon: "🔢",
    dersler: [
      {
        key: "temel_mat_dgs",
        isim: "Temel Matematik",
        icon: "🧮",
        renk: "#3498DB",
        konular: [
          "Sayılar ve Sayı Sistemleri",
          "Doğal Sayılar",
          "Tam Sayılar",
          "Rasyonel Sayılar",
          "Gerçek Sayılar",
          "Üslü Sayılar",
          "Köklü Sayılar",
          "Temel Cebir ve Denklemler",
          "Eşitsizlikler",
          "Mutlak Değer",
          "Oran ve Orantı",
          "Yüzde ve Faiz Hesapları",
          "Kar-Zarar ve İskonto",
          "Yaş Problemleri",
          "İşçi ve İş Problemleri",
          "Hız-Zaman-Mesafe Problemleri",
          "Karışım Problemleri",
          "Kümeler",
          "Mantık",
          "İkinci Derece Denklemler",
          "Fonksiyonlar",
          "Logaritma",
          "Permütasyon ve Kombinasyon",
          "Olasılık",
          "İstatistik ve Veri Analizi",
          "Diziler (Aritmetik, Geometrik)",
        ],
      },
      {
        key: "geometri_dgs",
        isim: "Geometri",
        icon: "📐",
        renk: "#1A5276",
        konular: [
          "Temel Geometri Kavramları",
          "Açılar ve Açı Türleri",
          "Üçgenler ve Özellikleri",
          "Üçgenlerde Alan ve Çevre",
          "Özel Üçgenler",
          "Dörtgenler",
          "Çokgenler",
          "Çember ve Daire",
          "Çemberde Açılar",
          "Analitik Geometri – Nokta ve Doğru",
          "Analitik Geometri – Çember",
          "Katı Cisimler (Prizma, Piramit, Küre, Koni, Silindir)",
          "Dönüşüm Geometrisi",
        ],
      },
    ],
  },
  {
    key: "sozel",
    isim: "Sözel Bölüm",
    aciklama: "Türkçe dil bilgisi ve anlama",
    renk: "#E74C3C",
    icon: "📖",
    dersler: [
      {
        key: "turkce_dgs",
        isim: "Türkçe",
        icon: "📝",
        renk: "#E74C3C",
        konular: [
          "Sözcükte Anlam (Eş, Zıt, Çok Anlamlılık)",
          "Deyimler ve Atasözleri",
          "Cümlede Anlam",
          "Paragraf ve Ana Düşünce",
          "Parçadan Anlam Çıkarma",
          "Paragraf Tamamlama",
          "Ses Bilgisi",
          "Hece Bilgisi",
          "Yazım Kuralları",
          "Noktalama İşaretleri",
          "Sözcük Türleri (İsim, Sıfat, Zarf, Zamir)",
          "Fiil Kipleri ve Çekimleri",
          "Fiilimsiler (İsim-fiil, Sıfat-fiil, Zarf-fiil)",
          "Cümlenin Ögeleri",
          "Cümle Türleri",
          "Anlatım Bozuklukları",
        ],
      },
    ],
  },
];

// ─── KPSS Bölümleri ───────────────────────────────────────────────────────────
export const KPSS_BOLUMLER: SinavBolum[] = [
  {
    key: "gy_turkce",
    isim: "Genel Yetenek — Türkçe",
    aciklama: "Dil bilgisi, anlama ve anlatım",
    renk: "#E74C3C",
    icon: "📝",
    dersler: [
      {
        key: "turkce_kpss",
        isim: "Türkçe",
        icon: "📝",
        renk: "#E74C3C",
        konular: [
          "Sözcükte Anlam (Eş Anlam, Zıt Anlam, Çok Anlam)",
          "Deyimler ve Atasözleri",
          "Cümlede Anlam",
          "Paragraf Tamamlama",
          "Ana Düşünce ve Yardımcı Düşünce",
          "Metnin Başlığı ve Konusu",
          "Ses Bilgisi",
          "Yazım Kuralları",
          "Noktalama İşaretleri",
          "İsim ve İsim Çekim Ekleri",
          "Sıfatlar",
          "Zamirler",
          "Zarflar",
          "Edatlar, Bağlaçlar, Ünlemler",
          "Fiil Kipleri ve Çekimleri",
          "Fiilimsiler (İsim-fiil, Sıfat-fiil, Zarf-fiil)",
          "Cümlenin Ögeleri",
          "Cümle Türleri",
          "Anlatım Bozuklukları",
          "Sözcük Türetme",
        ],
      },
    ],
  },
  {
    key: "gy_mat",
    isim: "Genel Yetenek — Matematik",
    aciklama: "Temel matematik ve problem çözme",
    renk: "#3498DB",
    icon: "🧮",
    dersler: [
      {
        key: "mat_kpss",
        isim: "Matematik",
        icon: "🧮",
        renk: "#3498DB",
        konular: [
          "Temel Kavramlar ve Sayı Sistemleri",
          "Bölünebilme Kuralları",
          "EBOB ve EKOK",
          "Kesirler",
          "Ondalık Sayılar",
          "Üslü Sayılar",
          "Köklü Sayılar",
          "Oran ve Orantı",
          "Yüzde Hesapları",
          "Kar-Zarar ve İskonto",
          "Faiz Hesapları",
          "Yaş Problemleri",
          "İşçi ve İş Problemleri",
          "Hız-Zaman-Mesafe Problemleri",
          "Karışım Problemleri",
          "Kümeler",
          "Mantık",
          "Sayma (Permütasyon, Kombinasyon)",
          "Olasılık",
          "İstatistik (Ortalama, Mod, Medyan)",
          "Temel Geometri (Alan ve Çevre)",
        ],
      },
    ],
  },
  {
    key: "gk_tarih",
    isim: "Genel Kültür — Tarih",
    aciklama: "Türk ve dünya tarihi",
    renk: "#8B5E3C",
    icon: "🏛️",
    dersler: [
      {
        key: "tarih_kpss",
        isim: "Tarih",
        icon: "🏛️",
        renk: "#8B5E3C",
        konular: [
          "Tarih Öncesi Devirler",
          "İlk Medeniyetler (Mezopotamya, Mısır, Anadolu)",
          "İlk Türk Devletleri (Hunlar, Göktürkler, Uygurlar)",
          "İslam Tarihi ve Medeniyeti",
          "Türk-İslam Devletleri (Karahanlılar, Gazneliler, Selçuklular)",
          "Osmanlı Devleti Kuruluş ve Yükseliş",
          "Osmanlı Devleti Duraklama ve Gerileme",
          "Osmanlı'da Islahat Hareketleri",
          "Osmanlı'nın Çöküş Dönemi",
          "Birinci Dünya Savaşı",
          "Milli Mücadele Dönemi",
          "Cumhuriyetin İlanı (1923)",
          "Türkiye Cumhuriyeti Kuruluş Dönemi",
          "Tek Parti Dönemi",
          "Çok Partili Hayata Geçiş",
          "1950-1980 Türkiye Tarihi",
          "1980 Sonrası Türkiye",
          "Dünya Tarihi (Fransız Devrimi, Sanayi Devrimi)",
          "Soğuk Savaş Dönemi",
        ],
      },
    ],
  },
  {
    key: "gk_cografya",
    isim: "Genel Kültür — Coğrafya",
    aciklama: "Türkiye ve dünya coğrafyası",
    renk: "#1ABC9C",
    icon: "🌍",
    dersler: [
      {
        key: "cografya_kpss",
        isim: "Coğrafya",
        icon: "🌍",
        renk: "#1ABC9C",
        konular: [
          "Harita Bilgisi ve Coğrafi Koordinatlar",
          "Türkiye'nin Fiziki Yapısı (Dağlar, Ovalar, Akarsular)",
          "Türkiye'nin İklimi",
          "Türkiye'nin Bitki Örtüsü ve Toprak Yapısı",
          "Türkiye Nüfusu (Dağılış, Göç, Yapı)",
          "Türkiye'de Yerleşme",
          "Türkiye Tarımı",
          "Türkiye Hayvancılığı",
          "Türkiye Madencilik ve Enerji",
          "Türkiye Sanayii",
          "Türkiye Ulaşım ve Turizm",
          "Bölgeler Coğrafyası",
          "Dünya Coğrafyası (Genel)",
          "Kıtalar ve Okyanuslar",
          "Çevre Sorunları ve Sürdürülebilirlik",
        ],
      },
    ],
  },
  {
    key: "gk_vatandaslik",
    isim: "Genel Kültür — Vatandaşlık",
    aciklama: "Anayasa, hukuk ve devlet yapısı",
    renk: "#F39C12",
    icon: "⚖️",
    dersler: [
      {
        key: "vatandaslik_kpss",
        isim: "Vatandaşlık ve Anayasa",
        icon: "⚖️",
        renk: "#F39C12",
        konular: [
          "Devlet ve Hukuk Kavramları",
          "Türkiye Cumhuriyeti Anayasası (1982)",
          "Anayasanın Temel İlkeleri",
          "Temel Hak ve Özgürlükler",
          "Özgürlüklerin Sınırlandırılması",
          "Yasama Organı (TBMM)",
          "Yürütme Organı (Cumhurbaşkanlığı)",
          "Yargı Organı",
          "Anayasa Mahkemesi",
          "Seçim Sistemi ve Siyasi Partiler",
          "Mahalli İdareler (İl, İlçe, Belediye)",
          "Kamu Yönetiminin Yapısı",
          "İdare Hukuku Temelleri",
          "Türkiye'nin Dış İlişkileri",
          "AB ve Türkiye",
          "Uluslararası Kuruluşlar (BM, NATO, IMF)",
        ],
      },
    ],
  },
  {
    key: "gk_inkilap",
    isim: "Genel Kültür — İnkılap Tarihi",
    aciklama: "Atatürk ilkeleri ve Türk inkılabı",
    renk: "#C0392B",
    icon: "🇹🇷",
    dersler: [
      {
        key: "inkilap_kpss",
        isim: "Atatürk İlkeleri ve İnkılap Tarihi",
        icon: "🇹🇷",
        renk: "#C0392B",
        konular: [
          "Osmanlı'nın Son Dönemi ve Çöküş Nedenleri",
          "Mondros Ateşkes Antlaşması",
          "İşgaller ve Direniş Hareketleri",
          "Mustafa Kemal'in Anadolu'ya Geçişi",
          "Kongreler (Erzurum, Sivas)",
          "Misak-ı Millî",
          "TBMM'nin Açılması",
          "Kurtuluş Savaşı Cepheleri",
          "Lozan Barış Antlaşması",
          "Cumhuriyetin İlanı",
          "Halifeliğin Kaldırılması",
          "Hukuk Alanındaki İnkılaplar (Medeni Kanun)",
          "Eğitim Alanındaki İnkılaplar (Tevhid-i Tedrisat)",
          "Ekonomik İnkılaplar (İzmir İktisat Kongresi)",
          "Sosyal ve Kültürel İnkılaplar",
          "Atatürk İlkeleri (Cumhuriyetçilik, Milliyetçilik, Halkçılık)",
          "Atatürk İlkeleri (Devletçilik, Laiklik, Devrimcilik)",
          "Atatürkçü Düşünce Sistemi",
          "Atatürk Dönemi Türk Dış Politikası",
        ],
      },
    ],
  },
];
