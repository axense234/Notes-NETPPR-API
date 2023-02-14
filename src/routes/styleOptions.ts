import express from "express";

// Controllers and Middleware
import {
  createStyleOption,
  deleteStyleOption,
  getAllStyleOptions,
  getStyleOptionByUID,
  updateStyleOption,
} from "../controllers/styleOptions";
import authenticationMiddleware from "../middleware/authentication";

const router = express.Router();

router.get("/styleOptions", authenticationMiddleware, getAllStyleOptions);

/**
 * @swagger
 * /styleOptions:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting all the styleOptions in NotesAPI!
 *   tags:
 *    - STYLE OPTIONS Routes
 *   responses:
 *    "200":
 *     description: Successfully found all styleOptions in NotesAPI!
 *    "404":
 *     description: Could not find any styleOption in NotesAPI!
 *
 */

router.get(
  "/styleOptions/:styleOptionUID",
  authenticationMiddleware,
  getStyleOptionByUID
);

/**
 * @swagger
 * /styleOptions/{styleOptionUID}:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting a styleOption in NotesAPI!
 *   tags:
 *    - STYLE OPTIONS Routes
 *   parameters:
 *    - in: path
 *      name: styleOptionUID
 *      required: true
 *      description: The UID of the styleOption you want to get!
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully found a styleOption in NotesAPI!
 *    "400":
 *     description: Please enter a styleOptionUID!
 *    "404":
 *     description: Could not find any styleOptions with the respective styleOptionUID!
 */

router.post(
  "/styleOptions/create",
  authenticationMiddleware,
  createStyleOption
);

/**
 * @swagger
 * /styleOptions/create:
 *  post:
 *   security:
 *    - bearerAuth: []
 *   description: Route to create a styleOption in NotesAPI!
 *   tags:
 *    - STYLE OPTIONS Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Style Option Body
 *      description: The body of the styleOption you want to create.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/StyleOption"
 *   responses:
 *    "201":
 *     description: Successfully created a styleOption in NotesAPI!
 *    "400":
 *     description: Could not create a styleOption with the body requested.
 *
 */

router.patch(
  "/styleOptions/update/:styleOptionUID",
  authenticationMiddleware,
  updateStyleOption
);

/**
 * @swagger
 * /styleOptions/update/{styleOptionUID}:
 *  patch:
 *   security:
 *    - bearerAuth: []
 *   description: Route to update a styleOption by styleOptionUID in NotesAPI!
 *   tags:
 *    - STYLE OPTIONS Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Style Option Body
 *      description: The body of the styleOption you want to update.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/StyleOption"
 *    - in: path
 *      name: styleOptionUID
 *      description: The styleOptionUID of the styleOption you want changed.
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully updated a styleOption by id in NotesAPI!
 *    "400":
 *     description: Please enter a valid styleOption body.
 *    "404":
 *     description: Could not find the styleOption you were looking for.
 *
 */

router.delete(
  "/styleOptions/delete/:styleOptionUID",
  authenticationMiddleware,
  deleteStyleOption
);

/**
 * @swagger
 * /styleOptions/delete/{styleOptionUID}:
 *  delete:
 *   security:
 *    - bearerAuth: []
 *   description: Route for deleting a styleOption by styleOptionUID!
 *   tags:
 *    - STYLE OPTIONS Routes
 *   parameters:
 *    - in: path
 *      name: styleOptionUID
 *      description: The styleOptionUID of the styleOption you want to delete!
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully deleted a styleOption by it's UID in NotesAPI!
 *    "400":
 *     description: Please enter a styleOptionUID!
 *    "404":
 *     description: Could not find the styleOption you were looking for.
 */

// EXPORTS
export default router;
