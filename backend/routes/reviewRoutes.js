import express from "express";
import {
  createReview,
  getReviews,
  updateReview,
  deleteOwnReview,
  approveReview,
  reportReview,
  getPendingReviews,
  getReportedReviews,
  deleteReviewAdmin
} from "../controllers/reviewController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getReviews);

router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteOwnReview);
router.put("/:id/report", protect, reportReview);

router.put("/approve/:id", protect, adminOnly, approveReview);
router.delete("/admin/:id", protect, adminOnly, deleteReviewAdmin);
router.get("/pending", protect, adminOnly, getPendingReviews);
router.get("/reported", protect, adminOnly, getReportedReviews);

export default router;