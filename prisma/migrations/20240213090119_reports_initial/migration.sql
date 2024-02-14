-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "Reports" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "basis" TEXT NOT NULL,
    "localDue" TIMESTAMP(3) NOT NULL,
    "nationalDue" TIMESTAMP(3) NOT NULL,
    "frequency" "Frequency" NOT NULL,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedReports" (
    "id" BIGSERIAL NOT NULL,
    "reportId" BIGINT NOT NULL,
    "officeId" BIGINT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "localDue" TIMESTAMP(3) NOT NULL,
    "nationalDue" TIMESTAMP(3) NOT NULL,
    "files" TEXT,
    "status" "Status" NOT NULL,

    CONSTRAINT "SubmittedReports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubmittedReports" ADD CONSTRAINT "SubmittedReports_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedReports" ADD CONSTRAINT "SubmittedReports_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Offices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
