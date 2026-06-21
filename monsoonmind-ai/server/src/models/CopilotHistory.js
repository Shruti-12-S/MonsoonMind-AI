import mongoose from "mongoose";

const copilotHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    question: {
      type: String,
      required: true,
      maxlength: 1000
    },
    answer: {
      type: String,
      required: true
    },
    context: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

copilotHistorySchema.index({ user: 1, createdAt: -1 });

const CopilotHistory = mongoose.model("CopilotHistory", copilotHistorySchema);

export default CopilotHistory;
