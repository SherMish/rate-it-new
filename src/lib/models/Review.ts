import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [100, "Title cannot be longer than 100 characters"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Review body is required"],
      minlength: [10, "Review must be at least 10 characters long"],
      trim: true,
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    relatedWebsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Website",
      required: true,
    },
    proof: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    businessResponse: {
      text: {
        type: String,
        default: "",
        required: false,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    relatedPlan: String,
    helpfulCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;
