/*
  Warnings:

  - The primary key for the `Documents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cats` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_userId_fkey";

-- AlterTable
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_pkey",
ALTER COLUMN "Id" DROP DEFAULT,
ALTER COLUMN "Id" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Documents_pkey" PRIMARY KEY ("Id");
DROP SEQUENCE "Documents_Id_seq";

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
ALTER COLUMN "Id" DROP DEFAULT,
ALTER COLUMN "Id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("Id");
DROP SEQUENCE "Users_Id_seq";

-- AlterTable
ALTER TABLE "cats" DROP CONSTRAINT "cats_pkey",
ALTER COLUMN "Id" DROP DEFAULT,
ALTER COLUMN "Id" SET DATA TYPE TEXT,
ADD CONSTRAINT "cats_pkey" PRIMARY KEY ("Id");
DROP SEQUENCE "cats_Id_seq";

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "cats"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
