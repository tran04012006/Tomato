import express from "express";
import getUser from "../middleware/getUser.middleware.js";
import {getTodo, createTodo, updateTodo, deleteTodo, getTodoStats } from "../Controller/todoController.js";


/**
 * @openapi
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6740a1b2c3d4e5f601234567
 *         user:
 *           type: string
 *           example: 671f8c92a5b7d34e91234567
 *         task:
 *           type: string
 *           maxLength: 200
 *           example: Finish web report
 *         done:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           nullable: true
 *           example: null
 *   responses:
 *     BadRequest:
 *       description: Invalid input.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Unauthorized:
 *       description: Not logged in, or the token is invalid / expired.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             success: false
 *             message: You are not logged in
 *             data: null
 *     NotFound:
 *       description: Resource not found.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     ServerError:
 *       description: Internal server error.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             success: false
 *             message: Internal server error
 *             data: null
 */

const router = express.Router();

/**
 * @openapi
 * /todo/stats:
 *   get:
 *     tags:
 *       - Todo
 *     summary: Count completed tasks
 *     description: Number of tasks of the logged-in user that are marked done. Shown on the Profile page.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Number of completed tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: get todo stats successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     doneCount:
 *                       type: integer
 *                       example: 8
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/stats", getUser, getTodoStats);

/**
 * @openapi
 * /todo:
 *   get:
 *     tags:
 *       - Todo
 *     summary: Get all tasks of the logged-in user
 *     description: Returns the user's tasks, newest first.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: get todo successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", getUser, getTodo);

/**
 * @openapi
 * /todo:
 *   post:
 *     tags:
 *       - Todo
 *     summary: Add a new task
 *     description: Spaces at both ends are removed. The task must have 1-200 characters.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task
 *             properties:
 *               task:
 *                 type: string
 *                 maxLength: 200
 *                 example: Finish web report
 *     responses:
 *       201:
 *         description: Task created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: add todo successfully
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/", getUser, createTodo);

/**
 * @openapi
 * /todo/{id}:
 *   patch:
 *     tags:
 *       - Todo
 *     summary: Update a task
 *     description: Change the content and/or the done status. Send at least one field.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           example: 6740a1b2c3d4e5f601234567
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               task:
 *                 type: string
 *                 maxLength: 200
 *                 example: Finish web report (final)
 *               done:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: update todo successfully
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch("/:id", getUser, updateTodo);

/**
 * @openapi
 * /todo/{id}:
 *   delete:
 *     tags:
 *       - Todo
 *     summary: Delete a task
 *     description: Only the owner of the task can delete it.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           example: 6740a1b2c3d4e5f601234567
 *     responses:
 *       200:
 *         description: Task deleted. Returns the deleted task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: delete todo successfully
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete("/:id", getUser, deleteTodo);


export default router;