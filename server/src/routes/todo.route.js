import express from "express";
import getUser from "../middleware/getUser.middleware.js";
import {getTodo, createTodo, updateTodo, deleteTodo } from "../Controller/todoController.js";


const router = express.Router();
router.get("/", getUser, getTodo);
router.post("/", getUser, createTodo);
router.patch("/:id", getUser, updateTodo);
router.delete("/:id", getUser, deleteTodo);


export default router;