/*
  Warnings:

  - You are about to drop the `UserDirectorate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDirectorate" DROP CONSTRAINT "UserDirectorate_directorateId_fkey";

-- DropForeignKey
ALTER TABLE "UserDirectorate" DROP CONSTRAINT "UserDirectorate_userId_fkey";

-- DropTable
DROP TABLE "UserDirectorate";

-- CreateTable
CREATE TABLE "_UserDirectorates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserDirectorates_AB_unique" ON "_UserDirectorates"("A", "B");

-- CreateIndex
CREATE INDEX "_UserDirectorates_B_index" ON "_UserDirectorates"("B");

-- AddForeignKey
ALTER TABLE "_UserDirectorates" ADD CONSTRAINT "_UserDirectorates_A_fkey" FOREIGN KEY ("A") REFERENCES "Users"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDirectorates" ADD CONSTRAINT "_UserDirectorates_B_fkey" FOREIGN KEY ("B") REFERENCES "directorates"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
