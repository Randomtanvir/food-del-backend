import express from "express";

import { adminOnly, protect } from "../middleware/auth.middleware.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
  updateOrderStatus,
  placeOrderCOD,
} from "../controllers/order.controller.js";
import Stripe from "stripe";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

const router = express.Router();

// User actions
router.get("/myorder", protect, getUserOrders);
router.post("/cod", protect, placeOrderCOD);
// Admin actions
router.get("/all", getAllOrders);
// Admin updates order status
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata.orderId;
      const userId = session.metadata.userId;

      // update order
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
      });

      // clear cart
      await User.findByIdAndUpdate(userId, {
        cart: [],
      });

      console.log(
        userId,
        "tanvkfkdsjfklsdjfklas===============================",
      );
      // const user = await User.findById(userId);
      // if (user) {
      //   user.cart = [];
      //   await user.save();
      // }
    }

    res.json({ received: true });
  },
);

router.post("/place", protect, placeOrder);

export default router;
