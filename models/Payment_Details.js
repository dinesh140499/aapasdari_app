const mongoose = require('mongoose');

const payment_Details = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User', 
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true, 
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('Payment', payment_Details);;
