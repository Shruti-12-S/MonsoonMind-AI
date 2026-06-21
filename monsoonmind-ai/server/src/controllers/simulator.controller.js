import SimulationHistory from "../models/SimulationHistory.js";
import { generateScenarioCurve } from "../services/simulator.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const runSimulator = asyncHandler(async (req, res) => {
  const result = generateScenarioCurve(req.body);
  const history = await SimulationHistory.create({
    user: req.user._id,
    input: req.body,
    result
  });

  res.status(201).json({ simulation: result, id: history._id });
});
