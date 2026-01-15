require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

// Routes
const profileRoutes = require("./routes/profile.routes");

// Listening to the server
const server = express();

// parshing json
server.use(express.json());

const cors = require("cors");
server.use(cors());

// rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
});

server.use(limiter);

// Connecting DB(mongoDB)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo DB connected Succesfully"))
  .catch((err) => {
    console.log("Mongo DB error ", err);
  });

const PORT = process.env.PORT || 5000;

// Health route
server.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

server.use("/profile", profileRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
