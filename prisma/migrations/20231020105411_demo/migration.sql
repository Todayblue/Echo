-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "slug" TEXT,
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SubCommunity" ADD COLUMN     "slug" TEXT;
