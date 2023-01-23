import express from "express";

// Controllers and Middlware
import {
  deleteAuthorByUID,
  getAllAuthors,
  getAuthorByUID,
  updateAuthorByUID,
} from "../controllers/authors";
import authenticationMiddleware from "../middleware/authentication";

const router = express.Router();

router.get("/authors", authenticationMiddleware, getAllAuthors);

/**
 * @swagger
 * /authors?includeCreatedNotes&includeFavoritedNotes:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting all the authors in NotesAPI!
 *   parameters:
 *    - in: query
 *      name: includeCreatedNotes
 *      description: Query Param if you want to include the created notes of the author/authors you will get.(true)
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeFavoritedNotes
 *      description: Query Param if you want to include the favorited notes of the author/authors you will get.(true)
 *      schema:
 *       type: string
 *   tags:
 *    - AUTHORS Routes
 *   responses:
 *    "200":
 *     description: Successfully found all authors in NotesAPI!
 *    "404":
 *     description: Could not find any author in NotesAPI!
 *
 */

router.get("/authors/:authorUID", authenticationMiddleware, deleteAuthorByUID);

/**
 * @swagger
 * /authors/{authorUID}?includeCreatedNotes&includeFavoritedNotes:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting an author in NotesAPI!
 *   tags:
 *    - AUTHORS Routes
 *   parameters:
 *    - in: path
 *      name: authorUID
 *      required: true
 *      description: The UID of the author you want to get!
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeCreatedNotes
 *      description: Query Param if you want to include the created notes of the author/authors you will get.(true)
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeFavoritedNotes
 *      description: Query Param if you want to include the favorited notes of the author/authors you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully found an author in NotesAPI!
 *    "400":
 *     description: Please enter an authorUID!
 *    "404":
 *     description: Could not find any authors with the respective authorUID!
 */

router.patch(
  "/authors/update/:authorUID",
  authenticationMiddleware,
  updateAuthorByUID
);

/**
 * @swagger
 * /authors/update/{authorUID}?disconnectedFavoritedNotes&includeFavoriteNotes:
 *  patch:
 *   security:
 *    - bearerAuth: []
 *   description: Route to update an author by authorUID in NotesAPI!
 *   tags:
 *    - AUTHORS Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Author Body
 *      description: The body of the author you want to update.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/Author"
 *    - in: path
 *      name: authorUID
 *      description: The authorUID of the author you want changed.
 *      required: true
 *      schema:
 *       type: string
 *    - in: query
 *      name: disconnectedFavoritedNotes
 *      description: Query Param if you want remove some favorited notes from a author.(like note_uid1,note_uid2,...)
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeFavoritedNotes
 *      description: Query Param if you want to include the favorited notes of the author/authors you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully updated a author by authorUID in NotesAPI!
 *    "400":
 *     description: Please enter a valid author body.
 *    "404":
 *     description: Could not find the author you were looking for.
 *
 */

router.delete(
  "/authors/delete/:authorUID",
  authenticationMiddleware,
  deleteAuthorByUID
);

/**
 * @swagger
 * /authors/delete/{authorUID}:
 *  delete:
 *   security:
 *    - bearerAuth: []
 *   description: Route for deleting a author by authorUID!
 *   tags:
 *    - AUTHORS Routes
 *   parameters:
 *    - in: path
 *      name: authorUID
 *      description: The authorUID of the author you want to delete!
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully deleted a author by it's UID in NotesAPI!
 *    "400":
 *     description: Please enter a authorUID!
 *    "404":
 *     description: Could not find the author you were looking for.
 */

// EXPORTS
export default router;
