import { ApiError } from "../utils/ApiError.js";

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const payload = {
    message: error.message || "Internal server error",
    statusCode
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (statusCode >= 500) {
    console.error(`[${statusCode}] ${payload.message}`);
    if (error.details) {
      console.error(error.details);
    }
  }

  if (process.env.NODE_ENV !== "production" && !(error instanceof ApiError)) {
    payload.stack = error.stack;
  }

  res.status(statusCode).json(payload);
};