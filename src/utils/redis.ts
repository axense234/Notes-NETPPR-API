import { Note, Category, User } from "@prisma/client";
import { redisClient } from "../db/redis";

const DEF_EXP_TIME = 7200;

interface getOrSetCacheInterface {
  (
    key: string,
    cb: () =>
      | Promise<(Note & { categories: Category[] })[]>
      | Promise<Note & { categories: Category[] }>
      | Promise<User[]>
      | Promise<User>
      | string
      | null
  ): Promise<any>;
}

interface setCacheInterface {
  (
    key: string,
    data:
      | (Note & {
          categories: Category[];
        })
      | User
      | string
  ): Promise<void>;
}

// GET/SET DATA
const getOrSetCache: getOrSetCacheInterface = async (key, cb) => {
  const data = await redisClient.get(key);
  if (data !== null) {
    console.log("Cache Hit");
    return JSON.parse(data);
  }
  const freshData = await cb();
  redisClient.setEx(key, DEF_EXP_TIME, JSON.stringify(freshData));
  return freshData;
};

// SET CACHE
const setCache: setCacheInterface = async (key, data) => {
  await redisClient.setEx(key, DEF_EXP_TIME, JSON.stringify(data));
};

// DELETE CACHE
const deleteCache = async (key: string) => {
  await redisClient.del(key);
};

// CLEAR ALL CACHE WHEN USER IS DELETED
const deleteAllCache = async () => {
  await redisClient.flushAll();
};

// EXPORTS
export { getOrSetCache, deleteAllCache, setCache, deleteCache };
