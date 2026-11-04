import userModel from "../models/UserModel.js";
import sendRes from "../../helpers/sendRes.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createJWT, verifyToken } from "../middleware/JWTaction.js";

const registerController = async (req, res) => {
  console.log(req.body);
  const { username, password, email } = req.body;

  const user_username = await userModel.findOne({ username: username });
  const user_password = await userModel.findOne({ password: password });
  const existEmail = await userModel.findOne({ email: email });

  if (existEmail) {
    //xung dot voi du lieu da ton tai
    return sendRes(res, 409, "Account already exists. Please log in.", null);
  } else {
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new userModel({
      username: username,
      password: hashPassword,
      email: email,
    });
    await newUser.save();
    console.log(newUser);

    let payload = {
      email: newUser.email, //giup dinh danh nguoi dung
      username: newUser.username,
    };

    let token = createJWT(payload);

    //luu vao cookie httpOnly
    res.cookie("tokenUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    //server da tao tai khoan moi
    return sendRes(res, 201, "Successful", {
      username: newUser.username,
      email: newUser.email,
    });
  }
};

export default registerController;
