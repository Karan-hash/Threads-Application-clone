// services/messageService.js
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { v2 as cloudinary } from "cloudinary";
import { getRecipientSocketId, io } from "../socket/socket.js";

const sendMessageService = async ({ senderId, recipientId, message, img }) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, recipientId] },
  });

  if (!conversation) {
    conversation = new Conversation({
      participants: [senderId, recipientId],
      lastMessage: {
        text: message,
        sender: senderId,
      },
    });
    await conversation.save();
  }

  if (img) {
    const uploadedResponse = await cloudinary.uploader.upload(img);
    img = uploadedResponse.secure_url;
  }

  const newMessage = new Message({
    conversationId: conversation._id,
    sender: senderId,
    text: message,
    img: img || "",
  });

  await Promise.all([
    newMessage.save(),
    conversation.updateOne({
      lastMessage: {
        text: message,
        sender: senderId,
      },
    }),
  ]);

  const recipientSocketId = getRecipientSocketId(recipientId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit("newMessage", newMessage);
  }

  return newMessage;
};

const getMessagesService = async (userId, otherUserId) => {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });
  
    if (!conversation) {
      throw new Error("Conversation not found");
    }
  
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });
  
    return messages;
  };
const getConversationsService = async (userId) => {
    const conversations = await Conversation.find({ participants: userId }).populate({
      path: 'participants',
      select: 'username profilePic',
    });
  
    // Remove the current user from the participants array
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });
  
    return conversations;
  };
export {
    sendMessageService,
    getMessagesService,
    getConversationsService
}
