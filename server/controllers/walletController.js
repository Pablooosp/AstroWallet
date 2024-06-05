const JointWallet = require('../models/walletModel');
const User = require('../models/userModel');

// Crear una nueva cartera conjunta
exports.createJointWallet = async (req, res) => {
  const { name, members } = req.body;

  try {
    const newJointWallet = new JointWallet({
      name,
      members
    });

    await newJointWallet.save();

    // Agregar la cartera conjunta a cada miembro
    for (const memberId of members) {
      const user = await User.findById(memberId);
      user.jointWallets.push(newJointWallet._id);
      await user.save();
    }

    res.status(201).json(newJointWallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener carteras conjuntas de un usuario
exports.getJointWalletsByUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate('jointWallets');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.jointWallets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
