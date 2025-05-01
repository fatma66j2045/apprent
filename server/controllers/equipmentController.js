// backend/controllers/equipmentController.js
const Equipment = require('../models/Equipment');

// Add new equipment
exports.addEquipment = async (req, res) => {
  try {
    const { name, price, description, ownerId } = req.body;

    // Check if file uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const newEquipment = new Equipment({
      name,
      price,
      description,
      image: req.file.filename, // 🔥 multer gives us filename here
      ownerId,
    });

    await newEquipment.save();
    res.status(201).json({ message: 'Equipment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get all equipment
exports.getOwnerEquipments = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const equipments = await Equipment.find({ ownerId }).sort({ createdAt: -1 });
    res.json(equipments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    const equipmentId = req.params.id;
    await Equipment.findByIdAndDelete(equipmentId);
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update equipment
exports.updateEquipment = async (req, res) => {
  try {
    const equipmentId = req.params.id;
    const { name, price, description } = req.body;

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      equipmentId,
      { name, price, description },
      { new: true }
    );

    res.json({ message: 'Equipment updated successfully', equipment: updatedEquipment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all equipment (for admin future use)
exports.getAllEquipment = async (req, res) => {
  try {
    const equipments = await Equipment.find().sort({ createdAt: -1 });
    res.json(equipments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
