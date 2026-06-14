import Book from "../models/Book.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

export const getStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      totalBooks,
      totalReviews,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
