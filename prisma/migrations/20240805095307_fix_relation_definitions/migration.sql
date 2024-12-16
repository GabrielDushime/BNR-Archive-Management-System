/*
  Warnings:

  - You are about to drop the column `directorateName` on the `departments` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `directorates` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "directorates" DROP CONSTRAINT "directorates_departmentId_fkey";

-- AlterTable
ALTER TABLE "Documents" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "userEmail" DROP NOT NULL;

-- AlterTable
ALTER TABLE "departments" DROP COLUMN "directorateName";

-- AlterTable
ALTER TABLE "directorates" DROP COLUMN "departmentId";

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "directorates"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
