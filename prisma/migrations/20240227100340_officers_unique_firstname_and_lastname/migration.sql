/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName]` on the table `Officers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Officers_firstName_lastName_key" ON "Officers"("firstName", "lastName");
