// src/controllers/mission.controller.js
import express from "express";

import {
  findRestaurantById,
  createMission,
  listMissionsByRestaurant,
} from "../repositories/mission.repository.js";

import {
  RestaurantNotFoundError,
  MissionCreationError,
} from "../errors.js"; // 추가! error.js


const router = express.Router();

/**
 * [POST] 특정 가게에 미션 추가하기
 * URL: /api/restaurant/:id/mission
 */
router.post("/restaurant/:id/mission", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const restaurant = await findRestaurantById(id);
    if (!restaurant) {
      //  커스텀 에러 던지기 (전역 핸들러로 전달)
      throw new RestaurantNotFoundError("가게가 존재하지 않습니다.", { id });
    }

    const mission = await createMission(id, data);
     // 통일된 응답 포맷 사용 -> 리펙토링 진행.
     res.status(201).success({
      message: "미션이 성공적으로 추가되었습니다.",
      data: { mission_id: mission.mission_id },
    });
  } catch (err) {
    next(err); // 전역 에러 핸들러로 전달 -> error.js에 해당 내용 작성됨.
  }
});

/**
 * [GET] 특정 가게의 미션 목록 조회
 * URL: /api/restaurants/:restaurantId/missions?userId=1 -> 이유는 연습이기에 유저 id 1 밖에 없음..
 */
router.get("/restaurants/:restaurantId/missions", async (req, res) => {
  const { restaurantId } = req.params;
  const userId = Number(req.query.userId) || 0; // 쿼리에서 userId 받기 (연습용)

  try {
    const missions = await listMissionsByRestaurant(restaurantId, userId);

    const formatted = missions.map((m) => ({
      restaurant_name: m.restaurant.restaurant_name,
      region_id: m.restaurant.region_id ?? 1, // 서울 = 1
      mission_id: m.mission_id,
      mission_title: m.mission_title,
      mission_detail: m.mission_detail,
      reward_point: m.reward_point,
      status: m.user_mission.length
        ? m.user_mission[0].status
        : "not_started", // 아직 안 한 경우
    }));

    res.status(200).json({
      success: true,
      message: "미션 목록 조회 성공",
      data: formatted,
    });
  }  catch (err) {
    next(err);
  }
});


export default router;