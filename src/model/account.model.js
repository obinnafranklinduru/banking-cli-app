const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: { type: Number, required: true, unique: true },
  username: { type: String, required: true, trim: true },
  balance: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});


module.exports = mongoose.model('Account', accountSchema);