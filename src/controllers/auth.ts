import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { AuthorClient } from "../db/postgres";
import { encryptPassword, comparePasswords } from "../utils/bcrypt";
import { createJWT } from "../utils/jwt";
import { deleteCache, setCache } from "../utils/redis";

// CREATE AUTHOR / SIGN UP AUTHOR
const createAuthor = async (req: Request, res: Response) => {
  console.log("create author");
  const authorBody = req.body;

  console.log(authorBody);

  const encryptedPass = await encryptPassword(authorBody.password);
  authorBody.password = encryptedPass;

  const createdAuthor = await AuthorClient.create({ data: { ...authorBody } });

  if (!createdAuthor) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Could not create author!" });
  }

  const token = createJWT(createdAuthor.author_uid, createdAuthor.username);

  await deleteCache(`authors`);
  await setCache("jwt-notesapi", token);
  await setCache(`authors:${createdAuthor.author_uid}`, createdAuthor);

  return res.status(StatusCodes.CREATED).json({
    msg: `Successfully created author with uid:${createdAuthor.author_uid}.`,
    token,
    author: createdAuthor,
  });
};

// LOGIN AUTHOR
const loginAuthor = async (req: Request, res: Response) => {
  console.log("login author");
  const { password, email } = req.body;

  if (!password || !email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter both password and email!" });
  }

  const foundAuthor = await AuthorClient.findUnique({ where: { email } });

  console.log(foundAuthor);

  if (!foundAuthor) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Could not find any authors with the email:${email}...` });
  }

  const passMatch = await comparePasswords(password, foundAuthor.password);

  if (!passMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Wrong pass!" });
  }

  const token = createJWT(foundAuthor.author_uid, foundAuthor.username);
  await setCache("jwt-notesapi", token);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully logged in as ${foundAuthor.username}!`,
    token,
    author: foundAuthor,
  });
};

// SIGN OUT AUTHOR
const signOut = async (req: Request, res: Response) => {
  await deleteCache("jwt-notesapi");
  return res.status(StatusCodes.OK).json({ msg: "Successfully signed out!" });
};

// EXPORTS
export { createAuthor, loginAuthor, signOut };
