/*
  Warnings:

  - Added the required column `senderId` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "senderId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Officers"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
