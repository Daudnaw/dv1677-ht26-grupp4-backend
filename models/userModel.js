import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
  email: { 
    type: String,
    required: [true, "Please add the user email address"],
    unique: [true, "Email address already taken"],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Please add the password"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
   }
 },
 {
  timestamps: true
 }
);

export default mongoose.model("User", userSchema);