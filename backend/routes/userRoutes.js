import express from "express";
import { createUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

// Create user
router.post("/", createUser);

// Get users
router.get("/", getUsers);

export default router;