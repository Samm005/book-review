import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookTitle: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },

    // 🟢 Reporting system
    reports: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: String,
      },
    ],
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
