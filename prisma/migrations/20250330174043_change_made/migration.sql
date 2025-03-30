/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wealthboxUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wealthboxUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "externalId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "wealthboxUserId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_externalId_key" ON "Organization"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_wealthboxUserId_key" ON "User"("wealthboxUserId");
