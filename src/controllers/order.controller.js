import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const DELIVERY_FEE = 2;

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
    } = req.body;

    const user = await User.findById(userId).populate("cart.food");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ---- Calculate price ----
    let subtotal = 0;

    const items = user.cart.map((item) => {
      subtotal += item.food.price * item.quantity;

      return {
        food: item.food._id,
        quantity: item.quantity,
      };
    });

    const totalPrice = subtotal + DELIVERY_FEE;

    // ---- Create order (pending) ----
    const order = await Order.create({
      user: userId,
      items,

      deliveryInfo: {
        firstName,
        lastName,
        email,
        street,
        city,
        state,
        zipCode,
        country,
        phone,
      },

      subtotal,
      deliveryFee: DELIVERY_FEE,
      totalPrice,

      paymentStatus: "paid",
    });

    // ---- Stripe line items ----
    const line_items = user.cart.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.food.name,
        },
        unit_amount: Math.round(item.food.price * 100),
      },
      quantity: item.quantity,
    }));

    // delivery fee line
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Fee",
        },
        unit_amount: DELIVERY_FEE * 100,
      },
      quantity: 1,
    });

    // ---- Create Stripe Session ----
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items,

      mode: "payment",

      success_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,

      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    // save session id
    order.stripeSessionId = session.id;
    await order.save();

    await User.findByIdAndUpdate(userId, {
      cart: [],
    });

    res.json({
      success: true,
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("items.food")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.food")
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // expected: "Pending", "Preparing", "Delivered", "Cancelled"
    const orderId = req.params.id;

    const validStatuses = ["Pending", "Preparing", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
    } = req.body;

    // find user and populate cart
    const user = await User.findById(userId).populate("cart.food");
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate subtotal
    let subtotal = 0;
    const items = user.cart.map((item) => {
      subtotal += item.food.price * item.quantity;
      return {
        food: item.food._id,
        quantity: item.quantity,
      };
    });

    const totalPrice = subtotal + DELIVERY_FEE;

    // create order
    const order = await Order.create({
      user: userId,
      items,
      deliveryInfo: {
        firstName,
        lastName,
        email,
        street,
        city,
        state,
        zipCode,
        country,
        phone,
      },
      subtotal,
      deliveryFee: DELIVERY_FEE,
      totalPrice,
      paymentStatus: "cod", // Cash on Delivery
    });

    // clear user cart
    user.cart = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully (Cash on Delivery)",
      order,
    });
  } catch (error) {
    console.error("COD ORDER ERROR:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};
