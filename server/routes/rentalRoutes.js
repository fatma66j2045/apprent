// server/routes/rentalRoutes.js

import express from "express";
import {
  createRental,
  getRentalsByCustomer,
  getRentalsByOwner,
} from "../controllers/rentalController.js";
import Rental from "../models/Rental.js";

const router = express.Router();

router.post("/", createRental);
router.get("/customer/:customerId", getRentalsByCustomer);
router.get("/owner/:ownerId", getRentalsByOwner);

// Inline rental status update
router.put("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    rental.status = req.body.status;
    await rental.save();

    res.json({ message: "Rental status updated successfully" });
  } catch (error) {
    console.error("Error updating rental status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
