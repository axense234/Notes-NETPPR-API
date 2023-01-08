import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const notFoundMiddleware = (req: Request, res: Response) => {
  return res.status(StatusCodes.PERMANENT_REDIRECT).redirect("/");
};

export default notFoundMiddleware;
