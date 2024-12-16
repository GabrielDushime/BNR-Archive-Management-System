-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "directorateId" TEXT,
ADD COLUMN     "directorateName" TEXT;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "directorates"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
