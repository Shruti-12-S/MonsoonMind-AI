import { Router } from "express";
import Joi from "joi";
import {
  calibrationSummary,
  liveRecommendation,
  recommendationHistory,
  seedDemoCalibrationData,
  verifyPendingRecommendations
} from "../controllers/decision.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const decisionSchema = Joi.object({
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

router.use(protect);
router.post("/live", validate(decisionSchema), liveRecommendation);
router.get("/history", recommendationHistory);
router.post("/verify-pending", verifyPendingRecommendations);
router.get("/calibration", calibrationSummary);
router.post("/dev-seed-calibration", seedDemoCalibrationData);

export default router;