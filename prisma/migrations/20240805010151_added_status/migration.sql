-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'FOR_APPROVAL';
ALTER TYPE "Status" ADD VALUE 'FOR_REVIEW';
ALTER TYPE "Status" ADD VALUE 'FOR_CORRECTION';
ALTER TYPE "Status" ADD VALUE 'FOR_REVISION';
ALTER TYPE "Status" ADD VALUE 'UPDATE_REPORT';
