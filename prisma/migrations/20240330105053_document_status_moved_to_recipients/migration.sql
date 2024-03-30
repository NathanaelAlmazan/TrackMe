/*
  Warnings:

  - You are about to drop the column `statusId` on the `Documents` table. All the data in the column will be lost.
  - Added the required column `level` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_statusId_fkey";

-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "level" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "statusId";

-- AlterTable
ALTER TABLE "Referrals" ADD COLUMN     "assignedId" UUID,
ADD COLUMN     "statusId" BIGINT;

-- AddForeignKey
ALTER TABLE "Referrals" ADD CONSTRAINT "Referrals_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "DocumentStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referrals" ADD CONSTRAINT "Referrals_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "Officers"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
