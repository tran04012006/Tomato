import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, {
      expiresIn: "7d",
    });
    console.log("token: " + token);
  } catch (error) {
    console.log("error: " + error);
  }

  return token;
};

export const verifyToken = (token) => {
  if (!token || typeof token !== "string") {
    console.log("token is invalid");
    return null;
  }
  let key = process.env.JWT_SECRET;
  let data = null;
  try {
    let decoded = jwt.verify(token, key);
    data = decoded;
  } catch (error) {
    console.log(error);
  }
  return data;
};
