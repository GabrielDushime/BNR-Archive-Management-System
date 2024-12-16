/*
  Warnings:

  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Directorate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserDirectorates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_directorateId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_directorateId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserDirectorates" DROP CONSTRAINT "_UserDirectorates_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserDirectorates" DROP CONSTRAINT "_UserDirectorates_B_fkey";

-- DropTable
DROP TABLE "Department";

-- DropTable
DROP TABLE "Directorate";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_UserDirectorates";

-- CreateTable
CREATE TABLE "Users" (
    "Id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "Role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "Id" TEXT NOT NULL,
    "docName" TEXT NOT NULL,
    "docDescription" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "directorateId" TEXT,
    "directorateName" TEXT,
    "departmentId" TEXT,
    "departmentName" TEXT,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("Id")
);

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

-- CreateTable
CREATE TABLE "UserDirectorates" (
    "userId" TEXT NOT NULL,
    "directorateId" TEXT NOT NULL,

    CONSTRAINT "UserDirectorates_pkey" PRIMARY KEY ("userId","directorateId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

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

-- AddForeignKey
ALTER TABLE "UserDirectorates" ADD CONSTRAINT "UserDirectorates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDirectorates" ADD CONSTRAINT "UserDirectorates_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "directorates"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
