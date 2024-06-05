const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

// Crear una nueva transacción
exports.createTransaction = async (req, res) => {
  const userEmail = req.params.email;
  const { date, type, amount, name } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Crear una nueva transacción
    const newTransaction = new Transaction({
      userEmail, // Asigna el correo electrónico del usuario a la transacción
      date,
      type,
      amount,
      name,
    });

    // Guardar la transacción en la base de datos
    await newTransaction.save();

    // Agregar el ID de la nueva transacción al usuario
    user.transacciones.push(newTransaction._id);

    // Actualizar balance, ingresos o gastos según el tipo de transacción

    // Guardar el usuario actualizado en la base de datos
    await user.save();

    // Devolver la nueva transacción creada
    return res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todas las transacciones de un usuario por email
exports.getTransactionsByUser = async (req, res) => {
  try {
    const { email } = req.params;

    // Verificar si el usuario existe
    const user = await User.findOne({ email }).populate('transacciones');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transactions = user.transacciones;
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una transacción por ID
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la transacción por ID
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Buscar el usuario asociado a la transacción
    const user = await User.findOne({ email: transaction.userEmail });
    if (user) {
      // Actualizar balance, ingresos o gastos según el tipo de transacción
      if (transaction.type === 'income') {
        user.balance -= transaction.amount;
        user.ingresos -= transaction.amount;
      } else if (transaction.type === 'expense') {
        user.balance += transaction.amount;
        user.gastos -= transaction.amount;
      }

      // Eliminar la transacción de la lista de transacciones del usuario
      user.transacciones = user.transacciones.filter(
        (transactionId) => transactionId.toString() !== id
      );
      await user.save();
    }

    // Eliminar la transacción de la base de datos
    await transaction.remove();

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
