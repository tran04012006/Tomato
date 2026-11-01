import express from "express";
import registerPostController from "../Controller/registerPostController.js";
import {
  registerValidate,
  loginValidate,
  ForgotPasswordValidate,
  // ForgotPasswordOTPValidate,
} from "../middleware/userValidate.middleware.js";
import loginController from "../Controller/loginController.js";
import ForgotPasswordController from "../Controller/ForgotPasswordController.js";
import ForgotPasswordOTPController from "../Controller/ForgotPasswordOTPController.js";
import getUser from "../middleware/getUser.middleware.js";
const router = express.Router();
import sendRes from "../../helpers/sendRes.js";


router.get("/me", getUser, (req, res) => {
  sendRes(res, 200, "Authenticated", { user: res.locals.user });
});

router.post("/register", registerValidate, registerPostController);


export default router;
