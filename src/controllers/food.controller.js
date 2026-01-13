import Food from "../models/food.model.js";
import { uploadImageInCloudinary } from "../utils/cloudinary.js";

export const createFood = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      calories,
      prepTime,
      isVegan,
      ingredients,
      rating,
      reviews,
    } = req.body;

    // Image check
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Upload image to Cloudinary
    const uploaded = await uploadImageInCloudinary(req.file, "food");

    const food = await Food.create({
      name,
      price,
      description,
      calories,
      prepTime,
      isVegan,
      rating,
      reviews,
      image: uploaded.secure_url, // Cloudinary URL
      ingredients: JSON.parse(ingredients), // form-data sends string
      createdBy: req.user._id, // admin id
    });

    res.status(201).json({
      success: true,
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Food create failed" });
  }
};

export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    Object.assign(food, req.body);

    await food.save();

    return res.json({
      success: true,
      message: "Food updated successfully",
      food,
    });
  } catch (err) {
    console.error("UPDATE FOOD ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update food",
    });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    await food.deleteOne();

    return res.json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (err) {
    console.error("DELETE FOOD ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete food",
    });
  }
};

export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true })
      .sort({ createdAt: -1 })
      .populate("createdBy", "fullName email");

    res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch foods",
    });
  }
};

export const getSingleFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate(
      "createdBy",
      "fullName",
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid food id",
    });
  }
};
