const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

// Crear un nuevo chat
exports.createChat = async (req, res) => {
  const { name, userEmails } = req.body;

  try {
    const users = await User.find({ email: { $in: userEmails } });
    if (users.length !== userEmails.length) {
      return res.status(404).json({ message: "One or more users not found" });
    }

    const newChat = new Chat({ name, users: users.map(user => user._id) });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los chats de un usuario
exports.getUserChats = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const chats = await Chat.find({ users: user._id }).populate('users', 'name email');
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener los mensajes de un chat
exports.getChatMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).populate('sender', 'name email');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Enviar un mensaje en un chat
exports.sendMessage = async (req, res) => {
  const { chatId, senderEmail, content } = req.body;

  try {
    const sender = await User.findOne({ email: senderEmail });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const newMessage = new Message({ chatId, sender: sender._id, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
