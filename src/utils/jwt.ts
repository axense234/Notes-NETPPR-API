import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

// CREATE JWT
const createJWT = (uid: string, username: string) => {
  return jwt.sign({ uid, username }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "1d",
  });
};

// VERIFY JWT
const verifyJWT = (token: string | void) => {
  return jwt.verify(token as string, process.env.JWT_SECRET_KEY as string);
};

// EXPORTS
export { createJWT, verifyJWT };
