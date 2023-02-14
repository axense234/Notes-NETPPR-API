import express from "express";

// Controllers and Middleware
import { deleteAll, insertAll } from "../controllers/test";
import authenticationMiddleware from "../middleware/authentication";

const router = express.Router();

router.delete("/deleteAll", authenticationMiddleware, deleteAll);
router.post("/insertAll", authenticationMiddleware, insertAll);

// EXPORTS
export default router;
