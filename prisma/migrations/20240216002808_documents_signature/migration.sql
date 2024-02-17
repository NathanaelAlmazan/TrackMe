-- AlterEnum
ALTER TYPE "Frequency" ADD VALUE 'QUARTERLY';

-- AlterTable
ALTER TABLE "Documents" ADD COLUMN     "signatureId" UUID;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_signatureId_fkey" FOREIGN KEY ("signatureId") REFERENCES "Officers"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
