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

/**
 * @swagger
 * /folders?includeNotes:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting all the folders in NotesAPI!
 *   parameters:
 *    - in: query
 *      name: includeNotes
 *      description: Query Param if you want to include the notes of the folders you will get.(true)
 *      schema:
 *       type: string
 *   tags:
 *    - FOLDERS Routes
 *   responses:
 *    "200":
 *     description: Successfully found all folders in NotesAPI!
 *    "404":
 *     description: Could not find any folder in NotesAPI!
 *
 */

router.get("/folders/:folderUID", authenticationMiddleware, getFolderByUID);

/**
 * @swagger
 * /folders/{folderUID}?includeNotes:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting a folder in NotesAPI!
 *   tags:
 *    - FOLDERS Routes
 *   parameters:
 *    - in: path
 *      name: folderUID
 *      required: true
 *      description: The UID of the folder you want to get!
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeNotes
 *      description: Query Param if you want to include the notes of folder you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully found a folder in NotesAPI!
 *    "400":
 *     description: Please enter a folderUID!
 *    "404":
 *     description: Could not find any folder with the respective noteUID!
 */

router.post("/folders/create", authenticationMiddleware, createFolder);

/**
 * @swagger
 * /folders/create?includeNotes:
 *  post:
 *   security:
 *    - bearerAuth: []
 *   description: Route to create a folder in NotesAPI!
 *   tags:
 *    - FOLDERS Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Note Body
 *      description: The body of the folder you want to create.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/Folder"
 *    - in: query
 *      name: includeNotes
 *      description: Query Param if you want to include the notes of the folder you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "201":
 *     description: Successfully created a folder in NotesAPI!
 *    "400":
 *     description: Could not create a folder with the body requested.
 *
 */

router.patch(
  "/folders/update/:folderUID",
  authenticationMiddleware,
  updateFolder
);

/**
 * @swagger
 * /folders/update/{folderUID}?includeNotes:
 *  patch:
 *   security:
 *    - bearerAuth: []
 *   description: Route to update a folder by noteUID in NotesAPI!
 *   tags:
 *    - FOLDERS Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Note Body
 *      description: The body of the folder you want to update.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/Folder"
 *    - in: path
 *      name: folderUID
 *      description: The folderUID of the folder you want changed.
 *      required: true
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeNotes
 *      description: Query Param if you want to include the notes of the folder you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully updated a folder by id in NotesAPI!
 *    "400":
 *     description: Please enter a valid folder body.
 *    "404":
 *     description: Could not find the folder you were looking for.
 *
 */

router.delete(
  "/folders/delete/:folderUID",
  authenticationMiddleware,
  deleteFolder
);

/**
 * @swagger
 * /folders/delete/{folderUID}?includeNotes:
 *  delete:
 *   security:
 *    - bearerAuth: []
 *   description: Route for deleting a folder by folderUID!
 *   tags:
 *    - FOLDERS Routes
 *   parameters:
 *    - in: path
 *      name: folderUID
 *      description: The folderUID of the folder you want to delete!
 *      required: true
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeNotes
 *      description: Query Param if you want to include the notes of the folder you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully deleted a folder by it's UID in NotesAPI!
 *    "400":
 *     description: Please enter a folderUID!
 *    "404":
 *     description: Could not find the folder you were looking for.
 */

// EXPORTS
export default router;
