import { StatusCodes } from "http-status-codes";
import { startMission } from "../services/user_mission.service.js";

export const startMissionController = async (req, res, next) => {
  try {
    const { mission_id } = req.params; // URL에서 missionId 획득
    
    const user_id = 1; 

    const userMission = await startMission(user_id, mission_id);

    res.status(StatusCodes.CREATED).json({ result: userMission })
  } catch (err) {
    next(err); // 에러 핸들러로 넘김
  }
};