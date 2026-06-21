import { Router } from "express";
import Joi from "joi";
import { chat } from "../controllers/copilot.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const chatSchema = Joi.object({
  message: Joi.string().min(4).max(1000).required(),
  context: Joi.object().unknown(true)
});

router.post("/chat", protect, validate(chatSchema), chat);

export default router;
