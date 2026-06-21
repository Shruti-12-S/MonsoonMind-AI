import { Router } from "express";
import Joi from "joi";
import { liveRisk } from "../controllers/risk.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const riskSchema = Joi.object({
  city: Joi.string().max(120).allow("", null),
  district: Joi.string().max(120).allow("", null),
  state: Joi.string().max(120).allow("", null),
  pincode: Joi.string().pattern(/^\d{6}$/).allow("", null),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  crop: Joi.string(),
  landSize: Joi.number().positive(),
  landUnit: Joi.string().valid("acre", "hectare").default("acre"),
  irrigationAvailable: Joi.boolean(),
  expectedMarketPrice: Joi.number().positive()
});

router.post("/live", protect, validate(riskSchema), liveRisk);

export default router;
