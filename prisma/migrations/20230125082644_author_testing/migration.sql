-- DropForeignKey
ALTER TABLE "Author" DROP CONSTRAINT "Author_category_uid_fkey";

-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "category_uid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_category_uid_fkey" FOREIGN KEY ("category_uid") REFERENCES "Category"("category_uid") ON DELETE SET NULL ON UPDATE CASCADE;
