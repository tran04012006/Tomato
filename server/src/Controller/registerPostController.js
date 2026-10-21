import userModel from "../models/UserModel.js";
import sendRes from "../../helpers/sendRes.js";
import bcrypt from "bcryptjs";

const registerController = async (req, res) => {
  console.log(req.body);
  const { username, password, email } = req.body;

  const user_username = await userModel.findOne({ username: username });
  const user_password = await userModel.findOne({ password: password });
  const existEmail = await userModel.findOne({ email: email });

  if (existEmail) {
    //xung dot voi du lieu da ton tai
    return sendRes(res, 409, "Already registered", null);
  } else {
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new userModel({
      username: username,
      password: hashPassword,
      email: email,
    });
    await newUser.save();
    console.log(newUser);
    res.cookie("tokenUser", newUser.token);
    //server da tao tai khoan moi
    return sendRes(res, 201, "Successful", null);
  }
};

export default registerController;
