/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the `cats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_categoryId_fkey";

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "categoryId",
ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "directoryId" TEXT,
ADD COLUMN     "directoryName" TEXT,
ADD COLUMN     "userName" TEXT;

-- DropTable
DROP TABLE "cats";

-- CreateTable
CREATE TABLE "directories" (
    "Id" TEXT NOT NULL,
    "directoryName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departmentName" TEXT NOT NULL,
    "departmentId" TEXT,

    CONSTRAINT "directories_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "departments" (
    "Id" TEXT NOT NULL,
    "departmentName" TEXT NOT NULL,
    "docUpload" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "directories"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directories" ADD CONSTRAINT "directories_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
