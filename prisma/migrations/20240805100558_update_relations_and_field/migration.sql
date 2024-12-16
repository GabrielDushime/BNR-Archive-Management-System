/*
  Warnings:

  - You are about to drop the `departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `directorates` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `Documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userEmail` on table `Documents` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_directorateId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_userId_fkey";

-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_directorateId_fkey";

-- AlterTable
ALTER TABLE "Documents" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "userEmail" SET NOT NULL;

-- DropTable
DROP TABLE "departments";

-- DropTable
DROP TABLE "directorates";

-- CreateTable
CREATE TABLE "Departments" (
    "Id" TEXT NOT NULL,
    "departmentName" TEXT NOT NULL,
    "docUpload" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "directorateId" TEXT,

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Directorates" (
    "Id" TEXT NOT NULL,
    "directorateName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departmentId" TEXT,

    CONSTRAINT "Directorates_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Departments_departmentName_key" ON "Departments"("departmentName");

-- CreateIndex
CREATE UNIQUE INDEX "Directorates_directorateName_key" ON "Directorates"("directorateName");

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "Directorates"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departments" ADD CONSTRAINT "Departments_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "Directorates"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
