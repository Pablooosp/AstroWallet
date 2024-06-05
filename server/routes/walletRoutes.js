const express = require('express');
const router = express.Router();
const jointWalletController = require('../controllers/walletController');

// Rutas para carteras conjuntas
router.post('/joint-wallets', jointWalletController.createJointWallet);
router.get('/:email/joint-wallets', jointWalletController.getJointWalletsByUser);

module.exports = router;
