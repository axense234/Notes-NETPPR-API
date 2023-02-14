import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

const AuthorClient = prismaClient.author;
const NoteClient = prismaClient.note;
const FolderClient = prismaClient.folder;
const CategoryClient = prismaClient.category;
const StyleOptionsClient = prismaClient.styleOptions;

const connectToPostgres = async () => {
  await prismaClient.$connect();
};

export {
  AuthorClient,
  NoteClient,
  CategoryClient,
  FolderClient,
  StyleOptionsClient,
  connectToPostgres,
};
