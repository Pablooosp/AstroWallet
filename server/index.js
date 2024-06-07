const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const authRouter = require('./routes/authRoutes');
const balanceRoute = require('./routes/balanceRoute');
const transactionRoutes = require('./routes/transactionRoute');
const friendRoutes = require('./routes/friendRoutes');

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api', balanceRoute);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', friendRoutes);

// MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Conexión a la base de datos con éxito'))
  .catch((error) => console.error(error));

// Errors handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});
