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

export const handleOngoingMissions = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { cursor, limit } = req.query;

    const result = await getOngoingMissionsService(
      user_id,
      typeof cursor === "string" ? parseInt(cursor) : 0,
      Number(limit) || 5
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "진행중인 미션 목록 조회 성공",
      data: result.missions,
      nextCursor: result.nextCursor,
    });
  } catch (err) {
    console.error("Controller Error:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message || "서버 에러가 발생했습니다.",
    });
  }
};