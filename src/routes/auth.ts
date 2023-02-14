import express from "express";

// Controllers and Middleware
import { createAuthor, loginAuthor, signOut } from "../controllers/auth";

const router = express.Router();

router.post("/authors/signup", createAuthor);

/**
 * @swagger
 * /authors/signup:
 *  post:
 *   security:
 *    - bearerAuth: []
 *   description: Route to create an account in NotesAPI!
 *   tags:
 *    - AUTH Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Author Body
 *      description: The body of the author you want to create.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/Author"
 *   responses:
 *    "201":
 *     description: Successfully created a author in NotesAPI!
 *    "400":
 *     description: Could not create an author with the body requested.
 *
 */

router.post("/authors/login", loginAuthor);

/**
 * @swagger
 * /authors/login:
 *  post:
 *   security:
 *    - bearerAuth: []
 *   description: Route to login to an account in NotesAPI!
 *   tags:
 *    - AUTH Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Author Body
 *      description: The username and password of the account you want ot login.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/Authorization"
 *   responses:
 *    "200":
 *     description: Successfully logged in NotesAPI!
 *    "400":
 *     description: Please enter both email and password.
 *    "401":
 *     description: Passwords do not match.
 *    "404":
 *     description: Could not find any accounts with the respective email.
 *
 */

router.post("/authors/signout", signOut);

/**
 * @swagger
 * /authors/login:
 *  post:
 *   security:
 *    - bearerAuth: []
 *   description: Route to sign out in NotesAPI!
 *   tags:
 *    - AUTH Routes
 *   consumes:
 *    - application/json
 *   responses:
 *    "200":
 *     description: Successfully signed out in NotesAPI!
 *
 */

// EXPORTS
export default router;
