// Express
import { NextFunction, Request, Response } from "express";
// Status Codes
import { StatusCodes } from "http-status-codes";
// Utils
import { verifyJWT } from "../utils/jwt";
import { getOrSetCache } from "../utils/redis";

declare module "express-serve-static-core" {
  export interface Request {
    user: any;
  }
}

const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization as string;

  const token = await getOrSetCache("jwt-notesapi", () => {
    if (!authHeader || (!authHeader.startsWith("Bearer ") && token)) {
      return null;
    }

    return authHeader.split(" ")[1];
  });

  if (!token) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide a jwt!" });
  }

  try {
    req.user = verifyJWT(token);
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Expired jwt." });
  }
};

export default authenticationMiddleware;
