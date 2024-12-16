/*
  Warnings:

  - You are about to drop the `_UserDirectorates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserDirectorates" DROP CONSTRAINT "_UserDirectorates_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserDirectorates" DROP CONSTRAINT "_UserDirectorates_B_fkey";

-- DropTable
DROP TABLE "_UserDirectorates";

-- CreateTable
CREATE TABLE "UserDirectorates" (
    "userId" TEXT NOT NULL,
    "directorateId" TEXT NOT NULL,

    CONSTRAINT "UserDirectorates_pkey" PRIMARY KEY ("userId","directorateId")
);

-- AddForeignKey
ALTER TABLE "UserDirectorates" ADD CONSTRAINT "UserDirectorates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDirectorates" ADD CONSTRAINT "UserDirectorates_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "directorates"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
