// Prisma
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
// Express
import { ErrorRequestHandler } from "express";
// Status Codes
import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const customError = {
    msg: err.message || "Unexpected error.",
    code: (typeof err.code === "string" ? 500 : err.code || err.status) || 500,
  };

  if (err.code === "P2002") {
    customError.msg = "Please provide unique values!(email,categoryName)";
    customError.code = StatusCodes.BAD_REQUEST;
  }

  if (err.code === "P2025") {
    customError.msg = "Resource does not exist!(category/name/user)";
    customError.code = StatusCodes.NOT_FOUND;
  }

  if (err instanceof PrismaClientValidationError) {
    customError.msg = "Please enter a valid request body!";
    customError.code = StatusCodes.BAD_REQUEST;
  }

  return res.status(customError.code).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
