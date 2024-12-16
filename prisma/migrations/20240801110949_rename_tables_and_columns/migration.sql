/*
  Warnings:

  - You are about to drop the column `directoryId` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `directoryName` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the `directories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_directoryId_fkey";

-- DropForeignKey
ALTER TABLE "directories" DROP CONSTRAINT "directories_departmentId_fkey";

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "directoryId",
DROP COLUMN "directoryName",
ADD COLUMN     "directorateId" TEXT,
ADD COLUMN     "directorateName" TEXT;

-- DropTable
DROP TABLE "directories";

-- CreateTable
CREATE TABLE "directorates" (
    "Id" TEXT NOT NULL,
    "directorateName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departmentName" TEXT,
    "departmentId" TEXT,

    CONSTRAINT "directorates_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "directorates"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directorates" ADD CONSTRAINT "directorates_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
