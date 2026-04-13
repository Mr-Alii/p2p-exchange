const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  user:              { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName:          { type: String, required: true },
  givingCurrency:    { type: String, required: true },
  receivingCurrency: { type: String, required: true },
  amount:            { type: Number, required: true },
  rate:              { type: Number, required: true },
  status:            { type: String, default: 'open', enum: ['open', 'pending', 'completed', 'disputed'] },
  acceptedBy:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt:         { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trade', TradeSchema);