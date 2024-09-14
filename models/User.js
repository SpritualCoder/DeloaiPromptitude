// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Member"], required: true },
  phone_number: { type: String, required: true },
  email_id: { type: String, required: true },
  alternate_pho_no: { type: String },
  status: { type: Boolean, default: true },
  clients: [String],
  reporting_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tasks: [{ type: String }],
  password: { type: String, required: true },
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
