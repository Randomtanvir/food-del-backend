import express from "express";

const router = express.Router();

router.get("/food", () => {
  console.log("food");
});

export default router;
