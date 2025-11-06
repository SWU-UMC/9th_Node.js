import { StatusCodes } from "http-status-codes";
import { missionAdd } from "../services/mission.service.js";

export const addMissionController = async (req, res, next) => {
    try {
        const { restaurant_id } = req.params;
        const mission = await missionAdd(restaurant_id, req.body);

        res.status(StatusCodes.OK).json({ result: mission });
  } catch (err) {
    console.error("Controller Error: ", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "서버 에러가 발생했습니다."
    });
  }
}