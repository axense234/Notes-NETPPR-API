import express from "express";

// Controllers and Middleware
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteByUID,
  updateNote,
} from "../controllers/notes";
import authenticationMiddleware from "../middleware/authentication";

const router = express.Router();

router.get("/notes", authenticationMiddleware, getAllNotes);

/**
 * @swagger
 * /notes?includeCategories:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting all the notes in NotesAPI!
 *   parameters:
 *    - in: query
 *      name: includeNotes
 *      description: Query Param if you want to include the categories of the notes you will get.(true)
 *      schema:
 *       type: string
 *   tags:
 *    - NOTES Routes
 *   responses:
 *    "200":
 *     description: Successfully found all notes in NotesAPI!
 *    "404":
 *     description: Could not find any note in NotesAPI!
 *
 */

router.get("/notes/:noteUID", authenticationMiddleware, getNoteByUID);

/**
 * @swagger
 * /notes/{noteUID}?includeCategories:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting a note in NotesAPI!
 *   tags:
 *    - NOTES Routes
 *   parameters:
 *    - in: path
 *      name: noteUID
 *      required: true
 *      description: The UID of the note you want to get!
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeNotes
 *      description: Query Param if you want to include the categories of the notes you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully found a note in NotesAPI!
 *    "400":
 *     description: Please enter a noteUID!
 *    "404":
 *     description: Could not find any notes with the respective noteUID!
 */

router.post("/notes/create", authenticationMiddleware, createNote);

/**
 * @swagger
 * /notes/create?includeCategories:
 *  post:
 *   security:
 *    - bearerAuth: []
 *   description: Route to create a note in NotesAPI!
 *   tags:
 *    - NOTES Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Note Body
 *      description: The body of the note you want to create.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/Note"
 *    - in: query
 *      name: includeNotes
 *      description: Query Param if you want to include the categories of the notes you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "201":
 *     description: Successfully created a note in NotesAPI!
 *    "400":
 *     description: Could not create a note with the body requested.
 *
 */

router.patch("/notes/update/:noteUID", authenticationMiddleware, updateNote);

/**
 * @swagger
 * /notes/update/{noteUID}?includeCategories&disconnectedCategories:
 *  patch:
 *   security:
 *    - bearerAuth: []
 *   description: Route to update a note by noteUID in NotesAPI!
 *   tags:
 *    - NOTES Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Note Body
 *      description: The body of the note you want to update.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/Note"
 *    - in: path
 *      name: noteUID
 *      description: The noteUID of the note you want changed.
 *      required: true
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeCategories
 *      description: Query Param if you want to include the categories of the notes you will get.(true)
 *      schema:
 *       type: string
 *    - in: query
 *      name: disconnectedCategories
 *      description: Query Param remove categories of a note when updating it.(like Meat,Vegetables,...)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully updated a note by id in NotesAPI!
 *    "400":
 *     description: Please enter a valid note body.
 *    "404":
 *     description: Could not find the note you were looking for.
 *
 */

router.delete("/notes/delete/:noteUID", authenticationMiddleware, deleteNote);

/**
 * @swagger
 * /notes/delete/{noteUID}?includeCategories:
 *  delete:
 *   security:
 *    - bearerAuth: []
 *   description: Route for deleting a note by noteUID!
 *   tags:
 *    - NOTES Routes
 *   parameters:
 *    - in: path
 *      name: noteUID
 *      description: The noteUID of the note you want to delete!
 *      required: true
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeCategories
 *      description: Query Param if you want to include the categories of the notes you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully deleted a note by it's UID in NotesAPI!
 *    "400":
 *     description: Please enter a noteUID!
 *    "404":
 *     description: Could not find the note you were looking for.
 */

// EXPORTS
export default router;
