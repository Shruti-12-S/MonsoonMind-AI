import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import copilotRoutes from "./routes/copilot.routes.js";
import decisionRoutes from "./routes/decision.routes.js";
import farmRoutes from "./routes/farm.routes.js";
import riskRoutes from "./routes/risk.routes.js";
import simulatorRoutes from "./routes/simulator.routes.js";
import weatherRoutes from "./routes/weather.routes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "MonsoonMind AI API",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/farm", farmRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/recommendation", decisionRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/simulator", simulatorRoutes);
app.use("/api/copilot", copilotRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
