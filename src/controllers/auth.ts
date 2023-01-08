import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { UserClient } from "../db/postgres";
import { encryptPassword, comparePasswords } from "../utils/bcrypt";
import { createJWT } from "../utils/jwt";
import { setCache } from "../utils/redis";

// CREATE USER / SIGN UP USER
const createUser = async (req: Request, res: Response) => {
  const userBody = req.body;

  const encryptedPass = await encryptPassword(userBody.password);
  userBody.password = encryptedPass;

  const createdUser = await UserClient.create({ data: { ...userBody } });

  if (!createdUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Could not create user!" });
  }

  const token = createJWT(createdUser.user_uid, createdUser.username);
  await setCache("jwt-notesapi", token);

  return res.status(StatusCodes.CREATED).json({
    msg: `Successfully created user with uid:${createdUser.user_uid}.`,
    token,
    user: createdUser,
  });
};

// LOGIN USER
const loginUser = async (req: Request, res: Response) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter both password and email!" });
  }

  const foundUser = await UserClient.findUnique({ where: { email } });

  console.log(foundUser);

  if (!foundUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Could not find any users with the email:${email}...` });
  }

  const passMatch = await comparePasswords(password, foundUser.password);
  console.log(passMatch);

  if (!passMatch) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Passwords do not match!" });
  }

  const token = createJWT(foundUser.user_uid, foundUser.username);
  await setCache("jwt-notesapi", token);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully logged in as ${foundUser.username}!`,
    token,
    user: foundUser,
  });
};

// EXPORTS
export { createUser, loginUser };
