/*
  Warnings:

  - The primary key for the `Assigned` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Assigned" DROP CONSTRAINT "Assigned_pkey",
ADD CONSTRAINT "Assigned_pkey" PRIMARY KEY ("officerId", "documentId", "assignee");
