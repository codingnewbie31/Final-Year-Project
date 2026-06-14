const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },  // ← changed: no longer required
  googleId: { type: String },                   // ← new field
  role: { type: String, enum: ["jobseeker", "employer"], default: "jobseeker" }, // ← added default
  avatar: String,
  resume: String,
  // for employer
  companyName: String,
  companyDescription: String,
  companyLogo: String,
}, { timestamps: true });

// Encrypt password before save — only runs if password exists
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return; // ← added !this.password check
  this.password = await bcrypt.hash(this.password, 10);
});

// Match entered password
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);