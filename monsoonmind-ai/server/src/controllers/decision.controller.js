import { env } from "../config/env.js";
import FarmProfile from "../models/FarmProfile.js";
import Recommendation from "../models/Recommendation.js";
import {
  buildDecisionTimeline,
  generateDecision
} from "../services/decisionEngine.service.js";
import {
  buildInitialVerification,
  verifyRecommendationOutcome
} from "../services/outcomeVerification.service.js";
import { getWeatherBundle } from "../services/weather.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const buildDemoRecommendation = (userId, index) => {
  const createdAt = new Date(Date.now() - (index + 12) * 24 * 60 * 60 * 1000);
  const isSow = index % 3 !== 0;
  const correct = index % 5 !== 0;
  const recommendation = isSow ? "SOW" : "WAIT";
  const observedRainfall = isSow
    ? correct
      ? 38 + (index % 14)
      : 8 + (index % 9)
    : correct
      ? 5 + (index % 10)
      : 34 + (index % 16);
  const signalStrength = 58 + (index % 39);
  const rainfallDeficit = Math.max(0, Math.round(62 - observedRainfall));
  const riskScore = Math.min(95, Math.max(8, Math.round(rainfallDeficit * 0.8 + (isSow ? 8 : 18))));
  const expectedYield = Number((24 - riskScore * 0.09 + (index % 4)).toFixed(2));
  const expectedIncome = Math.round(expectedYield * 4500);

  return {
    user: userId,
    request: {
      demoSeed: true,
      crop: index % 2 === 0 ? "soybean" : "cotton",
      landSize: 5,
      landUnit: "acre",
      irrigationAvailable: index % 4 === 0,
      expectedMarketPrice: 4500,
      city: "Demo Farm",
      state: "Maharashtra"
    },
    decision: {
      recommendation,
      confidence: signalStrength,
      signalStrength,
      confidenceCalibration: {
        status: "demo",
        displayLabel: "Signal strength",
        message: "Demo calibration data for local testing only.",
        minimumVerifiedRecommendations: 500
      },
      rainfallDeficit,
      rainfallTrend: index % 2 === 0 ? "improving" : "stable",
      expectedRainfallWindow: isSow ? "1-3 Days" : "No reliable 7-day rainfall window",
      bestSowingWindow: isSow ? "Demo sowing window" : "Wait for stronger rain",
      reason: isSow
        ? "Demo: rainfall timing and water risk were supportive enough to sow."
        : "Demo: rainfall support was weak, so waiting was safer.",
      expectedYield,
      expectedYieldRange: {
        low: Number((expectedYield * 0.82).toFixed(2)),
        high: Number((expectedYield * 1.18).toFixed(2))
      },
      expectedIncome,
      expectedIncomeRange: {
        low: Math.round(expectedIncome * 0.82),
        high: Math.round(expectedIncome * 1.18)
      },
      cropUnit: "quintal",
      risk: {
        monsoonHealth: Math.max(0, 100 - riskScore),
        rainDelay: isSow ? 18 : 72,
        cropRisk: riskScore,
        waterStress: riskScore,
        droughtRisk: Math.min(100, riskScore + 8),
        overallRiskScore: riskScore,
        level: riskScore < 35 ? "Low" : riskScore < 65 ? "Moderate" : "High",
        confidence: signalStrength,
        signalStrength
      }
    },
    recommendation,
    confidence: signalStrength,
    signalStrength,
    verification: {
      status: "verified",
      dueAt: createdAt,
      lastCheckedAt: new Date(),
      method: "demo seed observed rainfall check"
    },
    outcome: {
      status: "verified",
      verifiedAt: new Date(),
      correct,
      observedRainfall7Days: observedRainfall,
      triggerRainfallMet: observedRainfall >= 8,
      sufficientRainfall: observedRainfall >= 21,
      longestDrySpell: observedRainfall >= 21 ? 1 + (index % 3) : 4 + (index % 3),
      observedWindow: {
        start: createdAt.toISOString().slice(0, 10),
        end: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      },
      observedSource: "demo-seed",
      reason: correct
        ? `Demo: the ${recommendation} call matched observed rainfall support.`
        : `Demo: the ${recommendation} call did not match observed rainfall support.`
    },
    locationKey: "demo-calibration",
    createdAt,
    updatedAt: createdAt
  };
};
const buildDecisionInput = async (userId, body) => {
  const profile = await FarmProfile.findOne({ user: userId });
  const source = {
    ...(profile ? profile.toObject() : {}),
    ...body
  };

  const latitude = body.latitude ?? source.coordinates?.latitude;
  const longitude = body.longitude ?? source.coordinates?.longitude;

  if (!source.crop || !source.landSize || !source.expectedMarketPrice) {
    throw new ApiError(
      400,
      "Crop, land size, and expected market price are required."
    );
  }

  if (!source.city && !source.pincode && (latitude === undefined || longitude === undefined)) {
    throw new ApiError(400, "Provide a PIN code, city, or latitude/longitude.");
  }

  return {
    farmProfile: profile,
    city: source.city,
    district: source.district,
    state: source.state,
    pincode: source.pincode,
    latitude,
    longitude,
    crop: source.crop,
    landSize: source.landSize,
    landUnit: source.landUnit || "acre",
    irrigationAvailable: Boolean(source.irrigationAvailable),
    expectedMarketPrice: source.expectedMarketPrice
  };
};

