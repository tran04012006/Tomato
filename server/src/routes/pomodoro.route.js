import express from "express";
import getUser from "../middleware/getUser.middleware.js";
import {createSession, getStats} from "../Controller/pomodoroController.js";


/**
 * @openapi
 * components:
 *   schemas:
 *     FocusSession:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6740a1b2c3d4e5f609876543
 *         user:
 *           type: string
 *           example: 671f8c92a5b7d34e91234567
 *         minutes:
 *           type: integer
 *           minimum: 1
 *           maximum: 120
 *           example: 25
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const router = express.Router();

/**
 * @openapi
 * /pomodoro/sessions:
 *   post:
 *     tags:
 *       - Pomodoro
 *     summary: Save a finished focus session
 *     description: Called by the front end when a Focus session reaches zero.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - minutes
 *             properties:
 *               minutes:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *                 example: 25
 *     responses:
 *       201:
 *         description: Session saved.
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
 *                   example: session +1 successfully
 *                 data:
 *                   $ref: '#/components/schemas/FocusSession'
 *       400:
 *         description: minutes is not an integer from 1 to 120.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: minutes is integer in range 1-120
 *               data: null
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/sessions", getUser, createSession);

/**
 * @openapi
 * /pomodoro/stats:
 *   get:
 *     tags:
 *       - Pomodoro
 *     summary: Get focus statistics of the logged-in user
 *     description: Total number of focus sessions and total focus minutes.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Statistics of the user.
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
 *                   example: get focus session and focus minutes successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     focusSessions:
 *                       type: integer
 *                       example: 12
 *                     focusMinutes:
 *                       type: integer
 *                       example: 300
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/stats", getUser, getStats );

export default router;