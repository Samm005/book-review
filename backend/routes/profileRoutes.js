import express from "express";
import {
  getProfile,
  getUserReviews,
} from "../controllers/profileController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProfile);

router.get("/reviews", protect, getUserReviews);

export default router;