const express = require('express');
const router = express.Router();
const { createRentalRequest, getOwnerRequests, updateRequestStatus } = require('../controllers/rentalRequestController');

router.post('/', createRentalRequest); // Create rental
router.get('/owner/:ownerId', getOwnerRequests); // Fetch rentals for owner
router.put('/:id', updateRequestStatus); // Update rental status

export default router;
