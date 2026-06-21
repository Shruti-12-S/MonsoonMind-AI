import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { connectRedis } from "./config/redis.js";

const start = async () => {
  try {
    await connectDatabase();
    connectRedis();

    app.listen(env.port, () => {
      console.log(`MonsoonMind AI API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error(`Failed to start API: ${error.message}`);
    process.exit(1);
  }
};

start();
