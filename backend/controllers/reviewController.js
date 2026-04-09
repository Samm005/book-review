import Review from "../models/Review.js";

// Create a review
export const createReview = async (req, res) => {
  try {
    const { userId, bookTitle, review, rating } = req.body;

    const newReview = new Review({
      user: userId, // store ObjectId
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

// Get only approved reviews + show user details
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" }).populate(
      "user",
      "name email",
    );

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve review - Admin only (for now manually)
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
