require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const collectionRoutes = require("./src/routes/collectionRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const { notFoundHandler, errorHandler } = require("./src/middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

connectDB();

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api", itemRoutes); // items routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is running" });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

