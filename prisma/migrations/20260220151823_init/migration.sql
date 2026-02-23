-- CreateEnum
CREATE TYPE "DenemeType" AS ENUM ('TYT', 'AYT');

-- CreateTable
CREATE TABLE "Ders" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "renk" TEXT NOT NULL DEFAULT '#7EC850',
    "icon" TEXT NOT NULL DEFAULT '📐',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Konu" (
    "id" TEXT NOT NULL,
    "baslik" TEXT NOT NULL,
    "aciklama" TEXT,
    "tamamlandi" BOOLEAN NOT NULL DEFAULT false,
    "oncelik" INTEGER NOT NULL DEFAULT 1,
    "dersId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Konu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PomodoroOturum" (
    "id" TEXT NOT NULL,
    "baslangic" TIMESTAMP(3) NOT NULL,
    "bitis" TIMESTAMP(3),
    "sure" INTEGER NOT NULL,
    "tamamlandi" BOOLEAN NOT NULL DEFAULT false,
    "notlar" TEXT,
    "konuId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PomodoroOturum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deneme" (
    "id" TEXT NOT NULL,
    "tarih" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tur" "DenemeType" NOT NULL,
    "toplam" INTEGER NOT NULL,
    "dogru" INTEGER NOT NULL,
    "yanlis" INTEGER NOT NULL,
    "bos" INTEGER NOT NULL,
    "net" DOUBLE PRECISION NOT NULL,
    "notlar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deneme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DenemeDetay" (
    "id" TEXT NOT NULL,
    "denemeId" TEXT NOT NULL,
    "dersAdi" TEXT NOT NULL,
    "dogru" INTEGER NOT NULL,
    "yanlis" INTEGER NOT NULL,
    "bos" INTEGER NOT NULL,
    "net" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DenemeDetay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GunlukGorev" (
    "id" TEXT NOT NULL,
    "tarih" TIMESTAMP(3) NOT NULL,
    "baslik" TEXT NOT NULL,
    "aciklama" TEXT,
    "tamamlandi" BOOLEAN NOT NULL DEFAULT false,
    "renk" TEXT NOT NULL DEFAULT '#F5A623',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GunlukGorev_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Konu" ADD CONSTRAINT "Konu_dersId_fkey" FOREIGN KEY ("dersId") REFERENCES "Ders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DenemeDetay" ADD CONSTRAINT "DenemeDetay_denemeId_fkey" FOREIGN KEY ("denemeId") REFERENCES "Deneme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
