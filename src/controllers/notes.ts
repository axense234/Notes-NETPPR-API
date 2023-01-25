import { Category, Note } from "@prisma/client";
import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { NoteClient } from "../db/postgres";
import { deleteCache, getOrSetCache, setCache } from "../utils/redis";

// GET ALL NOTES
const getAllNotes = async (req: Request, res: Response) => {
  const { includeCategories } = req.query;

  const foundNotes = await getOrSetCache("notes", async () => {
    const notes = await NoteClient.findMany({
      include: { categories: includeCategories === "true" },
    });
    return notes;
  });

  if (foundNotes.length < 1) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Could not find any notes!", notes: [] });
  }

  return res.status(StatusCodes.OK).json({
    msg: "Successfully found notes!",
    nbHits: foundNotes.length,
    notes: foundNotes,
  });
};

// GET NOTE BY UID
const getNoteByUID = async (req: Request, res: Response) => {
  const { noteUID } = req.params;
  const { includeCategories } = req.query;

  if (noteUID === ":noteUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a noteUID!", note: {} });
  }

  const foundNote = await getOrSetCache(`notes:${noteUID}`, async () => {
    const note = await NoteClient.findUnique({
      where: { note_uid: noteUID },
      include: { categories: includeCategories === "true" },
    });
    return note as Note & { categories: Category[] };
  });

  if (!foundNote) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Could not find note with uid:${noteUID}...`, note: {} });
  }

  return res.status(StatusCodes.OK).json({
    msg: `Successfully found note with uid:${noteUID}.`,
    note: foundNote,
  });
};

// CREATE NOTE
const createNote = async (req: Request, res: Response) => {
  const noteBody = req.body;
  const { includeCategories } = req.query;

  if (noteBody.categories) {
    const categoriesForUse = noteBody.categories.map((cat: string) => ({
      name: cat,
    }));
    noteBody.categories = { connect: categoriesForUse };
  }

  if (!noteBody.title) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a request body!", note: {} });
  }

  const createdNote = await NoteClient.create({
    data: {
      ...noteBody,
    },
    include: {
      categories: includeCategories === "true",
    },
  });

  if (!createdNote) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Could not create note! Check the request body!",
      note: {},
    });
  }

  await deleteCache(`notes`);
  await setCache(`notes:${createdNote.note_uid}`, createdNote);

  return res.status(StatusCodes.CREATED).json({
    msg: `Successfully created note with uid:${createdNote.note_uid}.`,
    note: createdNote,
  });
};

// UPDATE NOTE
const updateNote = async (req: Request, res: Response) => {
  const { noteUID } = req.params;
  const noteBody = req.body;
  const { includeCategories, disconnectedCategories } = req.query;

  const dcats = disconnectedCategories as string;

  if (noteBody.categories) {
    const categoriesForUse = noteBody.categories.map((cat: string) => ({
      name: cat,
    }));
    noteBody.categories = { connect: categoriesForUse };
  } else if (dcats) {
    const disCatsArray = dcats.split(",");
    const categoriesForUse = disCatsArray.map((cat: string) => ({
      name: cat,
    }));
    noteBody.categories = { disconnect: categoriesForUse };
  }

  if (noteUID === ":noteUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a noteUID!", note: {} });
  }

  const updatedNote = await NoteClient.update({
    where: { note_uid: noteUID },
    data: { ...noteBody },
    include: { categories: includeCategories === "true" },
  });

  if (!updatedNote) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Could not find note with uid:${noteUID}...`, note: {} });
  }

  await setCache(`notes:${updatedNote.note_uid}`, updatedNote);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully updated note with uid:${noteUID}.`,
    note: updatedNote,
  });
};

// DELETE NOTE
const deleteNote = async (req: Request, res: Response) => {
  const { noteUID } = req.params;
  const { includeCategories } = req.query;

  if (noteUID === ":noteUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a noteUID!", note: {} });
  }

  const deletedNote = await NoteClient.delete({
    where: { note_uid: noteUID },
    include: { categories: includeCategories === "true" },
  });

  if (!deletedNote) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Could not find note with uid:${noteUID}...`, note: {} });
  }

  await deleteCache(`notes:${deletedNote.note_uid}`);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully deleted note with uid:${noteUID}.`,
    note: deletedNote,
  });
};

// EXPORTS
export { getAllNotes, getNoteByUID, createNote, updateNote, deleteNote };
