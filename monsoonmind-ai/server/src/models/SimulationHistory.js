import mongoose from "mongoose";

const simulationHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
);

simulationHistorySchema.index({ user: 1, createdAt: -1 });

const SimulationHistory = mongoose.model(
  "SimulationHistory",
  simulationHistorySchema
);

export default SimulationHistory;
