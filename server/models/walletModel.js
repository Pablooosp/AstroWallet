const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jointWalletSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  balance: { type: Number, default: 0 },
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }]
});

const JointWallet = mongoose.model('JointWallet', jointWalletSchema);
module.exports = JointWallet;
