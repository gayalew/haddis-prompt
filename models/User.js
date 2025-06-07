// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3, // Reduced from 8
      maxlength: 20,
      match: [/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"],
    },
    image: {
      type: String,
    },
    // Add other fields as needed
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
