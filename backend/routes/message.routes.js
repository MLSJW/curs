import express from "express";
import { getMessages, sendMessage, getConversations } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, upload.single("file"), sendMessage);

export default router;
