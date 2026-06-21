import CopilotHistory from "../models/CopilotHistory.js";
import FarmProfile from "../models/FarmProfile.js";
import Recommendation from "../models/Recommendation.js";
import { askAgricultureCopilot } from "../services/copilot.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const chat = asyncHandler(async (req, res) => {
  const [farmProfile, latestRecommendation] = await Promise.all([
    FarmProfile.findOne({ user: req.user._id }).lean(),
    Recommendation.findOne({ user: req.user._id }).sort({ createdAt: -1 }).lean()
  ]);

  const context = {
    farmProfile,
    latestRecommendation: latestRecommendation?.decision,
    userContext: req.body.context || {}
  };

  const response = await askAgricultureCopilot({
    question: req.body.message,
    context
  });

  const history = await CopilotHistory.create({
    user: req.user._id,
    question: req.body.message,
    answer: response.answer,
    context
  });

  res.status(201).json({
    answer: response.answer,
    guarded: response.guarded,
    id: history._id
  });
});
