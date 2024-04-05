/*
  Warnings:

  - You are about to drop the column `dateCreated` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `files` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Comments` table. All the data in the column will be lost.
  - The primary key for the `Referrals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignedId` on the `Referrals` table. All the data in the column will be lost.
  - You are about to drop the `AuditTrail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `recipient` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Assignment" AS ENUM ('APPROVER', 'MEMBER');

-- DropForeignKey
ALTER TABLE "AuditTrail" DROP CONSTRAINT "AuditTrail_documentId_fkey";

-- DropForeignKey
ALTER TABLE "AuditTrail" DROP CONSTRAINT "AuditTrail_officerId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Referrals" DROP CONSTRAINT "Referrals_assignedId_fkey";

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "dateCreated",
DROP COLUMN "files",
DROP COLUMN "level",
DROP COLUMN "message",
DROP COLUMN "senderId",
ADD COLUMN     "recipient" UUID NOT NULL,
ADD COLUMN     "sender" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Referrals" DROP CONSTRAINT "Referrals_pkey",
DROP COLUMN "assignedId",
ADD CONSTRAINT "Referrals_pkey" PRIMARY KEY ("officeId", "documentId");

-- DropTable
DROP TABLE "AuditTrail";

-- CreateTable
CREATE TABLE "Assigned" (
    "officerId" UUID NOT NULL,
    "documentId" VARCHAR(50) NOT NULL,
    "assignment" "Assignment" NOT NULL,

    CONSTRAINT "Assigned_pkey" PRIMARY KEY ("officerId","documentId")
);

-- AddForeignKey
ALTER TABLE "Assigned" ADD CONSTRAINT "Assigned_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officers"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned" ADD CONSTRAINT "Assigned_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Documents"("referenceNum") ON DELETE CASCADE ON UPDATE CASCADE;
