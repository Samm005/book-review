import express from "express";
import {
  createReview,
  getReviews,
  approveReview,
} from "../controllers/reviewController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getReviews);

// Logged-in users
router.post("/", protect, createReview);

// Admin only
router.put("/:id", protect, adminOnly, approveReview);

export default router;