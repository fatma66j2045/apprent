const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ✅ Import your controller
const { addEquipment, getAllEquipment, getOwnerEquipments, deleteEquipment, updateEquipment } = require('../controllers/equipmentController');

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../assets/images')); // Save inside backend/assets/images
  },
  filename: function (req, file, cb) {
    // Auto rename: add timestamp to avoid duplicates
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// ✅ Routes
router.post('/', upload.single('image'), addEquipment); // ⬅️ IMPORTANT change here
router.get('/', getAllEquipment);
router.get('/owner/:ownerId', getOwnerEquipments);
router.delete('/:id', deleteEquipment);
router.put('/:id', updateEquipment); // update without image upload

module.exports = router;
