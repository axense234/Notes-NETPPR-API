// Express
import { Request, Response } from "express";
// Status Codes
import { StatusCodes } from "http-status-codes";
// Data
import tempAuthors from "../data/authors";
import tempCategories from "../data/categories";
import tempFolders from "../data/folders";
import tempNotes from "../data/notes";
// Prisma
import {
  AuthorClient,
  CategoryClient,
  FolderClient,
  NoteClient,
} from "../db/postgres";
// Redis
import { deleteAllCache, deleteCache } from "../utils/redis";

const deleteAll = async (req: Request, res: Response) => {
  const { deleteOption } = req.query;

  switch (deleteOption) {
    case "authors":
      await AuthorClient.deleteMany({});
      await deleteCache("authors");
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Deleted all ${deleteOption}!` });
    case "notes":
      await NoteClient.deleteMany({});
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Deleted all ${deleteOption}!` });
    case "folders":
      await FolderClient.deleteMany({});
      await deleteCache("folders");
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Deleted all ${deleteOption}!` });
    case "categories":
      await CategoryClient.deleteMany({});
      await deleteCache("categories");
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Deleted all ${deleteOption}!` });
    case "all":
      await FolderClient.deleteMany({});
      await NoteClient.deleteMany({});
      await AuthorClient.deleteMany({});
      await CategoryClient.deleteMany({});
      await deleteAllCache();
      return res.status(StatusCodes.OK).json({ msg: `Reseted DB!` });
    default:
      return res
        .status(StatusCodes.OK)
        .json({ msg: "Please provide a deleteOption!" });
  }
};

const insertAll = async (req: Request, res: Response) => {
  const { insertOption, authorUID } = req.query;
  let notes;
  let folders;

  switch (insertOption) {
    // Authors
    case "authors":
      await AuthorClient.createMany({ data: tempAuthors });
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Inserted template ${insertOption}!` });
    // Notes
    case "notes":
      notes = tempNotes.map((note) => {
        note.createdById = authorUID as string;
        return note;
      });
      await NoteClient.createMany({ data: notes });
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Inserted template ${insertOption}!` });
    // Folders
    case "folders":
      folders = tempFolders.map((folder) => {
        folder.author_uid = authorUID as string;
        return folder;
      });
      await FolderClient.createMany({ data: folders });
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Inserted template ${insertOption}!` });
    // Categories
    case "categories":
      await CategoryClient.createMany({ data: tempCategories });
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Inserted template ${insertOption}!` });
    default:
      break;
  }
};

// EXPORTS
export { deleteAll, insertAll };
