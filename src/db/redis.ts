import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://red-cetdhco2i3mj6pi0ra20:6379",
});

const connectToRedis = async () => {
  await redisClient.connect();
};

export { redisClient, connectToRedis };
