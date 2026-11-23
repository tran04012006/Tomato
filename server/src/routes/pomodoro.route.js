import express from "express";
import getUser from "../middleware/getUser.middleware.js";
import {createSession, getStats} from "../Controller/pomodoroController.js";


const router = express.Router();
router.post("/sessions", getUser, createSession);
router.get("/stats", getUser, getStats );

export default router;