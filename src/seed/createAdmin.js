import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import { connectDB } from "../utils/db.js";

dotenv.config();

const createAdmin = async () => {
  await connectDB();

  const adminExists = await User.findOne({ email: "admin@yourapp.com" });
  if (adminExists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await User.create({
    fullName: "Super Admin",
    email: "admin@yourapp.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin created successfully");
  process.exit();
};

createAdmin();
