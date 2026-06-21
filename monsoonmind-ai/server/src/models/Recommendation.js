import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    farmProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FarmProfile"
    },
    request: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    decision: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    recommendation: {
      type: String,
      enum: ["SOW", "WAIT"],
      required: true,
      index: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    signalStrength: {
      type: Number,
      min: 0,
      max: 100
    },
    verification: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    outcome: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    locationKey: {
      type: String,
      index: true
    }
  },
  { timestamps: true }
);

recommendationSchema.index({ user: 1, createdAt: -1 });
recommendationSchema.index({ "verification.status": 1, "verification.dueAt": 1 });

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

export default Recommendation;