-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC', 'AUTHOR', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "user_uid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BASIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_uid")
);

-- CreateTable
CREATE TABLE "Note" (
    "note_uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "favoritedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("note_uid")
);

-- CreateTable
CREATE TABLE "Category" (
    "category_uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_uid")
);

-- CreateTable
CREATE TABLE "_CategoryToNote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToNote_AB_unique" ON "_CategoryToNote"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToNote_B_index" ON "_CategoryToNote"("B");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("user_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_favoritedById_fkey" FOREIGN KEY ("favoritedById") REFERENCES "User"("user_uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToNote" ADD CONSTRAINT "_CategoryToNote_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("category_uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToNote" ADD CONSTRAINT "_CategoryToNote_B_fkey" FOREIGN KEY ("B") REFERENCES "Note"("note_uid") ON DELETE CASCADE ON UPDATE CASCADE;
