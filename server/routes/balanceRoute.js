// balanceRoute.js
const express = require('express');
const router = express.Router();
const { updateBalance, getUser } = require('../controllers/balanceController');

router.put('/users/:email/balance', updateBalance);
router.get('/users/:email', getUser);

module.exports = router;
