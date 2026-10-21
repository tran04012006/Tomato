import UserModel from "../models/UserModel.js";
import sendRes from "../../helpers/sendRes.js";

const getUser = async (req, res, next) => {
  //neu da dang nhap roi
  if (req.cookies.tokenUser) {
    console.log("token la: ", req.cookies.tokenUser);
    const user = await UserModel.findOne({
      token: req.cookies.tokenUser,
      delete: false,
    }).select("-password");

    if (user) {
      console.log("user:" + user);
      res.locals.user = user;
    } else {
      console.log("ko tim thay user");
    }
  }
  next();
};

export default getUser;
