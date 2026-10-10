import mongoose from "mongoose";
import generateRandomString from "../../helpers/generate.js";

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
  },
);
const User = mongoose.model("User", userSchema);
export default User;
