/*
  Warnings:

  - A unique constraint covering the columns `[styleOptions_uid]` on the table `Note` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `styleOptions_uid` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "styleOptions_uid" TEXT NOT NULL,
ALTER COLUMN "authorName" DROP DEFAULT;

-- CreateTable
CREATE TABLE "StyleOptions" (
    "styleOptions_uid" TEXT NOT NULL,
    "note_uid" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL DEFAULT '#e0c9a6',
    "fontSize" TEXT NOT NULL DEFAULT '16px',
    "fontFamily" TEXT NOT NULL DEFAULT 'Poppins',
    "textColor" TEXT NOT NULL DEFAULT 'black',
    "titleColor" TEXT NOT NULL DEFAULT 'black',
    "titleFontSize" TEXT NOT NULL DEFAULT '16px',

    CONSTRAINT "StyleOptions_pkey" PRIMARY KEY ("styleOptions_uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Note_styleOptions_uid_key" ON "Note"("styleOptions_uid");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_styleOptions_uid_fkey" FOREIGN KEY ("styleOptions_uid") REFERENCES "StyleOptions"("styleOptions_uid") ON DELETE RESTRICT ON UPDATE CASCADE;
