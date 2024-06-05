const User = require('../models/userModel');

// Obtener la lista de amigos de un usuario
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate('friends', 'email name');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar un amigo
exports.addFriend = async (req, res) => {
  try {
    const { friendEmail } = req.body;
    const user = await User.findOne({ email: req.params.email });
    const friend = await User.findOne({ email: friendEmail });

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "Friend already added" });
    }

    user.friends.push(friend._id);
    await user.save();

    res.status(200).json({ message: 'Friend added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFriend = async (req, res) => {
    try {
      const { userEmail, friendEmail } = req.params;
  
      // Buscar al usuario por su correo electrónico
      const user = await User.findOne({ email: userEmail });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Buscar al amigo por su correo electrónico
      const friend = await User.findOne({ email: friendEmail });
  
      if (!friend) {
        return res.status(404).json({ message: "Friend not found" });
      }
  
      // Verificar si el amigo ya está en la lista de amigos
      if (!user.friends.includes(friend._id)) {
        return res.status(400).json({ message: "Friend not in the list" });
      }
  
      // Eliminar al amigo de la lista de amigos del usuario
      user.friends.pull(friend._id);
      await user.save();
  
      res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
      console.error('Error removing friend:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  