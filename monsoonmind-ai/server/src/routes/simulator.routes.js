import { Router } from "express";
import Joi from "joi";
import { runSimulator } from "../controllers/simulator.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const simulatorSchema = Joi.object({
  crop: Joi.string().required(),
  landSize: Joi.number().positive().required(),
  landUnit: Joi.string().valid("acre", "hectare").default("acre"),
  irrigationAvailable: Joi.boolean().default(false),
  expectedMarketPrice: Joi.number().positive().required(),
  rainDelay: Joi.number().min(0).max(30).required()
});

router.post("/run", protect, validate(simulatorSchema), runSimulator);

export default router;
