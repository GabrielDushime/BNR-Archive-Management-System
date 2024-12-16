/*
  Warnings:

  - You are about to drop the column `departmentName` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `directorateName` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `directorateName` on the `departments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDirectorate" DROP CONSTRAINT "UserDirectorate_directorateId_fkey";

-- DropForeignKey
ALTER TABLE "UserDirectorate" DROP CONSTRAINT "UserDirectorate_userId_fkey";

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "departmentName",
DROP COLUMN "directorateName";

-- AlterTable
ALTER TABLE "departments" DROP COLUMN "directorateName";

-- AddForeignKey
ALTER TABLE "UserDirectorate" ADD CONSTRAINT "UserDirectorate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDirectorate" ADD CONSTRAINT "UserDirectorate_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "directorates"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
