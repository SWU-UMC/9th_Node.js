// src/controllers/mission.controller.js
import express from "express";
import { findRestaurantById, createMission } from "../repositories/mission.repository.js";
import { listMissionsByRestaurant } from "../repositories/mission.repository.js";
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
      return res.status(404).json({
        success: false,
        message: "가게가 존재하지 않습니다.",
      });
    }

    const mission = await createMission(id, data);
    res.status(201).json({
      success: true,
      mission_id: mission.mission_id,
    });
  } catch (err) {
    console.error("❌ 미션 추가 오류:", err);
    res.status(500).json({
      success: false,
      message: "서버 오류",
    });
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
      data: formatted,
    });
  } catch (err) {
    console.error("❌ 미션 목록 조회 오류:", err);
    res.status(500).json({
      success: false,
      message: "서버 오류",
    });
  }
});


export default router;