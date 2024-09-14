// routes/user.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// POST /user - Add a new user
router.post("/user", async (req, res) => {
  try {
    const {
      name,
      role,
      phone_number,
      email_id,
      alternate_pho_no,
      password,
      clients,
      reporting_to,
      tasks,
      status,
    } = req.body;
    const user = new User({
      name,
      role,
      phone_number,
      email_id,
      alternate_pho_no,
      password,
      clients, // optional
      reporting_to, // optional
      tasks, // optional
      status, // optional, if not provided it will be `true` by default
    });
    await user.save();
    res.json({
      message: "User created successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", success: false });
  }
});

// GET /user - Get all users
router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const requestingUser = await User.findById(user_id);

    if (!requestingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the requesting user is an Admin
    if (requestingUser.role === "Admin") {
      // If Admin, return all users
      const allUsers = await User.find();
      return res.status(200).json({ message: "Admin access", users: allUsers });
    } else {
      // If not Admin, return only their details
      return res
        .status(200)
        .json({ message: "User access", user: requestingUser });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user details", error: error.message });
  }
});

// GET /users/:user_id - Get user by ID
router.get("/users/:user_id", async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    res.json({
      message: "User retrieved successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", success: false });
  }
});

// PUT /users/:user_id - Update user
router.put("/users/:user_id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.user_id,
      req.body,
      { new: true }
    );
    res.json({
      message: "User updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", success: false });
  }
});

// PUT /users/:user_id/password - Update user password
router.put("/users/:user_id/password", async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.new_password, salt);
    await user.save();

    res.json({ message: "Password updated successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", success: false });
  }
});

// PUT /users/:user_id/status - Update user status
router.put("/users/:user_id/status", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.user_id,
      { status: req.body.status },
      { new: true }
    );
    res.json({
      message: "Status updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", success: false });
  }
});

module.exports = router;
