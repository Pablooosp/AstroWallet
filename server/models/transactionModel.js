const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  userEmail: { type: String, required: true },  // Asociado al email del usuario
  date: { type: Date, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  name: { type: String, required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
