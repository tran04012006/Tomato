import mongoose from "mongoose";
import generateRandomString from "../../helpers/generate.js";

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: String,
    token: {
      type: String,
      default: generateRandomString(20),
    },
    phone: String,
    avatar: String,
    delete: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("User", userSchema);
export default User;
