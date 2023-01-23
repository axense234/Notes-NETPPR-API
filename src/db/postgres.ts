import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

const AuthorClient = prismaClient.user;
const NoteClient = prismaClient.note;
const CategoryClient = prismaClient.category;

const connectToPostgres = async () => {
  await prismaClient.$connect();
};

export { AuthorClient, NoteClient, CategoryClient, connectToPostgres };
