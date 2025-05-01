const RentalRequest = require('../models/RentalRequest');

// Create rental request (by customer)
exports.createRentalRequest = async (req, res) => {
  try {
    const { equipmentId, customerId, ownerId, rentalDuration, totalCost } = req.body;

    const newRequest = new RentalRequest({
      equipmentId,
      customerId,
      ownerId,
      rentalDuration,
      totalCost,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Rental request created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all rental requests for owner
exports.getOwnerRequests = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const requests = await RentalRequest.find({ ownerId })
      .populate('equipmentId')
      .populate('customerId')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update rental request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    const updatedRequest = await RentalRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    res.json({ message: 'Rental request updated successfully', rentalRequest: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
