/*
  Warnings:

  - A unique constraint covering the columns `[referenceId]` on the table `Documents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referenceId` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Documents" ADD COLUMN     "referenceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Documents_referenceId_key" ON "Documents"("referenceId");
