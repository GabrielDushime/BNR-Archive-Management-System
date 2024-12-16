/*
  Warnings:

  - You are about to drop the column `directorateName` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `departmentName` on the `directorates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "directorateName",
DROP COLUMN "userName";

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "directorateId" TEXT,
ADD COLUMN     "directorateName" TEXT;

-- AlterTable
ALTER TABLE "directorates" DROP COLUMN "departmentName";
