// Express
import { Request, Response } from "express";
// Status Codes
import { StatusCodes } from "http-status-codes";
// Prisma
import { StyleOptions } from "@prisma/client";
import { StyleOptionsClient } from "../db/postgres";
// Utils
import { deleteCache, getOrSetCache, setCache } from "../utils/redis";

// GET ALL STYLE OPTIONS
const getAllStyleOptions = async (req: Request, res: Response) => {
  const foundStyleOptions = await getOrSetCache("styleOptions", async () => {
    const styleOptions = await StyleOptionsClient.findMany({});
    return styleOptions;
  });

  if (foundStyleOptions.length < 1) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Could not find any style options", styleOptions: [] });
  }

  return res.status(StatusCodes.OK).json({
    msg: "Successfully found all style options!",
    nbHits: foundStyleOptions.length,
    styleOptions: foundStyleOptions,
  });
};

// GET STYLE OPTION BY UID
const getStyleOptionByUID = async (req: Request, res: Response) => {
  const { styleOptionUID } = req.params;

  if (styleOptionUID === ":styleOptionUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a styleOptionUID!", styleOption: {} });
  }

  const foundStyleOption = await getOrSetCache(
    `styleOptions:${styleOptionUID}`,
    async () => {
      const styleOption = await StyleOptionsClient.findUnique({
        where: { styleOptions_uid: styleOptionUID },
      });
      return styleOption as StyleOptions;
    }
  );

  if (!foundStyleOption) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `Could not find styleOption with uid:${styleOptionUID}...`,
      styleOption: {},
    });
  }

  return res.status(StatusCodes.OK).json({
    msg: `Successfully found styleOption with uid:${styleOptionUID}.`,
    styleOption: foundStyleOption,
  });
};

// CREATE STYLE OPTION
const createStyleOption = async (req: Request, res: Response) => {
  const styleOptionBody = req.body;

  if (!styleOptionBody.note_uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a request body!", styleOption: {} });
  }

  const createdStyleOption = await StyleOptionsClient.create({
    data: {
      ...styleOptionBody,
    },
  });

  if (!createdStyleOption) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Could not create styleOption! Check the request body!",
      styleOption: {},
    });
  }

  return res.status(StatusCodes.CREATED).json({
    msg: `Successfully created styleOption with uid:${createdStyleOption.styleOptions_uid}`,
    styleOption: createdStyleOption,
  });
};

// UPDATE STYLE OPTION
const updateStyleOption = async (req: Request, res: Response) => {
  const { styleOptionUID } = req.params;
  const styleOptionBody = req.body;

  if (styleOptionUID === ":styleOptionUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a styleOptionUID!", styleOption: {} });
  }

  const updatedStyleOption = await StyleOptionsClient.update({
    where: { styleOptions_uid: styleOptionUID },
    data: { ...styleOptionBody },
  });

  if (!updatedStyleOption) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `Could not find styleOption with uid:${styleOptionUID}...`,
      styleOption: {},
    });
  }

  await setCache(
    `styleOptions:${updatedStyleOption.styleOptions_uid}`,
    updatedStyleOption
  );

  return res.status(StatusCodes.OK).json({
    msg: `Successfully updated styleOption with uid:${styleOptionUID}.`,
    styleOption: updatedStyleOption,
  });
};

// DELETE STYLE OPTION
const deleteStyleOption = async (req: Request, res: Response) => {
  const { styleOptionUID } = req.params;

  if (styleOptionUID === ":styleOptionUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a styleOptionUID!", styleOption: {} });
  }

  const deletedStyleOption = await StyleOptionsClient.delete({
    where: { styleOptions_uid: styleOptionUID },
  });

  if (!deletedStyleOption) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `Could not find styleOption with uid:${styleOptionUID}...`,
      styleOption: {},
    });
  }

  await deleteCache(`notes:${deletedStyleOption.styleOptions_uid}`);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully deleted styleOption with uid:${styleOptionUID}`,
    styleOption: deletedStyleOption,
  });
};

// EXPORTS
export {
  getAllStyleOptions,
  getStyleOptionByUID,
  createStyleOption,
  updateStyleOption,
  deleteStyleOption,
};
