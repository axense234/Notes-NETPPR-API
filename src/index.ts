import express, { Request, Response } from "express";
import * as dotenv from "dotenv";

require("express-async-errors");

// DB Connections,Middleware,Routes,Swagegr
import cors from "cors";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";

import swaggerUI from "swagger-ui-express";
import { swaggerDocs } from "./utils/swagger";

import { connectToPostgres } from "./db/postgres";
import { connectToRedis } from "./db/redis";

import notFoundMiddleware from "./middleware/notFound";
import errorHandlerMiddleware from "./middleware/errorHandler";

import authRouter from "./routes/auth";
import authorsRouter from "./routes/authors";
import notesRouter from "./routes/notes";
import categoriesRouter from "./routes/category";
import foldersRouter from "./routes/folders";
import testRouter from "./routes/test";
import styleOptionsRouter from "./routes/styleOptions";

dotenv.config();

const app = express();

app.use(express.raw());
app.use(express.json());

app.use(cors());
app.use(helmet());

app.set("trust proxy", 1);

// Limit each IP to request 3000 times in 15 mins
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 2000000,
  })
);

const PORT = process.env.PORT || 4000;

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ msg: "Hello" });
});

app.use("/", [
  authRouter,
  notesRouter,
  authorsRouter,
  categoriesRouter,
  foldersRouter,
  testRouter,
  styleOptionsRouter,
]);
app.use(errorHandlerMiddleware);
// Swagger Docs
app.use("/api/1.0.0/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(notFoundMiddleware);

const startServer = async () => {
  try {
    await connectToPostgres();
    await connectToRedis();
    app.listen(PORT, () => {
      console.log(`Server is listening on port:${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
