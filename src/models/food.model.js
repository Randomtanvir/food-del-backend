import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      required: true,
    },

    calories: {
      type: String,
      default: "",
    },

    prepTime: {
      type: String,
      default: "",
    },

    isVegan: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      required: true,
    },

    ingredients: [ingredientSchema],

    isAvailable: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);
export default Food;
