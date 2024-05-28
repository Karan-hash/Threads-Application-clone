// controllers/messageController.js
import { sendMessageService, getMessagesService, getConversationsService } from "../services/messageService.js";

const sendMessage = async (req, res) => {
  try {
    const { recipientId, message, img } = req.body;
    const senderId = req.user._id;

    const newMessage = await sendMessageService({ senderId, recipientId, message, img });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getMessages = async(req, res) => {
    try {
        const { otherUserId } = req.params;
        const userId = req.user._id;
    
        if (!otherUserId) {
          return res.status(400).json({ error: "Other user ID is required" });
        }
    
        const messages = await getMessagesService(userId, otherUserId);
    
        res.status(200).json(messages);
      } catch (error) {
        if (error.message === "Conversation not found") {
          res.status(404).json({ error: "Conversation not found" });
        } else {
          res.status(500).json({ error: error.message });
        }
      }
}
const getConversations = async(req, res) => {
    try {
        const userId = req.user._id;
    
        const conversations = await getConversationsService(userId);
    
        res.status(200).json(conversations);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}
export {
  sendMessage,
  getMessages,
  getConversations
};