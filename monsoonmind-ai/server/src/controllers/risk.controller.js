import FarmProfile from "../models/FarmProfile.js";
import { generateDecision } from "../services/decisionEngine.service.js";
import { getWeatherBundle } from "../services/weather.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const liveRisk = asyncHandler(async (req, res) => {
  const profile = await FarmProfile.findOne({ user: req.user._id });
  const source = {
    ...(profile ? profile.toObject() : {}),
    ...req.body
  };
  const latitude = req.body.latitude ?? source.coordinates?.latitude;
  const longitude = req.body.longitude ?? source.coordinates?.longitude;

  if (!source.city && !source.pincode && (latitude === undefined || longitude === undefined)) {
    throw new ApiError(400, "Provide a PIN code, city, or latitude/longitude.");
  }

  const weatherBundle = await getWeatherBundle({
    city: source.city,
    district: source.district,
    state: source.state,
    pincode: source.pincode,
    latitude,
    longitude
  });
  const decision = generateDecision({
    weatherBundle,
    crop: source.crop,
    landSize: source.landSize,
    landUnit: source.landUnit || "acre",
    irrigationAvailable: Boolean(source.irrigationAvailable),
    expectedMarketPrice: source.expectedMarketPrice
  });

  res.status(200).json({
    risk: decision.risk,
    confidenceMeter: decision.confidenceMeter,
    explainability: decision.explainability,
    rainfall: {
      deficit: decision.rainfallDeficit,
      anomaly: decision.rainfallAnomaly,
      trend: decision.rainfallTrend
    }
  });
});
