const mongoose = require('mongoose');

const rentalRequestSchema = new mongoose.Schema({
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Equipment Owner
  rentalDuration: { type: String, required: true }, // e.g., "1 Day", "3 Days", "1 Week"
  status: { type: String, default: 'pending' }, // pending / approved / rejected
  totalCost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RentalRequest', rentalRequestSchema);
