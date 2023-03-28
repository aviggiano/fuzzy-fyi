/*
  Warnings:

  - You are about to drop the column `ref` on the `Template` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "JobStatus" ADD VALUE 'STOPPED';

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "ref";
