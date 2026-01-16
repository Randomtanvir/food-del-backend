import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
      quantity: Number,
    },
  ],

  deliveryInfo: {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
  },

  subtotal: Number,
  deliveryFee: Number,
  totalPrice: Number,

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "cod"],
    default: "pending",
  },

  status: {
    type: String,
    default: "processing",
  },

  stripeSessionId: String,
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
