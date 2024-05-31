/*
  Warnings:

  - You are about to drop the column `purposeId` on the `Documents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_purposeId_fkey";

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "purposeId",
ADD COLUMN     "purposeIds" VARCHAR(50) NOT NULL DEFAULT '4';
