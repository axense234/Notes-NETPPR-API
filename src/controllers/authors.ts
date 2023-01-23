import { Author } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { AuthorClient } from "../db/postgres";
import { deleteCache, getOrSetCache, setCache } from "../utils/redis";

// GET ALL USERS
const getAllAuthors = async (req: Request, res: Response) => {
  const { includeCreatedNotes, includeFavoritedNotes } = req.query;

  const foundAuthors = await getOrSetCache("authors", async () => {
    const authors = await AuthorClient.findMany({
      include: {
        createdNotes: includeCreatedNotes === "true",
        favoritedNotes: includeFavoritedNotes === "true",
      },
    });
    return authors;
  });

  if (foundAuthors.length < 1) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Could not find any authors!", authors: [] });
  }

  return res.status(StatusCodes.OK).json({
    msg: "Successfully found authors!",
    nbHits: foundAuthors.length,
    authors: foundAuthors,
  });
};

// GET USER BY UID
const getAuthorByUID = async (req: Request, res: Response) => {
  const { authorUID } = req.params;
  const { includeCreatedNotes, includeFavoritedNotes } = req.query;

  if (authorUID === ":authorUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a authorUID!", author: {} });
  }

  const foundAuthor = await getOrSetCache(`authors:${authorUID}`, async () => {
    const author = await AuthorClient.findUnique({
      where: { author_uid: authorUID },
      include: {
        createdNotes: includeCreatedNotes === "true",
        favoritedNotes: includeFavoritedNotes === "true",
      },
    });
    return author as Author;
  });

  if (!foundAuthor) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `Could not find author with uid:${authorUID}...`,
      author: {},
    });
  }

  return res.status(StatusCodes.OK).json({
    msg: `Successfully found author with uid:${authorUID}.`,
    author: foundAuthor,
  });
};

// UPDATE USER BY UID
const updateAuthorByUID = async (req: Request, res: Response) => {
  const { authorUID } = req.params;
  const authorBody = req.body;
  const { disconnectedFavoritedNotes, includeFavoritesNotes } = req.query;

  const dcats = disconnectedFavoritedNotes as string;
  if (authorBody.favoritedNotes) {
    const favoritedNotesForUse = authorBody.favoritedNotes.map(
      (uid: string) => ({
        note_uid: uid,
      })
    );
    authorBody.favoritedNotes = { connect: favoritedNotesForUse };
  } else if (dcats) {
    const disCatsArray = dcats.split(",");
    const favoritedNotesForUse = disCatsArray.map((uid: string) => ({
      note_uid: uid,
    }));
    authorBody.favoritedNotes = { disconnect: favoritedNotesForUse };
  }

  if (authorUID === ":authorUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a authorUID!", author: {} });
  }

  const updatedAuthor = await AuthorClient.update({
    where: { author_uid: authorUID },
    data: { ...authorBody },
    include: {
      favoritedNotes: includeFavoritesNotes === "true",
    },
  });

  if (!updatedAuthor) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `Could not find author with uid:${authorUID}...`,
      author: {},
    });
  }

  await setCache(`notes:${authorUID}`, updatedAuthor);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully found author updated with uid:${authorUID}.`,
    author: updatedAuthor,
  });
};

// DELETE USER BY UID
const deleteAuthorByUID = async (req: Request, res: Response) => {
  const { userUID: authorUID } = req.params;

  if (authorUID === ":authorUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a authorUID!", author: {} });
  }

  const deletedAuthor = await AuthorClient.delete({
    where: { author_uid: authorUID },
  });

  if (!deletedAuthor) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `Could not find author with uid:${authorUID}...`,
      author: {},
    });
  }

  await deleteCache(`notes:${authorUID}`);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully deleted author with uid:${authorUID}.`,
    author: deletedAuthor,
  });
};

// EXPORTS
export { getAllAuthors, getAuthorByUID, updateAuthorByUID, deleteAuthorByUID };
