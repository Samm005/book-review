import Review from "../models/Review.js";

//   Expanded spam words list
const bannedWords = [
  "spam", "scam", "fake", "fraud", "cheat",
  "click here", "buy now", "free money",
  "visit link", "subscribe now", "hack",
  "illegal", "xxx", "adult"
];

//   CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { bookTitle, review, rating } = req.body;

    // ✅ Validation
    if (!bookTitle || !review || !rating) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    if (review.trim().length < 10) {
      return res.status(400).json({ message: "Review too short" });
    }

    //   Spam detection
    const lowerReview = review.toLowerCase();
    const isSpam = bannedWords.some(word =>
      lowerReview.includes(word)
    );

    const status = isSpam ? "pending" : "approved";

    const newReview = new Review({
      user: req.user._id,
      bookTitle,
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



//   GET APPROVED REVIEWS (PUBLIC)
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" })
      .populate("user", "name email");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//   APPROVE REVIEW (ADMIN)
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


//   REPORT REVIEW (USER)
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

    //   Auto-hide if too many reports
    if (review.reports.length >= 3) {
      review.status = "pending";
    }

    await review.save();

    res.json({ message: "Review reported" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🟡 GET PENDING REVIEWS (ADMIN)
export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "pending" })
      .populate("user", "name email");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🟡 GET REPORTED REVIEWS (ADMIN)
export const getReportedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ "reports.0": { $exists: true } })
      .populate("user", "name email");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔴 DELETE REVIEW (ADMIN)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};