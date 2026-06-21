import FarmProfile from "../models/FarmProfile.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createFarmProfile = asyncHandler(async (req, res) => {
  const profile = await FarmProfile.findOneAndUpdate(
    { user: req.user._id },
    { ...req.body, user: req.user._id },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ profile });
});

export const getFarmProfile = asyncHandler(async (req, res) => {
  const profile = await FarmProfile.findOne({ user: req.user._id });
  res.status(200).json({ profile });
});

export const updateFarmProfile = asyncHandler(async (req, res) => {
  const profile = await FarmProfile.findOneAndUpdate(
    { user: req.user._id },
    { ...req.body, user: req.user._id },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ profile });
});
