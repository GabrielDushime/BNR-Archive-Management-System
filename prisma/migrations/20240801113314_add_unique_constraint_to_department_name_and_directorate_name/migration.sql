/*
  Warnings:

  - A unique constraint covering the columns `[departmentName]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[directorateName]` on the table `directorates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "departments_departmentName_key" ON "departments"("departmentName");

-- CreateIndex
CREATE UNIQUE INDEX "directorates_directorateName_key" ON "directorates"("directorateName");
