import express from "express";
import registerPostController from "../Controller/registerPostController.js";
import {
  registerValidate,
  loginValidate,
  ForgotPasswordValidate,
} from "../middleware/userValidate.middleware.js";
import loginController from "../Controller/loginController.js";
import ForgotPasswordController from "../Controller/ForgotPasswordController.js";

const router = express.Router();

router.post("/register", registerValidate, registerPostController);
router.post("/login", loginValidate, loginController);
router.post(
  "/forgot_password",
  ForgotPasswordValidate,
  ForgotPasswordController,
);

export default router;
