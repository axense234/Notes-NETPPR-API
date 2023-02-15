// Redis and Dotenv
import { createClient } from "redis";
import * as dotenv from "dotenv";

dotenv.config();

const redisClient = createClient(
  {
    url: process.env.REDIS_INSTANCE_URL,
  } || undefined
);

const connectToRedis = async () => {
  await redisClient.connect();
};

export { redisClient, connectToRedis };
