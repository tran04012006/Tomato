import express from "express";
import userController from "../Controller/userController.js";
const router = express.Router();

router.post("/", userController);

export default router;
