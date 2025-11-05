import { StatusCodes } from "http-status-codes";
import { missionAdd, missionListByRestaurant  } from "../services/mission.service.js";

export const addMissionController = async (req, res, next) => {
    try {
        const { restaurant_id } = req.params;
        const mission = await missionAdd({
          restaurant_id: Number(restaurant_id),
          ...req.body});

        res.status(StatusCodes.OK).json({ result: mission });
  } catch (err) {
    console.error("Controller Error: ", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "서버 에러가 발생했습니다."
    });
  }
};

//특정 레스토랑 미션 목록
export const getMissionsByRestaurantController = async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const { cursor, limit } = req.query;

    const result = await missionListByRestaurant(
      restaurant_id,
      typeof cursor === "string" ? parseInt(cursor) : 0,
      Number(limit) || 5
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "가게별 미션 목록 조회 성공",
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