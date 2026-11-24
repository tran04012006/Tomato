import express from "express";
import getUser from "../middleware/getUser.middleware.js";
import {getTodo, createTodo, updateTodo, deleteTodo, getTodoStats } from "../Controller/todoController.js";


const router = express.Router();
router.get("/stats", getUser, getTodoStats);
router.get("/", getUser, getTodo);
router.post("/", getUser, createTodo);
router.patch("/:id", getUser, updateTodo);
router.delete("/:id", getUser, deleteTodo);


export default router;