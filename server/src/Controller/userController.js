import userModel from "../models/UserModel.js";

const userController = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Vui long nhap day du thong tin",
    });
  }

  const user = await userModel.findOne({ username: username });
  if (!user) {
    console.log("chua co tai khoan");
    const newUser = new userModel({ username, password });
    await newUser.save();
    return res.status(200).json({
      message: "Dang ki thanh cong",
    });
  } else {
    return res.status(400).json({
      message: "da co tai khoan",
    });
  }
};

export default userController;
