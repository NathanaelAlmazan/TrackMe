/*
  Warnings:

  - Added the required column `message` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "message" TEXT NOT NULL;