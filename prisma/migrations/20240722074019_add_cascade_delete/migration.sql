-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "cats"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
