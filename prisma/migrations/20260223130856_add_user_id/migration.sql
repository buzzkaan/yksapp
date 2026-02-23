/*
  Warnings:

  - Added the required column `userId` to the `Deneme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Ders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `GunlukGorev` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Konu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PomodoroOturum` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deneme" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ders" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "renk" SET DEFAULT '#18C018';

-- AlterTable
ALTER TABLE "GunlukGorev" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Konu" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PomodoroOturum" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Deneme_userId_idx" ON "Deneme"("userId");

-- CreateIndex
CREATE INDEX "Ders_userId_idx" ON "Ders"("userId");

-- CreateIndex
CREATE INDEX "GunlukGorev_userId_idx" ON "GunlukGorev"("userId");

-- CreateIndex
CREATE INDEX "Konu_userId_idx" ON "Konu"("userId");

-- CreateIndex
CREATE INDEX "PomodoroOturum_userId_idx" ON "PomodoroOturum"("userId");
