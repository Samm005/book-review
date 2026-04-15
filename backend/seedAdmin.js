import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    const admin = new User({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();