const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Crear un nuevo chat
router.post('/', chatController.createChat);

// Obtener todos los chats de un usuario
router.get('/user/:email', chatController.getUserChats);

// Obtener los mensajes de un chat
router.get('/:chatId/messages', chatController.getChatMessages);

// Enviar un mensaje en un chat
router.post('/messages', chatController.sendMessage);

module.exports = router;
