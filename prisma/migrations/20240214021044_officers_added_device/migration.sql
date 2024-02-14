-- AlterTable
ALTER TABLE "Officers" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "device" TEXT;
