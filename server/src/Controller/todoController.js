import sendRes from "../../helpers/sendRes.js";
import Todo from "../models/Todo.js";
import mongoose from "mongoose";


export const getTodo = async (req, res) => {
    try {
        const user = res.locals.user;
        const todos = await Todo.find({ user: user._id }).sort({ createdAt: -1 });
        return sendRes(res, 200, "get todo successfully", todos);
    }
    catch (error) {
        console.error("Get todo error:", error);

        return sendRes(res, 500, "Internal server error", null);
    }
}

export const createTodo = async (req, res) => {
    try {
        const user = res.locals.user;
        const task = req.body.task;
        if (typeof task !== "string") {
            return sendRes(res, 400, "task must be a string", null);
        }
        const cleanTask = task.trim();

        if (cleanTask === "" || cleanTask.length > 200) {
            return sendRes(res, 400, "task invalid format", null);
        }

        const todo = await Todo.create({
            user: user._id,
            task: cleanTask,
        })
        return sendRes(res, 201, "add todo successfully", todo);


    }
    catch (error) {
        console.error("Create todo error:", error);

        return sendRes(res, 500, "Internal server error", null);
    }
}


export const updateTodo = async (req, res) => {
    try {
        const user = res.locals.user;
        const id = req.params.id;
        const { task, done } = req.body;

        //check id
        if (!mongoose.isValidObjectId(id)) {
            return sendRes(res, 400, "invalid todo id", null);
        }

        const changes = {};

        //nếu có sửa task
        if (task !== undefined) {
            if (typeof task !== "string") {
                return sendRes(res, 400, "task must be a string", null);
            }
            const cleanTask = task.trim();

            if (cleanTask === "" || cleanTask.length > 200) {
                return sendRes(res, 400, "task invalid format", null);
            }
            changes.task = cleanTask;
        }
        // nếu có done
        if (done !== undefined) {
            if (typeof done !== "boolean") {
                return sendRes(res, 400, "is done invalid format", null);
            }
            changes.done = done;
        }


        // neu khong co gi 
        if (Object.keys(changes).length === 0) {
            return sendRes(res, 400, "nothing to update", null);
        }

        //update neu co gi
        const todo = await Todo.findOneAndUpdate(
            { _id: id, user: user._id },
            { $set: changes },
            { new: true, runValidators: true }
        );

        if (!todo) {
            return sendRes(res, 404, "todo not found", null);
        }

        return sendRes(res, 200, "update todo successfully", todo);
    }
    catch (error) {
        console.error("update todo error:", error);

        return sendRes(res, 500, "Internal server error", null);
    }

}

export const deleteTodo = async (req, res) => {
    try {
        const user = res.locals.user;
        const id = req.params.id;

        //check id
        if (!mongoose.isValidObjectId(id)) {
            return sendRes(res, 400, "invalid todo id", null);
        }

        const todo = await Todo.findOneAndDelete(
            { _id: id, user: user._id }
        );

        if (!todo) {
            return sendRes(res, 404, "todo not found", null);
        }

        return sendRes(res, 200, "delete todo successfully", todo);
    }

    catch (error) {
        console.error("delete todo error:", error);


        return sendRes(res, 500, "Internal server error", null);
    }
}