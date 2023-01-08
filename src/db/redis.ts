import { createClient } from "redis";

const redisClient = createClient();

const connectToRedis = async () => {
  await redisClient.connect();
};

export { redisClient, connectToRedis };
