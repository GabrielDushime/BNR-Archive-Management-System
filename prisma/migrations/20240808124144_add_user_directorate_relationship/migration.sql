/*
  Warnings:

  - You are about to drop the `UserDirectorates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDirectorates" DROP CONSTRAINT "UserDirectorates_directorateId_fkey";

-- DropForeignKey
ALTER TABLE "UserDirectorates" DROP CONSTRAINT "UserDirectorates_userId_fkey";

-- DropTable
DROP TABLE "UserDirectorates";

-- CreateTable
CREATE TABLE "UserDirectorate" (
    "userId" TEXT NOT NULL,
    "directorateId" TEXT NOT NULL,

    CONSTRAINT "UserDirectorate_pkey" PRIMARY KEY ("userId","directorateId")
);

-- AddForeignKey
ALTER TABLE "UserDirectorate" ADD CONSTRAINT "UserDirectorate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDirectorate" ADD CONSTRAINT "UserDirectorate_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "directorates"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
