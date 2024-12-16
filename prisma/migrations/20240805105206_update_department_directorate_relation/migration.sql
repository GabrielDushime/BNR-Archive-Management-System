/*
  Warnings:

  - You are about to drop the `Departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Directorates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Departments" DROP CONSTRAINT "Departments_directorateId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_directorateId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_userId_fkey";

-- DropTable
DROP TABLE "Departments";

-- DropTable
DROP TABLE "Directorates";

-- CreateTable
CREATE TABLE "directorates" (
    "Id" TEXT NOT NULL,
    "directorateName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "directorates_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "departments" (
    "Id" TEXT NOT NULL,
    "departmentName" TEXT NOT NULL,
    "docUpload" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "directorateId" TEXT,
    "directorateName" TEXT,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "directorates_directorateName_key" ON "directorates"("directorateName");

-- CreateIndex
CREATE UNIQUE INDEX "departments_departmentName_key" ON "departments"("departmentName");

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "directorates"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "directorates"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
