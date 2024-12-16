/*
  Warnings:

  - You are about to drop the column `docUpload` on the `departments` table. All the data in the column will be lost.
  - Added the required column `divisionName` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_directorateId_fkey";

-- AlterTable
ALTER TABLE "Documents" ADD COLUMN     "divisionId" TEXT,
ADD COLUMN     "divisionName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "departments" DROP COLUMN "docUpload";

-- CreateTable
CREATE TABLE "divisions" (
    "Id" TEXT NOT NULL,
    "divisionName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departmentId" TEXT,
    "departmentName" TEXT,

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "divisions_divisionName_key" ON "divisions"("divisionName");

-- AddForeignKey
ALTER TABLE "divisions" ADD CONSTRAINT "divisions_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
