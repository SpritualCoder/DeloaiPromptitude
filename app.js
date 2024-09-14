// app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/", userRoutes);

// Connect to MongoDB
mongoose
  .connect("you connection string", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error: ", err); // Log the actual error
    process.exit(1); // Exit the process if connection fails
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
