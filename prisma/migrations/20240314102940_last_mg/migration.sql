/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3);

-- DropTable
DROP TABLE "Profile";
