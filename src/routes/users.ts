import express from "express";

// Controllers and Middlware
import {
  deleteUserByUID,
  getAllUsers,
  getUserByUID,
  updateUserByUID,
} from "../controllers/users";
import authenticationMiddleware from "../middleware/authentication";

const router = express.Router();

router.get("/users", authenticationMiddleware, getAllUsers);

/**
 * @swagger
 * /users?includeCreatedNotes&includeFavoritedNotes:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting all the users in NotesAPI!
 *   parameters:
 *    - in: query
 *      name: includeCreatedNotes
 *      description: Query Param if you want to include the created notes of the user/users you will get.(true)
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeFavoritedNotes
 *      description: Query Param if you want to include the favorited notes of the user/users you will get.(true)
 *      schema:
 *       type: string
 *   tags:
 *    - USERS Routes
 *   responses:
 *    "200":
 *     description: Successfully found all users in NotesAPI!
 *    "404":
 *     description: Could not find any user in NotesAPI!
 *
 */

router.get("/users/:userUID", authenticationMiddleware, getUserByUID);

/**
 * @swagger
 * /users/{userUID}?includeCreatedNotes&includeFavoritedNotes:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting an user in NotesAPI!
 *   tags:
 *    - USERS Routes
 *   parameters:
 *    - in: path
 *      name: userUID
 *      required: true
 *      description: The UID of the user you want to get!
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeCreatedNotes
 *      description: Query Param if you want to include the created notes of the user/users you will get.(true)
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeFavoritedNotes
 *      description: Query Param if you want to include the favorited notes of the user/users you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully found a user in NotesAPI!
 *    "400":
 *     description: Please enter a userUID!
 *    "404":
 *     description: Could not find any users with the respective userUID!
 */

router.patch(
  "/users/update/:userUID",
  authenticationMiddleware,
  updateUserByUID
);

/**
 * @swagger
 * /users/update/{userUID}?disconnectedFavoritedNotes&includeFavoriteNotes:
 *  patch:
 *   security:
 *    - bearerAuth: []
 *   description: Route to update an user by userUID in NotesAPI!
 *   tags:
 *    - USERS Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: User Body
 *      description: The body of the user you want to update.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/User"
 *    - in: path
 *      name: userUID
 *      description: The userUID of the user you want changed.
 *      required: true
 *      schema:
 *       type: string
 *    - in: query
 *      name: disconnectedFavoritedNotes
 *      description: Query Param if you want remove some favorited notes from a user.(like note_uid1,note_uid2,...)
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeFavoritedNotes
 *      description: Query Param if you want to include the favorited notes of the user/users you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully updated a user by userUID in CountriesAPI!
 *    "400":
 *     description: Please enter a valid user body.
 *    "404":
 *     description: Could not find the user you were looking for.
 *
 */

router.delete(
  "/users/delete/:userUID",
  authenticationMiddleware,
  deleteUserByUID
);

/**
 * @swagger
 * /users/delete/{userUID}:
 *  delete:
 *   security:
 *    - bearerAuth: []
 *   description: Route for deleting a user by userUID!
 *   tags:
 *    - USERS Routes
 *   parameters:
 *    - in: path
 *      name: userUID
 *      description: The userUID of the user you want to delete!
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully deleted a user by it's UID in NotesAPI!
 *    "400":
 *     description: Please enter a userUID!
 *    "404":
 *     description: Could not find the user you were looking for.
 */

// EXPORTS
export default router;
