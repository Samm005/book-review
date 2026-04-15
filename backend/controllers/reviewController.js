import Review from "../models/Review.js";

const bannedWords = [
  "spam",
  "scam",
  "fake",
  "fraud",
  "cheat",
  "click here",
  "buy now",
  "free money",
  "visit link",
  "subscribe now",
  "hack",
  "illegal",
  "xxx",
  "adult",
];

export const createReview = async (req, res) => {
  try {
    const { bookTitle, review, rating, author } = req.body;

    if (!bookTitle || !review || !rating || !author) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    if (review.trim().length < 10) {
      return res.status(400).json({ message: "Review too short" });
    }

    const lowerReview = review.toLowerCase();
    const isSpam = bannedWords.some((word) =>
      lowerReview.includes(word)
    );

    const status = isSpam ? "pending" : "approved";

    const newReview = new Review({
      user: req.user._id,
      bookTitle,
      review,
      rating,
      author,
      status,
    });

    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" }).populate(
      "user",
      "name email"
    );

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { bookTitle, review, rating, author } = req.body;

    const existing = await Review.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (
      existing.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    if (review && review.trim().length < 10) {
      return res.status(400).json({ message: "Review too short" });
    }

    existing.bookTitle = bookTitle || existing.bookTitle;
    existing.review = review || existing.review;
    existing.rating = rating || existing.rating;
    existing.author = author || existing.author;

    await existing.save();

    res.json(existing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOwnReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.status = "approved";
    await review.save();

    res.json({ message: "Review approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReviewAdmin = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();

    res.json({ message: "Admin deleted review" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reportReview = async (req, res) => {
  try {
    const { reason } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.reports.push({
      user: req.user._id,
      reason: reason || "No reason provided",
    });

    if (review.reports.length >= 3) {
      review.status = "pending";
    }

    await review.save();

    res.json({ message: "Review reported" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "pending" }).populate(
      "user",
      "name email"
    );

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReportedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      "reports.0": { $exists: true },
    }).populate("user", "name email");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};