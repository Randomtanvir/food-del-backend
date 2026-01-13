import express from "express";
import {
  createFood,
  deleteFood,
  getAllFoods,
  getSingleFood,
  updateFood,
} from "../controllers/food.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { uploadSingleImage } from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/", protect, adminOnly, uploadSingleImage("image"), createFood);
router.put("/:id", protect, adminOnly, updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);

// get
router.get("/", getAllFoods);
router.get("/:id", getSingleFood);

export default router;
