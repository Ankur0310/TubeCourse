import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import courseRoutes from "./routes/courses.js";
import playlistRoutes from "./routes/playlist.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/process-playlist", playlistRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
