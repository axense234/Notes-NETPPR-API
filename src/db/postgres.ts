import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

const UserClient = prismaClient.user;
const NoteClient = prismaClient.note;
const CategoryClient = prismaClient.category;

const connectToPostgres = async () => {
  await prismaClient.$connect();
};

export { UserClient, NoteClient, CategoryClient, connectToPostgres };
