import userModel from "../models/UserModel.js";
import sendRes from "../../helpers/sendRes.js";
import bcrypt from "bcrypt";
import { createJWT, verifyToken } from "../middleware/JWTaction.js";

const loginController = async (req, res) => {
  console.log("dang o loginController");
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email: email,
  });

  if (!user) {
    return sendRes(
      res,
      401,
      "You haven't registered yet. Please create an account!",
      null,
    );
  } else {
    //so sanh mat khau
    // console.log("user.password: " + user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (isMatch === true) {
      const payload = {
        email: user.email,
        username: user.username,
      };

      const token = createJWT(payload);

      res.cookie("tokenUser", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return sendRes(res, 200, "Login successful", {
        username: user.username,
        email: user.email,
      });
    } else return sendRes(res, 401, "Wrong password", null);
  }
};

export default loginController;
