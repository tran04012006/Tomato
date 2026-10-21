import userModel from "../models/UserModel.js";
import sendRes from "../../helpers/sendRes.js";
import bcrypt from "bcrypt";

const loginController = async (req, res) => {
  console.log("dang o loginController");
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email: email,
  });

  if (!user) {
    return sendRes(res, 401, "You haven't registered yet", null);
  } else {
    //so sanh mat khau
    // console.log("user.password: " + user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (isMatch === true) return sendRes(res, 200, "Successful", null);
    else return sendRes(res, 401, "Wrong password", null);
  }
};

export default loginController;
