/*
  Warnings:

  - You are about to drop the `Documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDirectorates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `directorates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_directorateId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserDirectorates" DROP CONSTRAINT "UserDirectorates_directorateId_fkey";

-- DropForeignKey
ALTER TABLE "UserDirectorates" DROP CONSTRAINT "UserDirectorates_userId_fkey";

-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_directorateId_fkey";

-- DropTable
DROP TABLE "Documents";

-- DropTable
DROP TABLE "UserDirectorates";

-- DropTable
DROP TABLE "Users";

-- DropTable
DROP TABLE "departments";

-- DropTable
DROP TABLE "directorates";

-- CreateTable
CREATE TABLE "User" (
    "Id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "Role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Document" (
    "Id" TEXT NOT NULL,
    "docName" TEXT NOT NULL,
    "docDescription" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "directorateId" TEXT,
    "departmentId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Directorate" (
    "Id" TEXT NOT NULL,
    "directorateName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Directorate_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Department" (
    "Id" TEXT NOT NULL,
    "departmentName" TEXT NOT NULL,
    "docUpload" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "directorateId" TEXT,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "_UserDirectorates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Directorate_directorateName_key" ON "Directorate"("directorateName");

-- CreateIndex
CREATE UNIQUE INDEX "Department_departmentName_key" ON "Department"("departmentName");

-- CreateIndex
CREATE UNIQUE INDEX "_UserDirectorates_AB_unique" ON "_UserDirectorates"("A", "B");

-- CreateIndex
CREATE INDEX "_UserDirectorates_B_index" ON "_UserDirectorates"("B");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "Directorate"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "Directorate"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDirectorates" ADD CONSTRAINT "_UserDirectorates_A_fkey" FOREIGN KEY ("A") REFERENCES "Directorate"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDirectorates" ADD CONSTRAINT "_UserDirectorates_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
