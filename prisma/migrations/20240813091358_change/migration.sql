-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_typeId_fkey";

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "types"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
