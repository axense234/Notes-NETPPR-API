import express from "express";

// Controllers and Middleware
import {
  createFolder,
  deleteFolder,
  getAllFolders,
  getFolderByUID,
  updateFolder,
} from "../controllers/folders";
import authenticationMiddleware from "../middleware/authentication";

const router = express.Router();

router.get("/folders", authenticationMiddleware, getAllFolders);
router.get("/folders/:folderUID", authenticationMiddleware, getFolderByUID);

router.post("/folders/create", authenticationMiddleware, createFolder);

router.patch(
  "/folders/update/:folderUID",
  authenticationMiddleware,
  updateFolder
);

router.delete(
  "/folders/delete/:folderUID",
  authenticationMiddleware,
  deleteFolder
);

// EXPORTS
export default router;
