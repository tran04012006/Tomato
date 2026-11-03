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

router.post("/login", loginValidate, loginController);
import getUser from "../middleware/getUser.middleware.js";
const router = express.Router();
import sendRes from "../../helpers/sendRes.js";


router.get("/me", getUser, (req, res) => {
  sendRes(res, 200, "Authenticated", { user: res.locals.user });
});

router.post("/register", registerValidate, registerPostController);


export default router;
