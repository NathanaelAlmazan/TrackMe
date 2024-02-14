-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CHIEF', 'DIRECTOR', 'SUPERUSER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'ONGOING', 'FINISHED', 'NOT_ACTIONABLE');

-- CreateTable
CREATE TABLE "Offices" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "sections" TEXT NOT NULL,

    CONSTRAINT "Offices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Positions" (
    "id" BIGSERIAL NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Officers" (
    "uuid" UUID NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "positionId" BIGINT,
    "officeId" BIGINT,
    "section" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "signature" TEXT,

    CONSTRAINT "Officers_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "DocumentStatus" (
    "id" BIGSERIAL NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "category" "Status" NOT NULL,

    CONSTRAINT "DocumentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentTypes" (
    "id" BIGSERIAL NOT NULL,
    "label" VARCHAR(100) NOT NULL,

    CONSTRAINT "DocumentTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentPurpose" (
    "id" BIGSERIAL NOT NULL,
    "label" VARCHAR(100) NOT NULL,

    CONSTRAINT "DocumentPurpose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "referenceNum" VARCHAR(50) NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "receivedFrom" VARCHAR(100) NOT NULL,
    "typeId" BIGINT,
    "purposeId" BIGINT,
    "statusId" BIGINT,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateDue" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("referenceNum")
);

-- CreateTable
CREATE TABLE "Referrals" (
    "documentId" VARCHAR(50) NOT NULL,
    "officeId" BIGINT NOT NULL,

    CONSTRAINT "Referrals_pkey" PRIMARY KEY ("documentId","officeId")
);

-- CreateTable
CREATE TABLE "AuditTrail" (
    "id" BIGSERIAL NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "officerId" UUID NOT NULL,
    "documentId" VARCHAR(50) NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditTrail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" BIGSERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "files" TEXT NOT NULL,
    "documentId" VARCHAR(50) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Officers" ADD CONSTRAINT "Officers_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Officers" ADD CONSTRAINT "Officers_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Offices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "DocumentTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "DocumentPurpose"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "DocumentStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referrals" ADD CONSTRAINT "Referrals_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Documents"("referenceNum") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referrals" ADD CONSTRAINT "Referrals_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Offices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditTrail" ADD CONSTRAINT "AuditTrail_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officers"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditTrail" ADD CONSTRAINT "AuditTrail_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Documents"("referenceNum") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Documents"("referenceNum") ON DELETE CASCADE ON UPDATE CASCADE;
