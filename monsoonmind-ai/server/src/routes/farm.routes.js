import { Router } from "express";
import Joi from "joi";
import {
  createFarmProfile,
  getFarmProfile,
  updateFarmProfile
} from "../controllers/farm.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const farmSchema = Joi.object({
  farmName: Joi.string().max(100).allow("", null),
  city: Joi.string().max(100).allow("", null),
  district: Joi.string().max(100).allow("", null),
  state: Joi.string().max(100).allow("", null),
  pincode: Joi.string().pattern(/^\d{6}$/).allow("", null),
  coordinates: Joi.object({
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180)
  }),
  crop: Joi.string().required(),
  landSize: Joi.number().positive().required(),
  landUnit: Joi.string().valid("acre", "hectare").default("acre"),
  irrigationAvailable: Joi.boolean().default(false),
  expectedMarketPrice: Joi.number().positive().required()
}).or("city", "pincode", "coordinates");

router.use(protect);
router.post("/", validate(farmSchema), createFarmProfile);
router.get("/", getFarmProfile);
router.put("/", validate(farmSchema), updateFarmProfile);

export default router;
