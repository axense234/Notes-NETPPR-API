import express from "express";

// Controllers and Middleware
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryByName,
  updateCategory,
} from "../controllers/category";
import authenticationMiddleware from "../middleware/authentication";
import router from "./auth";

router.get("/categories", authenticationMiddleware, getAllCategories);

/**
 * @swagger
 * /categories?includeNotes:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting all the categories in NotesAPI!
 *   tags:
 *    - CATEGORY Routes
 *   parameters:
 *    - in: query
 *      name: includeNotes
 *      description: Query Param if you want to include the notes of the categories you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully found all categories in NotesAPI!
 *    "404":
 *     description: Could not find any category in NotesAPI!
 *
 */

router.get(
  "/categories/:categoryName",
  authenticationMiddleware,
  getCategoryByName
);

/**
 * @swagger
 * /categories/{categoryName}?includeNotes:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   description: Route for getting a category in NotesAPI!
 *   tags:
 *    - CATEGORY Routes
 *   parameters:
 *    - in: path
 *      name: categoryName
 *      required: true
 *      description: The category name of the category you want to get!
 *      schema:
 *       type: string
 *    - in: query
 *      name: includeNotes
 *      description: Query Param if you want to include the notes of the categories you will get.(true)
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully found a category in NotesAPI!
 *    "400":
 *     description: Please enter a category name!
 *    "404":
 *     description: Could not find any category with the respective categoryName!
 */

router.post("/categories/create", authenticationMiddleware, createCategory);

/**
 * @swagger
 * /categories/create:
 *  post:
 *   security:
 *    - bearerAuth: []
 *   description: Route to create a category in NotesAPI!
 *   tags:
 *    - CATEGORY Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Category Body
 *      description: The body of the category you want to create.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/Category"
 *   responses:
 *    "201":
 *     description: Successfully created a category in NotesAPI!
 *    "400":
 *     description: Could not create a category with the body requested.
 *
 */

router.patch(
  "/categories/update/:categoryName",
  authenticationMiddleware,
  updateCategory
);

/**
 * @swagger
 * /categories/update/{categoryName}:
 *  patch:
 *   security:
 *    - bearerAuth: []
 *   description: Route to update a category by it's name in NotesAPI!
 *   tags:
 *    - CATEGORY Routes
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Category Body
 *      description: The body of the category you want to update.
 *      required: true
 *      schema:
 *       $ref: "#/components/schemas/Category"
 *    - in: path
 *      name: categoryName
 *      description: The name of the category you want changed.
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully updated a country by id in CountriesAPI!
 *    "400":
 *     description: Please enter a valid category body.
 *    "404":
 *     description: Could not find the category you were looking for.
 *
 */

router.delete(
  "/categories/delete/:categoryName",
  authenticationMiddleware,
  deleteCategory
);

/**
 * @swagger
 * /categories/delete/{categoryName}:
 *  delete:
 *   security:
 *    - bearerAuth: []
 *   description: Route to delete a category by it's name in NotesAPI!
 *   tags:
 *    - CATEGORY Routes
 *   parameters:
 *    - in: path
 *      name: categoryName
 *      description: The category name you want to delete!
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: Successfully deleted a category by it's name in NotesAPI!
 *    "400":
 *     description: Please enter a category name!
 *    "404":
 *     description: Could not find the category you were looking for.
 */

// EXPORTS
export default router;
