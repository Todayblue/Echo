/*
  Warnings:

  - Made the column `title` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coverImage` on table `Blog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "coverImage" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;
