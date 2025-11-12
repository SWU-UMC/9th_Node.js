import { StatusCodes } from "http-status-codes";
import { startMission, getOngoingMissionsService } from "../services/user_mission.service.js";

export const startMissionController = async (req, res, next) => {
  try {
    const { mission_id } = req.params; // URL에서 missionId 획득
    const { user_id } = req.body;

    const missionIdAsNumber = Number(mission_id);

    const userMission = await startMission(user_id, missionIdAsNumber);

    res.status(StatusCodes.OK).success(userMission);
  } catch (error) {
    next(error); // 에러 핸들러로 넘김
  }
};

//진행 중인 미션 조회
export const handleOngoingMissions = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { cursor, limit } = req.query;

    const userIdAsNumber = Number(user_id);

    const result = await getOngoingMissionsService(
      userIdAsNumber,
      typeof cursor === "string" ? parseInt(cursor) : 0,
      Number(limit) || 5
    );

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};