import sendRes from "../../helpers/sendRes.js";

//dang ki
export const registerValidate = (req, res, next) => {
  console.log(req.body);
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    sendRes(res, 400, "Please fill out all fields", null);
    return;
  }
  //neu password ko hop le
  if (password.length < 6) {
    sendRes(res, 400, "Password has to contain at least 6 characters", null);
    return;
  }

  next();
};

//dang nhap
export const loginValidate = (req, res, next) => {
console.log("chay login validate");
  const { username, password, email } = req.body;
  if (!password || !email) {
    sendRes(res, 400, "Please fill out all fields", null);
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    sendRes(res, 400, "Invalid email", null);
    return;
  }
  next();
};

//quen mat khau
export const ForgotPasswordValidate = (req, res, next) => {
  const email = req.body.email;
console.log("email: " + email);
  if (!email.includes("@") || !email.includes(".")) {
    sendRes(res, 400, "Invalid email", null);
    return;
  }
  next();
};
