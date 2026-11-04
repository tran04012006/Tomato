import UserModel from "../models/UserModel.js";
import sendRes from "../../helpers/sendRes.js";
import { verifyToken } from "./JWTaction.js";

const getUser = async (req, res, next) => {
  try {
    // Step 1: Get token from cookie
    const token = req.cookies?.tokenUser;

    if (!token) {
      return sendRes(res, 401, "You are not logged in", null);
    }

    // Step 2: Verify JWT
    const decoded = verifyToken(token);

    if (!decoded || !decoded.email) {
      return sendRes(res, 401, "Invalid or expired token", null);
    }

    // Step 3: Find user by email
    const user = await UserModel.findOne({
      email: decoded.email,
      delete: false,
    }).select("-password");

    if (!user) {
      return sendRes(res, 404, "User not found", null);
    }

    // Step 4: Store user
    res.locals.user = user;

    // Step 5: Continue to the next middleware
    next();
  } catch (error) {
    console.error("getUser error:", error);

    return sendRes(res, 500, "Internal server error", null);
  }
};

export default getUser;