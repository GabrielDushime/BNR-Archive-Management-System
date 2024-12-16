/*
  Warnings:

  - You are about to drop the column `directorateName` on the `UserDirectorate` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `UserDirectorate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Documents" ADD COLUMN     "departmentName" TEXT,
ADD COLUMN     "directorateName" TEXT;

-- AlterTable
ALTER TABLE "UserDirectorate" DROP COLUMN "directorateName",
DROP COLUMN "userEmail",
ADD COLUMN     "directorateNames" TEXT[];

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "directorateNames" TEXT[];

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "directorateName" TEXT;
