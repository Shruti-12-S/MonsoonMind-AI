import { Router } from "express";
import Joi from "joi";
import {
  currentWeather,
  forecastWeather,
  geocode,
  historicalRainfall
} from "../controllers/weather.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const locationQuerySchema = Joi.object({
  city: Joi.string().max(120),
  district: Joi.string().max(120).allow("", null),
  state: Joi.string().max(120).allow("", null),
  pincode: Joi.string().pattern(/^\d{6}$/).allow("", null),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180)
}).or("city", "pincode", "latitude");

router.use(protect);
router.get("/geocode", validate(locationQuerySchema, "query"), geocode);
router.get("/current", validate(locationQuerySchema, "query"), currentWeather);
router.get("/forecast", validate(locationQuerySchema, "query"), forecastWeather);
router.get(
  "/historical-rainfall",
  validate(locationQuerySchema, "query"),
  historicalRainfall
);

export default router;
