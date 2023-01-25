import { Folder } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { FolderClient } from "../db/postgres";
import {
  deleteAllCache,
  deleteCache,
  getOrSetCache,
  setCache,
} from "../utils/redis";

// GET ALL FOLDERS
const getAllFolders = async (req: Request, res: Response) => {
  const foundFolders = await getOrSetCache("folders", async () => {
    const folders = await FolderClient.findMany({});
    return folders;
  });

  console.log(foundFolders);

  if (foundFolders.length < 1) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Could not find any folders!", folders: [] });
  }

  return res.status(StatusCodes.OK).json({
    msg: "Successfully found folders!",
    nbHits: foundFolders.length,
    folders: foundFolders,
  });
};

// GET FOLDER BY UID
const getFolderByUID = async (req: Request, res: Response) => {
  const { folderUID } = req.params;

  if (folderUID === ":folderUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a folderUID!", folder: {} });
  }

  const foundFolder = await getOrSetCache(`folders:${folderUID}`, async () => {
    const folder = await FolderClient.findUnique({
      where: { folder_uid: folderUID },
    });
    return folder as Folder;
  });

  if (!foundFolder) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `Could not find folder with uid:${folderUID}...`,
      folder: {},
    });
  }

  return res.status(StatusCodes.OK).json({
    msg: `Successfully found folder with uid:${folderUID}.`,
    folder: foundFolder,
  });
};

// CREATE FOLDER
const createFolder = async (req: Request, res: Response) => {
  const folderBody = req.body;

  if (!folderBody.label) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a request body!", folder: {} });
  }

  const createdFolder = await FolderClient.create({
    data: {
      ...folderBody,
    },
  });

  if (!createdFolder) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Could not create folder! Check the request body!",
      folder: {},
    });
  }

  await deleteCache("folders");
  await setCache(`folders:${createdFolder.folder_uid}`, createdFolder);

  return res.status(StatusCodes.CREATED).json({
    msg: `Successfully created folder with uid:${createdFolder.folder_uid}`,
    folder: createdFolder,
  });
};

// UPDATE FOLDER
const updateFolder = async (req: Request, res: Response) => {
  const { folderUID } = req.params;
  const folderBody = req.body;

  if (folderUID === ":folderUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a folderUID!", folder: {} });
  }

  const updatedFolder = await FolderClient.update({
    where: { folder_uid: folderUID },
    data: { ...folderBody },
  });

  if (!updatedFolder) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Could not find folder with uid:${folderUID}`, folder: {} });
  }

  await setCache(`notes:${updatedFolder.folder_uid}`, updatedFolder);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully updated folder with uid:${folderUID}`,
    folder: updatedFolder,
  });
};

// DELETE FOLDER
const deleteFolder = async (req: Request, res: Response) => {
  const { folderUID } = req.params;

  if (folderUID === ":folderUID") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a folderUID!", folder: {} });
  }

  const deletedFolder = await FolderClient.delete({
    where: { folder_uid: folderUID },
  });

  if (!deletedFolder) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `Could not find folder with uid:${folderUID}...`,
      folder: {},
    });
  }

  await deleteCache(`folders:${deletedFolder.folder_uid}`);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully deleted folder with uid:${folderUID}`,
    folder: deletedFolder,
  });
};

// EXPORTS
export {
  getAllFolders,
  getFolderByUID,
  createFolder,
  updateFolder,
  deleteFolder,
};
