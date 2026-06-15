import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
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
      index: true,
    },

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

reviewSchema.index({ user: 1, book: 1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
