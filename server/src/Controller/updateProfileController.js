import UserModel from "../models/UserModel.js";
import sendRes from "../../helpers/sendRes.js";
import { createJWT } from "../middleware/JWTaction.js";
import cloudinary from "../config/cloudinary.js";
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const updateProfileController = async (req, res) => {
  try {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return sendRes(res, 401, "Unauthorized", null);
    }
    const { username, email, avatar } = req.body;

    if (typeof username !== "string" || typeof email !== "string") {
      return sendRes(res, 400, "Username and email are required", null);
    }
    //trim: bo khoang trang
    const newUsername = username.trim();
    const newEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //validate email
    if (!emailRegex.test(newEmail)) {
      return sendRes(res, 400, "Invalid email address", null);
    }

    //kiem tra xem email co ton tai truoc chua
    const existingEmail = await UserModel.findOne({
      email: newEmail,
      _id: { $ne: currentUser._id },
      delete: false,
    });

    console.log("Current user ID:", currentUser._id.toString());
    console.log("Current email:", currentUser.email);

    if (existingEmail) {
      return sendRes(res, 409, "Email is already registered", null);
    }
    //chuan bi thong tin can thay doi
    const changes = {
      username: newUsername,
      email: newEmail,
    };

    //validate avatar
    if (avatar !== undefined) {
      //neu avatar la string
      if (typeof avatar !== "string") {
        return sendRes(res, 400, "Invalid avatar format", null);
      }
      //neu avatar la rong
      if (avatar === "") {
        changes.avatar = "";
      } else if (avatar === (currentUser.avatar || "")) {
        //avatar ko thay doi
        changes.avatar = currentUser.avatar;
      } else {
        //kiem tra dinh dang cua avatar
        const match = avatar.match(
          /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/,
        );

        if (!match) {
          return sendRes(
            res,
            400,
            "Avatar must be a JPG, PNG or WebP image",
            null,
          );
        }

        const imageBuffer = Buffer.from(match[2], "base64");

        if (imageBuffer.length === 0 || imageBuffer.length > MAX_AVATAR_SIZE) {
          return sendRes(res, 400, "Avatar must be smaller than 5 MB", null);
        }
        //luu ket qua ve cloudinary
        const result = await cloudinary.uploader.upload(avatar, {
          folder: "tomato/avatars",
          resource_type: "image",
        });
        //luu URL ve may
        changes.avatar = result.secure_url;
      }
    }
    //cap nhat thong tin user
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: currentUser._id,
        delete: false,
      },
      {
        $set: changes,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password -token");

    if (!updatedUser) {
      return sendRes(res, 404, "User not found", null);
    }
    //cap nhat lai token
    const newToken = createJWT({
      email: updatedUser.email,
      username: updatedUser.username,
    });

    if (!newToken) {
      return sendRes(res, 500, "Could not refresh authentication", null);
    }

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("tokenUser", newToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return sendRes(res, 200, "Profile updated successfully", {
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.code === 11000) {
      return sendRes(res, 409, "Username or email already exists", null);
    }

    return sendRes(res, 500, "Failed to update profile", null);
  }
};

export default updateProfileController;
