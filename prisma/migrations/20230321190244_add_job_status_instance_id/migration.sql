/*
  Warnings:

  - Added the required column `instanceId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PROVISIONED', 'STARTED', 'RUNNING', 'FINISHED', 'DEPROVISIONED');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "instanceId" TEXT NOT NULL,
ADD COLUMN     "status" "JobStatus" NOT NULL;
