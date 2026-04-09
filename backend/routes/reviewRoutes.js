import express from "express";
import {
  createReview,
  getReviews,
  approveReview,
  reportReview,
  getPendingReviews,
  getReportedReviews,
  deleteReview
} from "../controllers/reviewController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getReviews);

// User
router.post("/", protect, createReview);
router.put("/:id/report", protect, reportReview);

// Admin
router.get("/pending", protect, adminOnly, getPendingReviews);
router.get("/reported", protect, adminOnly, getReportedReviews);
router.put("/:id", protect, adminOnly, approveReview);
router.delete("/:id", protect, adminOnly, deleteReview);

export default router; 