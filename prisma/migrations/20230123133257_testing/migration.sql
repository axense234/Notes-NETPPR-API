/*
  Warnings:

  - You are about to drop the column `favoritedById` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_favoritedById_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "favoritedById",
ADD COLUMN     "folder_uid" TEXT;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Author" (
    "author_uid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BASIC',
    "category_uid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("author_uid")
);

-- CreateTable
CREATE TABLE "Folder" (
    "folder_uid" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "author_uid" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("folder_uid")
);

-- CreateTable
CREATE TABLE "_FAVORITED NOTES" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_FAVORITED NOTES_AB_unique" ON "_FAVORITED NOTES"("A", "B");

-- CreateIndex
CREATE INDEX "_FAVORITED NOTES_B_index" ON "_FAVORITED NOTES"("B");

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_category_uid_fkey" FOREIGN KEY ("category_uid") REFERENCES "Category"("category_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Author"("author_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_folder_uid_fkey" FOREIGN KEY ("folder_uid") REFERENCES "Folder"("folder_uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_author_uid_fkey" FOREIGN KEY ("author_uid") REFERENCES "Author"("author_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FAVORITED NOTES" ADD CONSTRAINT "_FAVORITED NOTES_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("author_uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FAVORITED NOTES" ADD CONSTRAINT "_FAVORITED NOTES_B_fkey" FOREIGN KEY ("B") REFERENCES "Note"("note_uid") ON DELETE CASCADE ON UPDATE CASCADE;
