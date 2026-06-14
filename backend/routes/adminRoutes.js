import express from "express";
import { getStats, getUsers } from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getStats);

router.get("/users", protect, adminOnly, getUsers);

export default router;
