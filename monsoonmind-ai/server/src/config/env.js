import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../.env")
];

for (const envPath of [...new Set(envPaths)]) {
  dotenv.config({ path: envPath, override: false });
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-this-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  redisUrl: process.env.REDIS_URL || "",
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  nasaPowerUrl:
    process.env.NASA_POWER_URL ||
    "https://power.larc.nasa.gov/api/temporal/daily/point",
  openMeteoUrl:
    process.env.OPEN_METEO_URL || "https://api.open-meteo.com/v1/forecast",
  openMeteoGeocodingUrl:
    process.env.OPEN_METEO_GEOCODING_URL ||
    "https://geocoding-api.open-meteo.com/v1/search"
};
if (env.nodeEnv === "production") {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is required in production.");
  }

  if (!process.env.JWT_SECRET || env.jwtSecret === "dev-only-change-this-secret" || env.jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be set to a long random value in production.");
  }

  if (!process.env.CLIENT_URL || env.clientUrl.includes("localhost")) {
    throw new Error("CLIENT_URL must be set to the deployed frontend URL in production.");
  }
}
