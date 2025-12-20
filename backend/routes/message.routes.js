import express from "express";
import { getMessages, sendMessage, getConversations, markConversationRead, deleteConversation } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, upload.single("file"), sendMessage);
router.post("/conversations/:id/read", protectRoute, markConversationRead);
router.delete("/conversations/:id", protectRoute, deleteConversation);

export default router;
