const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const authRouter = require('./routes/authRoutes');
const balanceRoute = require('./routes/balanceRoute');
const transactionRoutes = require('./routes/transactionRoute');
const friendRoutes = require('./routes/friendRoutes');
const chatRoutes = require('./routes/chatRoutes'); // Importar las rutas de chat

// Middlewares
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Cambia esto según sea necesario para tu configuración de CORS
  },
});

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api', balanceRoute);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', friendRoutes);
app.use('/api/chats', chatRoutes); // Agregar las rutas de chat

// MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Conexion a la base de datos con exito'))
  .catch((error) => console.error(error));

// Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`Usuario con ID: ${socket.id} se unió al chat: ${chatId}`);
  });

  socket.on('send_message', (data) => {
    const { chatId, message } = data;
    io.to(chatId).emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Errors handler
app.use((err, req, res, next) => {
  err.statuCode = err.statuCode || 500;
  err.status = err.status || 'error';

  res.status(err.statuCode).json({
    status: err.status,
    message: err.message
  });
});

// Server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});
