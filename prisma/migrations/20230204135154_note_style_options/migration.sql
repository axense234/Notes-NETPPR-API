-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_styleOptions_uid_fkey";

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "styleOptions_uid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_styleOptions_uid_fkey" FOREIGN KEY ("styleOptions_uid") REFERENCES "StyleOptions"("styleOptions_uid") ON DELETE SET NULL ON UPDATE CASCADE;
