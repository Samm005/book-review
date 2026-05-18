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

// CREATE REVIEW (UPDATED)
export const createReview = async (req, res) => {
  try {
    const { bookId, review, rating } = req.body;

    if (!bookId || !review || !rating) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    if (review.trim().length < 10) {
      return res.status(400).json({ message: "Review too short" });
    }

    const lowerReview = review.toLowerCase();
    const isSpam = bannedWords.some((word) => lowerReview.includes(word));

    const status = isSpam ? "pending" : "approved";

    //NEW LOGIC: CHECK EXISTING REVIEW
    const existing = await Review.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (existing) {
      existing.review = review;
      existing.rating = rating;
      existing.status = status;
      await existing.save();

      return res.json(existing);
    }

    const newReview = new Review({
      user: req.user._id,
      book: bookId,
      review,
      rating,
      status,
    });

    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET REVIEWS
export const getReviews = async (req, res) => {
  try {
    const { bookId } = req.query;

    let filter = { status: "approved" };
    if (bookId) {
      filter.book = bookId;
    }

    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .populate("book");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ REVIEW STATS
export const getReviewStats = async (req, res) => {
  try {
    const { bookId } = req.query;

    let filter = { status: "approved" };
    if (bookId) {
      filter.book = bookId;
    }

    const reviews = await Review.find(filter);

    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
      });
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRating / totalReviews).toFixed(1);

    res.json({
      averageRating,
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 FIXED UPDATE REVIEW (MAIN BUG FIX HERE)
export const updateReview = async (req, res) => {
  try {
    const { review, rating } = req.body;

    const existing = await Review.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Review not found" });
    }

    // ✅ AUTH CHECK
    if (
      existing.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // ✅ VALIDATION
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    if (review && review.trim().length < 10) {
      return res.status(400).json({ message: "Review too short" });
    }

    // ✅ UPDATE FIELDS (FIXED LOGIC)
    if (review !== undefined) {
      existing.review = review;
    }

    if (rating !== undefined) {
      existing.rating = rating;
    }

    // 🔥 OPTIONAL: RE-RUN SPAM CHECK AFTER EDIT
    const lowerReview = existing.review.toLowerCase();
    const isSpam = bannedWords.some((word) => lowerReview.includes(word));

    existing.status = isSpam ? "pending" : "approved";

    await existing.save();

    res.json(existing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE OWN REVIEW
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

// ✅ ADMIN APPROVE
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

// ✅ ADMIN DELETE
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

// ✅ REPORT REVIEW
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

// ✅ ADMIN PENDING
export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "pending" })
      .populate("user", "name email")
      .populate("book");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADMIN REPORTED
export const getReportedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      "reports.0": { $exists: true },
    })
      .populate("user", "name email")
      .populate("book");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
