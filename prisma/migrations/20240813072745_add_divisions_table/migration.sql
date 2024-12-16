-- CreateTable
CREATE TABLE "types" (
    "Id" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "docUpload" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "divisionId" TEXT,
    "divisionName" TEXT,

    CONSTRAINT "types_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "types_typeName_key" ON "types"("typeName");

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "directorates"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "divisions"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_typeId_fkey" FOREIGN KEY ("divisionId") REFERENCES "types"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "types" ADD CONSTRAINT "types_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "divisions"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
