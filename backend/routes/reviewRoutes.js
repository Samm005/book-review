import express from "express";
import {
  createReview,
  getReviews,
  approveReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// Create review
router.post("/", createReview);

// Get all reviews
router.get("/", getReviews);

// Approve review
router.put("/:id", approveReview);

export default router;