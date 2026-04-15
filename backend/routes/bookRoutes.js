import express from "express";
import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);

router.post("/", protect, adminOnly, addBook);
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

export default router;