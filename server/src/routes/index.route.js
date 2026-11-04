import authRoute from "./auth.route.js";
import homeRoute from "./home.route.js";
import express from "express";
import getUser from "../middleware/getUser.middleware.js";
const router = express.Router();

router.use("/auth", authRoute);

console.log("dang o index.route");

export default router;
