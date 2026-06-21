import Redis from "ioredis";
import { env } from "./env.js";

let redisClient = null;

export const connectRedis = () => {
  if (!env.redisUrl) {
    console.warn("REDIS_URL not set; API will use MongoDB-only cache fallback.");
    return null;
  }

  redisClient = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
    lazyConnect: false
  });

  redisClient.on("connect", () => console.log("Redis connected"));
  redisClient.on("error", (error) =>
    console.warn(`Redis unavailable: ${error.message}`)
  );

  return redisClient;
};

export const getRedis = () => redisClient;
