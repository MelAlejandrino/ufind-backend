import express from 'express';
import { messageController } from "../controllers/messageController.js";

const router = express.Router();

// Send a message
router.post("/messages", messageController.sendMessage);

// Fetch all messages in a chat
router.get("/messages/:chatId", messageController.getMessages);

// Get chat ID based on userId
router.post("/getChatId", messageController.getChatIdByUser);

router.post("/getChats", messageController.getChatsByUser);


export default router;
