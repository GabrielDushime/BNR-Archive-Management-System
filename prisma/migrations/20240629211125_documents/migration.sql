-- CreateTable
CREATE TABLE "Documents" (
    "Id" SERIAL NOT NULL,
    "docName" TEXT NOT NULL,
    "docDescription" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "cats"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