export const liveRecommendation = asyncHandler(async (req, res) => {
  const input = await buildDecisionInput(req.user._id, req.body);
  const locationInput = {
    city: input.city,
    district: input.district,
    state: input.state,
    pincode: input.pincode,
    latitude: input.latitude,
    longitude: input.longitude
  };
  const weatherBundle = await getWeatherBundle(locationInput);
  const previous = await Recommendation.findOne({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  const decision = generateDecision({
    weatherBundle,
    crop: input.crop,
    landSize: input.landSize,
    landUnit: input.landUnit,
    irrigationAvailable: input.irrigationAvailable,
    expectedMarketPrice: input.expectedMarketPrice
  });

  decision.timeline = buildDecisionTimeline(previous, decision);

  const saved = await Recommendation.create({
    user: req.user._id,
    farmProfile: input.farmProfile?._id,
    request: input,
    decision,
    recommendation: decision.recommendation,
    confidence: decision.confidence,
    signalStrength: decision.signalStrength,
    verification: buildInitialVerification(),
    locationKey: `${weatherBundle.location.latitude},${weatherBundle.location.longitude}`
  });

  res.status(201).json({
    recommendation: saved.decision,
    id: saved._id
  });
});

export const recommendationHistory = asyncHandler(async (req, res) => {
  const history = await Recommendation.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  res.status(200).json({ history });
});

export const verifyPendingRecommendations = asyncHandler(async (req, res) => {
  const pending = await Recommendation.find({
    user: req.user._id,
    $or: [
      { "verification.status": "pending", "verification.dueAt": { $lte: new Date() } },
      { verification: null, createdAt: { $lte: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) } }
    ]
  })
    .sort({ createdAt: 1 })
    .limit(25);

  const verified = [];
  const failed = [];

  for (const item of pending) {
    try {
      const outcome = await verifyRecommendationOutcome(item.toObject());
      item.outcome = outcome;
      item.verification = {
        ...(item.verification || {}),
        status: "verified",
        lastCheckedAt: new Date(),
        error: null
      };
      await item.save();
      verified.push({ id: item._id, outcome });
    } catch (error) {
      item.verification = {
        ...(item.verification || {}),
        status: "failed",
        lastCheckedAt: new Date(),
        error: error.message
      };
      await item.save();
      failed.push({ id: item._id, error: error.message });
    }
  }

  res.status(200).json({
    checked: pending.length,
    verified,
    failed
  });
});

export const calibrationSummary = asyncHandler(async (req, res) => {
  const [verified, correct] = await Promise.all([
    Recommendation.countDocuments({ user: req.user._id, "outcome.status": "verified" }),
    Recommendation.countDocuments({ user: req.user._id, "outcome.status": "verified", "outcome.correct": true })
  ]);

  res.status(200).json({
    status: verified >= 500 ? "ready-for-calibration" : "collecting-outcomes",
    verifiedRecommendations: verified,
    minimumForCalibration: 500,
    observedAccuracy: verified ? Number(((correct / verified) * 100).toFixed(1)) : null,
    note:
      verified >= 500
        ? "Enough outcomes exist to fit a calibrated probability model."
        : "Keep using signal strength until enough recommendations are verified against observed rainfall."
  });
});
export const seedDemoCalibrationData = asyncHandler(async (req, res) => {
  if (env.nodeEnv === "production") {
    throw new ApiError(403, "Demo calibration seed is disabled in production.");
  }

  const recordsToCreate = 520;
  await Recommendation.deleteMany({
    user: req.user._id,
    "request.demoSeed": true
  });

  const records = Array.from({ length: recordsToCreate }, (_, index) =>
    buildDemoRecommendation(req.user._id, index)
  );
  await Recommendation.insertMany(records);
  const correct = records.filter((item) => item.outcome.correct).length;

  res.status(201).json({
    inserted: records.length,
    correct,
    observedAccuracy: Number(((correct / records.length) * 100).toFixed(1)),
    message: "Demo calibration records added for this user."
  });
});