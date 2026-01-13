import User from "../models/user.model.js";

import bcrypt from "bcryptjs";
import generateToken from "../utils/generateTokens.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log(fullName, email, password);
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("TANVIR", hashedPassword);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 2️⃣ Check user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Generate JWT
    const token = generateToken(user);

    // 5️⃣ Send response including role
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role, // "admin" or "user"
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
export const logout = async (req, res) => {
  try {
    // JWT-based auth is stateless, so logout = frontend removes token
    // Optionally, you can also maintain a blacklist in DB if needed

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = req.user; // protect middleware set করেছে
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
