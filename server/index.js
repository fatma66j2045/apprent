// server/index.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as ENV from "./config.js"; // ✅ Load env config (Activity 16)
import authRoutes from "./routes/authRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import userRoutes from './routes/userRoutes.js';
// Setup for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Serve static image files from /assets/images
app.use("/assets/images", express.static(path.join(__dirname, "assets/images")));

// ✅ Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/rentals", rentalRoutes);
app.use('/api/users', userRoutes);


// ✅ Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Connect to MongoDB using ENV variables
const connectString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
const port = ENV.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
