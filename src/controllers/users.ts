import { User } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { UserClient } from "../db/postgres";
import { deleteCache, getOrSetCache, setCache } from "../utils/redis";

// GET ALL USERS
const getAllUsers = async (req: Request, res: Response) => {
  const { includeCreatedNotes, includeFavoritedNotes } = req.query;

  const foundUsers = await getOrSetCache("users", async () => {
    const users = await UserClient.findMany({
      include: {
        createdNotes: includeCreatedNotes === "true",
        favoritedNotes: includeFavoritedNotes === "true",
      },
    });
    return users;
  });

  if (foundUsers.length < 1) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Could not find any users!", users: [] });
  }

  return res.status(StatusCodes.OK).json({
    msg: "Successfully found users!",
    nbHits: foundUsers.length,
    users: foundUsers,
  });
};

// GET USER BY UID
const getUserByUID = async (req: Request, res: Response) => {
  const { userUID } = req.params;
  const { includeCreatedNotes, includeFavoritedNotes } = req.query;

  if (userUID === ":userUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a userUID!", user: {} });
  }

  const foundUser = await getOrSetCache(`users:${userUID}`, async () => {
    const user = await UserClient.findUnique({
      where: { user_uid: userUID },
      include: {
        createdNotes: includeCreatedNotes === "true",
        favoritedNotes: includeFavoritedNotes === "true",
      },
    });
    return user as User;
  });

  if (!foundUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Could not find user with uid:${userUID}...`, user: {} });
  }

  return res.status(StatusCodes.OK).json({
    msg: `Successfully found user with uid:${userUID}.`,
    user: foundUser,
  });
};

// UPDATE USER BY UID
const updateUserByUID = async (req: Request, res: Response) => {
  const { userUID } = req.params;
  const userBody = req.body;
  const { disconnectedFavoritedNotes, includeFavoritesNotes } = req.query;

  const dcats = disconnectedFavoritedNotes as string;
  if (userBody.favoritedNotes) {
    const favoritedNotesForUse = userBody.favoritedNotes.map((uid: string) => ({
      note_uid: uid,
    }));
    userBody.favoritedNotes = { connect: favoritedNotesForUse };
  } else if (dcats) {
    const disCatsArray = dcats.split(",");
    const favoritedNotesForUse = disCatsArray.map((uid: string) => ({
      note_uid: uid,
    }));
    userBody.favoritedNotes = { disconnect: favoritedNotesForUse };
  }

  if (userUID === ":userUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a userUID!", user: {} });
  }

  const updatedUser = await UserClient.update({
    where: { user_uid: userUID },
    data: { ...userBody },
    include: {
      favoritedNotes: includeFavoritesNotes === "true",
    },
  });

  if (!updatedUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Could not find user with uid:${userUID}...`, user: {} });
  }

  await setCache(`notes:${userUID}`, updatedUser);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully found updated with uid:${userUID}.`,
    user: updatedUser,
  });
};

// DELETE USER BY UID
const deleteUserByUID = async (req: Request, res: Response) => {
  const { userUID } = req.params;

  if (userUID === ":userUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a userUID!", user: {} });
  }

  const deletedUser = await UserClient.delete({ where: { user_uid: userUID } });

  if (!deletedUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Could not find user with uid:${userUID}...`, user: {} });
  }

  await deleteCache(`notes:${userUID}`);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully deleted user with uid:${userUID}.`,
    user: deletedUser,
  });
};

// EXPORTS
export { getAllUsers, getUserByUID, updateUserByUID, deleteUserByUID };
