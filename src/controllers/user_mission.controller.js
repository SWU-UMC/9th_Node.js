//src/controllers/user_mission.controller.js
import express from "express";
import {
  startUserMission,
  completeUserMission,
  listInProgressMissionsByUser,
} from "../repositories/user_mission.repository.js";

const router = express.Router();

/**
 * [POST] 미션 도전 시작
 * URL: /api/user/:userId/mission/:missionId
 */
router.post("/user/:userId/mission/:missionId", async (req, res) => {
  const { userId, missionId } = req.params;

  try {
    const mission = await startUserMission(userId, missionId);
    res.status(201).json({
      success: true,
      message: "미션 도전이 시작되었습니다!",
      user_mission_id: mission.user_mission_id,
    });
  } catch (err) {
    console.error("❌ 미션 도전 오류:", err);
    res.status(500).json({
      success: false,
      message: "서버 오류",
    });
  }
});



/**
 * [PATCH] 미션 완료 처리 + 포인트 적립
 * URL: /api/user_mission/:id/complete
 */
router.patch("/user_mission/:id/complete", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await completeUserMission(id);

    res.json({
      success: true,
      message: `미션 완료! ${result.mission.reward_point}P 지급 완료 🎉`,
      data: {
        user_mission_id: result.user_mission_id,
        user_id: result.user_id,
        mission_id: result.mission_id,
        mission_title: result.mission.mission_title,
        reward_point: result.mission.reward_point,
        completed_at: result.completed_at,
      },
    });
  } catch (err) {
    console.error("❌ 미션 완료 오류:", err);
    res.status(500).json({
      success: false,
      message: "서버 오류",
    });
  }
});



/**
 * [GET] 사용자의 진행 중인 미션 목록 조회
 * URL: /api/users/:userId/missions/in-progress
 */
router.get("/users/:userId/missions/in-progress", async (req, res) => {
  const { userId } = req.params;

  try {
    const missions = await listInProgressMissionsByUser(userId);

    const formatted = missions.map((m) => ({
      user_id: m.user_id,
      restaurant_name: m.mission.restaurant.restaurant_name,
      region_id: m.mission.restaurant.region_id,
      mission_id: m.mission.mission_id,
      mission_title: m.mission.mission_title,
      mission_detail: m.mission.mission_detail,
      reward_point: m.mission.reward_point,
      started_at: m.started_at,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    console.error("❌ 진행 중 미션 조회 오류:", err);
    res.status(500).json({
      success: false,
      message: "서버 오류",
    });
  }
});



export default router;