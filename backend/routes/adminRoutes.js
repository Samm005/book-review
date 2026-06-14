import express from "express";
import { getStats } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/stats",
  protect,
  adminOnly,
  getStats
);

export default router;