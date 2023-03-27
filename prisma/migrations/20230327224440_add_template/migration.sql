-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "JobStatus" ADD VALUE 'FINISHED_SUCCESS';
ALTER TYPE "JobStatus" ADD VALUE 'FINISHED_ERROR';

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "coverageUrl" TEXT,
ADD COLUMN     "logsUrl" TEXT,
ADD COLUMN     "templateId" TEXT,
ALTER COLUMN "instanceType" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "cmd" TEXT NOT NULL,
    "instanceType" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
