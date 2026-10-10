import authRoute from "./auth.route.js";
import homeRoute from "./home.route.js";
import express from "express";
const router = express.Router();

router.use("/", homeRoute);
console.log("dang o index.route");

router.use("/Profile", authRoute);

export default router;
