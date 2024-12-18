import { messageModel } from "../models/messageModel.js";

export const messageController = {
  async sendMessage(req, res) {
    const { senderId, recipientId, content } = req.body;

    if (!senderId || !recipientId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = {
      senderId,
      recipientId,
      content,
      timestamp: new Date(),
    };

    try {
      // Auto-generate or retrieve the chatId
      const chatId = await messageModel.createOrGetChat(senderId, recipientId);

      // Save the message
      const createdMessage = await messageModel.createMessage(chatId, message);

      res.status(201).json({ chatId, id: createdMessage.id, ...message });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  },

  async getMessages(req, res) {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ error: "Chat ID is required" });
    }

    try {
      const messages = await messageModel.fetchMessages(chatId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  },

  async getChatIdByUser(req, res) {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const chatId = await messageModel.getChatIdByUser(userId);
      if (chatId) {
        res.status(200).json({ chatId });
      } else {
        res.status(404).json({ error: "Chat not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve chat ID" });
    }
  },

  async getChatsByUser(req, res) {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
  
    try {
      const chats = await messageModel.getChatsByUser(userId);
  
      if (chats.length === 0) {
        return res.status(404).json({ error: "No chats found for this user" });
      }
  
      res.status(200).json(chats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  },
  

  setupRealTimeUpdates(chatId, callback) {
    return messageModel.listenToMessages(chatId, callback);
  },
};
