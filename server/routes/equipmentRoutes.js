// server/routes/equipmentRoutes.js

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  addEquipment,
  getAllEquipment,
  getOwnerEquipments,
  deleteEquipment,
  updateEquipment,
} from "../controllers/equipmentController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../assets/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), addEquipment);
router.get("/", getAllEquipment);
router.get("/owner/:ownerId", getOwnerEquipments);
router.delete("/:id", deleteEquipment);
router.put("/:id", updateEquipment);

export default router;
