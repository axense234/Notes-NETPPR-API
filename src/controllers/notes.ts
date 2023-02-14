import { Category, Note } from "@prisma/client";
import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { NoteClient, StyleOptionsClient } from "../db/postgres";
import { deleteCache, getOrSetCache, setCache } from "../utils/redis";

type noteOptionsType = {
  include: {
    categories: boolean;
    styleOptions: boolean;
  };
  where?: {
    createdById?: string;
    title?: string;
  };
};

// GET ALL NOTES
const getAllNotes = async (req: Request, res: Response) => {
  const { includeCategories, includeStyleOptions, createdById, title } =
    req.query;

  const noteOptions: noteOptionsType = {
    include: {
      categories: includeCategories === "true",
      styleOptions: includeStyleOptions === "true",
    },
  };

  if (createdById !== "undefined" && createdById) {
    noteOptions.where = {
      ...noteOptions.where,
      createdById: createdById as string,
    };
  }

  if (title !== "undefined" && title) {
    noteOptions.where = { ...noteOptions.where, title: title as string };
  }

  console.log(noteOptions);

  const foundNotes = await NoteClient.findMany(noteOptions);

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
  const { includeCategories, includeStyleOptions } = req.query;

  if (noteUID === ":noteUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a noteUID!", note: {} });
  }

  const foundNote = await getOrSetCache(`notes:${noteUID}`, async () => {
    const note = await NoteClient.findUnique({
      where: { note_uid: noteUID },
      include: {
        categories: includeCategories === "true",
        styleOptions: includeStyleOptions === "true",
      },
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
  const { includeCategories, includeStyleOptions } = req.query;

  if (noteBody.styleOptions) {
    const createdStyleOptions = await StyleOptionsClient.create({
      data: { ...noteBody.styleOptions },
    });
    noteBody.styleOptions_uid = createdStyleOptions.styleOptions_uid;
    delete noteBody.styleOptions;
  }

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
      styleOptions: includeStyleOptions === "true",
    },
  });

  console.log(createdNote);

  if (!createdNote) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Could not create note! Check the request body!",
      note: {},
    });
  }

  await deleteCache(`notes`);
  await deleteCache("authors");
  await deleteCache(`authors:${createdNote.createdById}`);
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
  const { includeCategories, includeStyleOptions, disconnectedCategories } =
    req.query;

  const dcats = disconnectedCategories as string;

  if (noteBody.styleOptions) {
    const createdStyleOptions = await StyleOptionsClient.update({
      where: { styleOptions_uid: noteBody.styleOptions.styleOptions_uid },
      data: { ...noteBody.styleOptions },
    });
    noteBody.styleOptions_uid = createdStyleOptions.styleOptions_uid;
    delete noteBody.styleOptions;
  }

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
    include: {
      categories: includeCategories === "true",
      styleOptions: includeStyleOptions === "true",
    },
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
  const { includeCategories, includeStyleOptions } = req.query;

  if (noteUID === ":noteUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a noteUID!", note: {} });
  }

  const deletedNote = await NoteClient.delete({
    where: { note_uid: noteUID },
    include: {
      categories: includeCategories === "true",
      styleOptions: includeStyleOptions === "true",
    },
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
