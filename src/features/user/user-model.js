// models/user.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true }, // Change to Number for sequential ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Staff"], default: "Staff" },
  employees: [
    {
      userId: {type: Number, required: true},
      name: { type: String, required: true },
    }
  ]
});

// Pre-save hook to set the userId
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // Set userId before saving the user
  if (!this.userId) {
    // Find the highest existing userId
    const maxUserId = await this.constructor.findOne().sort({ userId: -1 }).exec();
    this.userId = maxUserId ? maxUserId.userId + 1 : 1; // Start from 1 if no users exist
  }

  next();
});

const User = mongoose.model("User", userSchema);
export default User;
