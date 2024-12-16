-- AlterTable
ALTER TABLE "Documents" ADD COLUMN     "typeId" TEXT,
ADD COLUMN     "typeName" TEXT,
ALTER COLUMN "divisionName" DROP NOT NULL;
