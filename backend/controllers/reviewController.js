import Review from "../models/Review.js";

// Create a review
export const createReview = async (req, res) => {
  try {
    const { user, bookTitle, review, rating } = req.body;

    const newReview = new Review({
      user,
      bookTitle,
      review,
      rating,
    });

    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all reviews (for now, no filtering)
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Approve review - Admin only
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.status = "approved";
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};