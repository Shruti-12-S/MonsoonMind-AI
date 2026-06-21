import mongoose from "mongoose";

const farmProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    farmName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    city: {
      type: String,
      trim: true,
      maxlength: 100
    },
    district: {
      type: String,
      trim: true,
      maxlength: 100
    },
    state: {
      type: String,
      trim: true,
      maxlength: 100
    },
    pincode: {
      type: String,
      trim: true,
      maxlength: 6
    },
    coordinates: {
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 }
    },
    crop: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    landSize: {
      type: Number,
      required: true,
      min: 0.1
    },
    landUnit: {
      type: String,
      enum: ["acre", "hectare"],
      default: "acre"
    },
    irrigationAvailable: {
      type: Boolean,
      default: false
    },
    expectedMarketPrice: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { timestamps: true }
);

farmProfileSchema.index({ "coordinates.latitude": 1, "coordinates.longitude": 1 });

const FarmProfile = mongoose.model("FarmProfile", farmProfileSchema);

export default FarmProfile;
