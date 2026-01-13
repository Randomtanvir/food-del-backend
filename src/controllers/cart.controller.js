import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
  const { foodId } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  const itemIndex = user.cart.findIndex(
    (item) => item.food.toString() === foodId
  );

  if (itemIndex > -1) {
    // already in cart → increase quantity
    user.cart[itemIndex].quantity += 1;
  } else {
    // new item
    user.cart.push({ food: foodId, quantity: 1 });
  }

  await user.save();

  res.json({
    success: true,
    message: "Added to cart",
    cart: user.cart,
  });
};

export const removeFromCart = async (req, res) => {
  const { foodId } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  const itemIndex = user.cart.findIndex(
    (item) => item.food.toString() === foodId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  if (user.cart[itemIndex].quantity > 1) {
    user.cart[itemIndex].quantity -= 1;
  } else {
    // quantity = 1 → remove item
    user.cart.splice(itemIndex, 1);
  }

  await user.save();

  res.json({
    success: true,
    message: "Cart updated",
    cart: user.cart,
  });
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate("cart.food") // fetch food details
      .select("cart");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};
