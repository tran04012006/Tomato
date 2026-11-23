import express from "express";
import registerPostController from "../Controller/registerPostController.js";
import {
  registerValidate,
  loginValidate,
} from "../middleware/userValidate.middleware.js";
import loginController from "../Controller/loginController.js";
import getUser from "../middleware/getUser.middleware.js";
import sendRes from "../../helpers/sendRes.js";

const router = express.Router();
import updateProfileController from "../Controller/updateProfileController.js";
import changePasswordController from "../Controller/changePasswordController.js";


/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log out
 *     description: Clear the tokenUser cookie.
 *     security: []
 *
 *     responses:
 *       200:
 *         description: Cookie cleared successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */

router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("tokenUser", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
});

/**
 * @openapi
 * /auth/profile:
 *   put:
 *     tags:
 *       - Profile
 *     summary: Update current user profile
 *     description: Update username, email. On success, the authentication cookie is refreshed.
 *     security:
 *       - cookieAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: Tran Ngo
 *               email:
 *                 type: string
 *                 format: email
 *                 example: tran.new@gmail.com
 *
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "671f8c92a5b7d34e91234567"
 *                         username:
 *                           type: string
 *                           example: Tran Ngo
 *                         email:
 *                           type: string
 *                           format: email
 *
 *       400:
 *         description: Missing username/email, invalid email.
 *
 *       401:
 *         description: Unauthorized - Missing or invalid JWT.
 *
 *       404:
 *         description: User not found.
 *
 *       409:
 *         description: Email or username already exists.
 */

router.put("/profile", getUser, updateProfileController);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log in
 *     description: Verify email and password. On success, the server sets the HttpOnly tokenUser cookie for 7 days
 *     security: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: tran@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *
 *     responses:
 *       200:
 *         description: Logged in successfully. A tokenUser cookie is set.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: Tran
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: tran@gmail.com
 *
 *       400:
 *         description: Missing email/password or invalid email format.
 *
 *       401:
 *         description: Email is not registered or password is incorrect.
 */

router.post("/login", loginValidate, loginController);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get current user profile
 *     description: Get the authenticated user's information using the JWT stored in the tokenUser cookie.
 *     security:
 *       - cookieAuth: []
 *
 *     responses:
 *       200:
 *         description: Current user retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Authenticated
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "671f8c92a5b7d34e91234567"
 *                         username:
 *                           type: string
 *                           example: Tran
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: tran@gmail.com
 *                         avatar:
 *                           type: string
 *                           example: https://example.com/avatar.png
 *
 *       401:
 *         description: Missing, invalid, or expired JWT cookie.
 *
 *       404:
 *         description: User not found.
 *
 *       500:
 *         description: Internal server error.
 */

router.get("/me", getUser, (req, res) => {
  sendRes(res, 200, "Authenticated", { user: res.locals.user });
});
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account and set a JWT cookie.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: Tran
 *               email:
 *                 type: string
 *                 format: email
 *                 example: tran@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: Tran
 *                     email:
 *                       type: string
 *                       example: tran@gmail.com
 *
 *       400:
 *         description: Missing required fields or invalid password
 *
 *       409:
 *         description: Email already registered
 */
router.post("/register", registerValidate, registerPostController);

/**
 * @openapi
 * /auth/change_password:
 *   put:
 *     tags:
 *       - Profile
 *     summary: Change user password
 *     description: Verify the current password and update it with a new password.
 *     security:
 *       - cookieAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 maxLength: 128
 *                 example: newpassword456
 *
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully.
 *
 *       400:
 *         description: Missing fields, invalid new password length, incorrect current password, or same password.
 *
 *       401:
 *         description: Unauthorized - Missing or invalid JWT.
 *
 *       404:
 *         description: User not found.
 *
 *       500:
 *         description: Internal server error.
 */
router.put("/change_password", getUser, changePasswordController);


export default router;
