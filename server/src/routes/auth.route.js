import express from "express";
import registerPostController from "../Controller/registerPostController.js";
import {
  registerValidate,
  loginValidate,
  ForgotPasswordValidate,
  // ForgotPasswordOTPValidate,
} from "../middleware/userValidate.middleware.js";
import loginController from "../Controller/loginController.js";
import getUser from "../middleware/getUser.middleware.js";
import sendRes from "../../helpers/sendRes.js";
/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: get user information in token
 *     tags:
 *       - User
 *     description: take token in cookies to check authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User information retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "671f8c92a5b7d34e91234567"
 *                     username:
 *                       type: string
 *                       example: Tran
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: tran@gmail.com
 *       401:
 *         description: Unauthorized - Missing, invalid or expired JWT
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
const router = express.Router();
import sendRes from "../../helpers/sendRes.js";
import updateProfileController from "../Controller/updateProfileController.js";
import changePasswordController from "../Controller/changePasswordController.js";

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: get user information in token
 *     tags:
 *       - User
 *     description: take token in cookies to check authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User information retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "671f8c92a5b7d34e91234567"
 *                     username:
 *                       type: string
 *                       example: Tran
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: tran@gmail.com
 *       401:
 *         description: Unauthorized - Missing, invalid or expired JWT
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.post("/logout", (req, res) => {
  res.clearCookie("tokenUser", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
});

router.put("/profile", getUser, updateProfileController);

router.post("/login", loginValidate, loginController);

router.get("/me", getUser, (req, res) => {
  sendRes(res, 200, "Authenticated", { user: res.locals.user });
});

router.post("/register", registerValidate, registerPostController);

// router.post("/login", loginController);

// router.post(
//   "/forgot_password/email",
//   ForgotPasswordValidate,
//   ForgotPasswordController,
// );

router.put("/change_password", getUser, changePasswordController);

// router.post(
//   "/forgot_password/otp",
//   ForgotPasswordOTPValidate,
//   ForgotPasswordOTPController,
// );

export default router;
