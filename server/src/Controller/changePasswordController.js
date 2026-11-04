import bcrypt from "bcryptjs";
import userModel from "../models/UserModel.js";
const changePasswordController = async (req, res) => {
  console.log("di vao chang pw control");
  try {
    const { currentPassword, newPassword } = req.body;

    //validate
    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message: "Current and new passwords are required.",
      });
    }

    if (newPassword.length < 6 || newPassword.length > 128) {
      return res.status(400).json({
        message: "New password must be 6–128 characters.",
      });
    }
    //validate xong roi thi lay token ra de tim thong tin user
    const authenticatedUser = res.locals.user;
    //ko tim thay thi return 401
    if (!authenticatedUser) {
      return res.status(401).json({
        message: "Unauthorized. Please log in.",
      });
    }

    const user = await userModel
      .findById(authenticatedUser._id)
      .select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    //so sanh password that va current password
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }
    //so sanh password that va new password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "Please choose a different password.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      message: "server error.",
    });
  }
};
export default changePasswordController;
