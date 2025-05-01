const Rental = require('../models/Rental');

const User = require('../models/User'); // ✅ Import User model


// Create a rental
exports.createRental = async (req, res) => {
  try {
    const {
      equipmentId,
      equipmentName,
      image,
      ownerId,
      customerId,
      rentalDuration,
      totalCost,
    } = req.body;

    // Validate required fields
    if (!equipmentId || !ownerId || !customerId || !rentalDuration || !totalCost) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRental = new Rental({
      equipmentId,
      equipmentName, // ✅ Save name
      image,          // ✅ Save image
      ownerId,
      customerId,
      rentalDuration,
      totalCost,
      rentalDate: new Date(),
      status: 'Pending', // ✅ Default status
    });

    await newRental.save();

    res.status(201).json({ message: 'Rental created successfully', rental: newRental });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get rentals by customer
exports.getRentalsByCustomer = async (req, res) => {
  try {
    const rentals = await Rental.find({ customerId: req.params.customerId }).sort({ rentalDate: -1 });
    res.json(rentals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get rentals by owner
exports.getRentalsByOwner = async (req, res) => {
  try {
    const rentals = await Rental.find({ ownerId: req.params.ownerId }).sort({ rentalDate: -1 });

    // 🔥 Fetch customer names
    const rentalsWithCustomerNames = await Promise.all(rentals.map(async (rental) => {
      const customer = await User.findById(rental.customerId).select('name');
      return {
        ...rental._doc,
        customerName: customer ? customer.name : 'Unknown',
      };
    }));

    res.json(rentalsWithCustomerNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
