import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", protect, addToCart); // ➕
router.post("/remove", protect, removeFromCart); // ➖
router.get("/", protect, getCart);

export default router;
