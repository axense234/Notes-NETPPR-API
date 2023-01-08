import express from "express";

// Controllers and Middleware
import { createUser, loginUser } from "../controllers/auth";

const router = express.Router();

router.post("/users/signup", createUser);

/**
 * @swagger
 * /users/signup:
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
 *      name: User Body
 *      description: The body of the user you want to create.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/User"
 *   responses:
 *    "201":
 *     description: Successfully created a user in NotesAPI!
 *    "400":
 *     description: Could not create a note with the body requested.
 *
 */

router.post("/users/login", loginUser);

/**
 * @swagger
 * /users/login:
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
 *      name: User Body
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

// EXPORTS
export default router;
