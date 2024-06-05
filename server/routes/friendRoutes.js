const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');

// Rutas para amigos
router.get('/:email/friends', friendController.getFriends);
router.post('/:email/friends', friendController.addFriend);
router.delete('/:userEmail/friends/:friendEmail', friendController.removeFriend);


module.exports = router;
