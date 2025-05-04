import Rental from "../models/Rental.js";
import User from "../models/User.js";
// Create a rental
export const createRental = async (req, res) => {
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
export const getRentalsByCustomer = async (req, res) => {
  try {
    const rentals = await Rental.find({ customerId: req.params.customerId }).sort({ rentalDate: -1 });
    res.json(rentals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get rentals by owner
export const getRentalsByOwner = async (req, res) => {
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
