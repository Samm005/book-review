import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    author: {
      type: String,
      required: true,
      index: true,
    },

    description: {
      type: String,
    },

    coverImage: {
      type: String,
    },
  },
  { timestamps: true },
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
