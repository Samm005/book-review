import express from "express";

import {
  getStats,
  getUsers,
  deleteUser,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getStats);

router.get("/users", protect, adminOnly, getUsers);

router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
