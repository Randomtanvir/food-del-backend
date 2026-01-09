import express from "express";
import { register } from "../controllers/auth.controller.js";
import { doChatWithAi } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/chat", doChatWithAi);
router.post("/chat/send", register);

export default router;
