const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

// Crear una nueva transacción
exports.createTransaction = async (req, res) => {
  const userEmail = req.params.email;
  const { date, type, amount, name } = req.body;

  try {
    // Aquí puedes verificar si el usuario existe, por ejemplo, buscándolo en la base de datos
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Crea una nueva transacción
    const newTransaction = new Transaction({
      userEmail, // Asigna el correo electrónico del usuario a la transacción
      date,
      type,
      amount,
      name,
    });

    // Guarda la transacción en la base de datos
    await newTransaction.save();

    // Agrega el ID de la nueva transacción al usuario
    user.transacciones.push(newTransaction._id);

    // Guarda el usuario actualizado en la base de datos
    await user.save();

    // Devuelve la nueva transacción creada
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

// Otros métodos CRUD para transacciones...
