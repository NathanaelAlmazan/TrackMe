/*
  Warnings:

  - You are about to drop the column `section` on the `Officers` table. All the data in the column will be lost.
  - You are about to drop the column `sections` on the `Offices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Officers" DROP COLUMN "section";

-- AlterTable
ALTER TABLE "Offices" DROP COLUMN "sections";
