import express from "express";

import { adminOnly, protect } from "../middleware/auth.middleware.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

// User actions
router.post("/", protect, placeOrder);
router.get("/myorder", protect, getUserOrders);

// Admin actions
router.get("/all", protect, adminOnly, getAllOrders);
// Admin updates order status
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
