// backend/routes/rentalRoutes.js

const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
// ✅ You forgot this import. Add it!
const rentalController = require('../controllers/rentalController');

// Routes
router.post('/', rentalController.createRental);
router.get('/customer/:customerId', rentalController.getRentalsByCustomer);
router.get('/owner/:ownerId', rentalController.getRentalsByOwner);
// Update rental status
router.put('/:id', async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id);
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
  
      rental.status = req.body.status;
      await rental.save();
  
      res.json({ message: 'Rental status updated successfully' });
    } catch (error) {
      console.error('Error updating rental status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = router;
