const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const authRouter = require('./routes/authRoutes');
const balanceRoute = require('./routes/balanceRoute');
//middlewares
app.use(cors());
app.use(express.json());
//routes
app.use('/api/auth', authRouter);
app.use('/api', balanceRoute);
//mongodb
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URL)
  .then(()=> console.log('Conexion a la base de datos con exito'))
  .catch((error)=> console.error(error));
//errors handler
app.use((err, req, res, next) => {
  err.statuCode = err.statuCode || 500;
  err.status = err.status || 'error';

  res.status(err.statuCode).json({
    status: err.status,
    message: err.message
  });
});


//server
const PORT = 3000;
app.listen(PORT, ()=>{
  console.log(`Escuchando en el puerto ${PORT}`);
})