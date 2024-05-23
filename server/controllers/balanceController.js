// balanceController.js
const User = require('../models/userModel'); // Asegúrate de que la ruta es correcta

const updateBalance = async (req, res) => {
  const userEmail = req.params.email;
  const { amount, operation } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (operation === "sum") {
      user.balance += amount;
      user.ingresos += amount;
    } else if (operation === "subtract") {
      user.balance -= amount;
      user.gastos += amount;
    } else {
      return res.status(400).json({ message: "Invalid operation" });
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUser = async (req, res) => {
  const userEmail = req.params.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updateBalance,
  getUser,
};
