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

export const deleteUser = async (req, res) => {
  try {
    // Prevent admin deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await Review.deleteMany({
      user: user._id,
    });

    await user.deleteOne();

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
