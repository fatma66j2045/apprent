import mongoose from "mongoose";

const rentalRequestSchema = new mongoose.Schema({
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rentalDuration: { type: String, required: true },
  status: { type: String, default: "pending" },
  totalCost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("RentalRequest", rentalRequestSchema);
