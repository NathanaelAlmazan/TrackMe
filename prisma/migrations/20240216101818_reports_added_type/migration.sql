-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('HR', 'ADMIN');

-- AlterTable
ALTER TABLE "Reports" ADD COLUMN     "type" "ReportType" NOT NULL DEFAULT 'HR';
