/*
  Warnings:

  - The values [NOT_STARTED,ONGOING] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('REFERRED', 'ASSIGNED', 'PROCESSED', 'SUBMITTED', 'FINISHED', 'NOT_ACTIONABLE');
ALTER TABLE "DocumentStatus" ALTER COLUMN "category" TYPE "Status_new" USING ("category"::text::"Status_new");
ALTER TABLE "SubmittedReports" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;
