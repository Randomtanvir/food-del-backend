import express from "express";
import {
  logout,
  update,
  checkLoginController,
  register,
  login,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { uploadSingleImage } from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh");
router.get("/logout", logout);
router.patch("/update", protectedRoute, uploadSingleImage("image"), update);
router.get("/check-login", protectedRoute, checkLoginController);

export default router;
