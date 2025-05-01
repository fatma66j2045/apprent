// backend/models/Rental.js

const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true,
  },
  equipmentName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rentalDuration: {
    type: String,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  rentalDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
});

module.exports = mongoose.model('Rental', RentalSchema);
