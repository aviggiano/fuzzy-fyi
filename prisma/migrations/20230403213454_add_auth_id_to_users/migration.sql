/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "authId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");
