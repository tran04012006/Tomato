
import sendRes from "../../helpers/sendRes.js";
import FocusSession from "../models/FocusSession.js";

export const createSession = async (req, res) => {
    try {
        const user = res.locals.user;
        const minutes = Number(req.body.minutes);

        if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) {
            return sendRes(res, 400, "minutes is integer in range 1-120", null);
        }

        const session = await FocusSession.create({
            user: user._id,
            minutes: minutes
        })
        return sendRes(res, 201, "session +1 successfully", session);
    }
    catch (error) {
        console.error("Create session error:", error);

        return sendRes(res, 500, "Internal server error", null);
    }

}

export const getStats = async (req, res) => {
    try {
        //lấy user
        const user = res.locals.user;

        //sessions lưu mảng các FocusSession của user x gồm userID và minutes
        const sessions = await FocusSession.find({
            user: user._id
        })

        //focusSessions đếm các session của user x
        const focusSessions = sessions.length;

        //cộng thời gian của các session
        let focusMinutes = 0;
        for (let i = 0; i < focusSessions; i++) {
            focusMinutes += sessions[i].minutes;
        }
        return sendRes(res, 200, "get focus session and focus minutes successfully", {focusSessions, focusMinutes});


    }
    catch (error) {
        console.error("get stats error:", error);

        return sendRes(res, 500, "Internal server error", null);
    }
}
