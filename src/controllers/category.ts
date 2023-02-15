// Express
import { Request, Response } from "express";
// Status Codes
import { StatusCodes } from "http-status-codes";
// Prisma
import { Category, Note } from "@prisma/client";
import { CategoryClient } from "../db/postgres";
// Utils
import { deleteCache, getOrSetCache, setCache } from "../utils/redis";

// GET ALL CATEGORIES
const getAllCategories = async (req: Request, res: Response) => {
  const { includeNotes } = req.query;

  const allCategories = await getOrSetCache("categoires", async () => {
    const categories = await CategoryClient.findMany({
      include: { notes: includeNotes === "true" },
    });
    return categories;
  });

  if (allCategories.length < 1) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: "Could not find any categories! Create one!",
      categories: [],
    });
  }

  return res.status(StatusCodes.OK).json({
    msg: "Successfully found all categories!",
    nbHits: allCategories.length,
    categories: allCategories,
  });
};

// GET CATEGORY BY NAME
const getCategoryByName = async (req: Request, res: Response) => {
  const { categoryName } = req.params;
  const { includeNotes } = req.query;

  if (categoryName === ":categoryName") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a category name!", category: {} });
  }

  const foundCategory = await getOrSetCache(
    `categories:${categoryName}`,
    async () => {
      const category = await CategoryClient.findUnique({
        where: { name: categoryName },
        include: { notes: includeNotes === "true" },
      });
      return category as Category & {
        notes: Note[];
      };
    }
  );

  if (!foundCategory) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `Could not find any category named ${categoryName}!`,
      category: {},
    });
  }

  return res.status(StatusCodes.OK).json({
    msg: `Successfully found category with name:${categoryName}!`,
    category: foundCategory,
  });
};

// CREATE CATEGORY
const createCategory = async (req: Request, res: Response) => {
  const categoryBody = req.body;

  if (!categoryBody.name) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a request body!", category: {} });
  }

  const createdCategory = await CategoryClient.create({
    data: { ...categoryBody },
  });

  if (!createdCategory) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid request body.", category: {} });
  }

  await deleteCache("categories");
  await setCache(`categories:${createdCategory.category_uid}`, createdCategory);

  return res.status(StatusCodes.CREATED).json({
    msg: `Successfully created category named ${createdCategory.name}!`,
    category: createdCategory,
  });
};

// UPDATE CATEGORY
const updateCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.params;
  const categoryBody = req.body;

  if (categoryName === ":categoryName") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a category name!", category: {} });
  }

  if (!categoryBody.name) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a request body!", category: {} });
  }

  const updatedCategory = await CategoryClient.update({
    where: { name: categoryName },
    data: { ...categoryBody },
  });

  if (!updatedCategory) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `Could not find category with then name:${categoryName} to be updated!`,
      category: {},
    });
  }

  await setCache(`categories:${updatedCategory.category_uid}`, updatedCategory);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully updated category with the name:${updatedCategory.name}!`,
    category: updatedCategory.name,
  });
};

// DELETE CATEGORY
const deleteCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.params;

  if (categoryName === ":categoryName") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter a category name!", category: {} });
  }

  const deletedCategory = await CategoryClient.delete({
    where: { name: categoryName },
  });

  if (!deletedCategory) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `Could not find category with the name:${categoryName}!`,
      category: {},
    });
  }

  await deleteCache(`categories:${deletedCategory.category_uid}`);

  return res.status(StatusCodes.OK).json({
    msg: `Successfully deleted category with the name: ${categoryName}!`,
    category: deletedCategory,
  });
};

// EXPORTS
export {
  getAllCategories,
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory,
};
