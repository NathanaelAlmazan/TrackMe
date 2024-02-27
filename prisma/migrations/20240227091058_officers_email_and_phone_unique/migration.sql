/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Officers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Officers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Officers_email_key" ON "Officers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Officers_phone_key" ON "Officers"("phone");
