/*
  Warnings:

  - You are about to drop the column `directorateId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `directorateName` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_directorateId_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "directorateId",
DROP COLUMN "directorateName";

-- CreateTable
CREATE TABLE "UserDirectorate" (
    "userId" TEXT NOT NULL,
    "directorateId" TEXT NOT NULL,
    "directorateName" TEXT NOT NULL,

    CONSTRAINT "UserDirectorate_pkey" PRIMARY KEY ("userId","directorateId")
);

-- AddForeignKey
ALTER TABLE "UserDirectorate" ADD CONSTRAINT "UserDirectorate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDirectorate" ADD CONSTRAINT "UserDirectorate_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "directorates"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
