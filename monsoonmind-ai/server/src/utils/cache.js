import { getRedis } from "../config/redis.js";
import WeatherCache from "../models/WeatherCache.js";

export const getCache = async (key) => {
  const redis = getRedis();

  if (redis) {
    try {
      const value = await redis.get(key);
      if (value) return JSON.parse(value);
    } catch (error) {
      console.warn(`Redis cache read failed for ${key}: ${error.message}`);
    }
  }

  const cached = await WeatherCache.findOne({
    key,
    expiresAt: { $gt: new Date() }
  }).lean();

  return cached?.payload || null;
};

export const setCache = async (key, payload, ttlSeconds, source = "api") => {
  const redis = getRedis();

  if (redis) {
    try {
      await redis.set(key, JSON.stringify(payload), "EX", ttlSeconds);
    } catch (error) {
      console.warn(`Redis cache write failed for ${key}: ${error.message}`);
    }
  }

  await WeatherCache.updateOne(
    { key },
    {
      key,
      payload,
      source,
      expiresAt: new Date(Date.now() + ttlSeconds * 1000)
    },
    { upsert: true }
  );
};

export const cacheKey = (...parts) =>
  parts
    .filter((part) => part !== undefined && part !== null && part !== "")
    .map((part) => String(part).trim().toLowerCase().replace(/\s+/g, "-"))
    .join(":");
