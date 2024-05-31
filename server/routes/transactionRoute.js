const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Crear una nueva transacción asociada al email del usuario
router.post('/users/:email/transaction', transactionController.createTransaction);

// Obtener todas las transacciones de un usuario por email
router.get('/users/:email/transactions', transactionController.getTransactionsByUser);

router.delete('/:id', transactionController.deleteTransaction);

// Otros endpoints para CRUD de transacciones...

module.exports = router;
