//src/controllers/user_mission.controller.js
import express from "express";
import {
  startUserMission,
  completeUserMission,
  listInProgressMissionsByUser,
} from "../repositories/user_mission.repository.js";

const router = express.Router();

// 미션 도전 시작
//POST /api/user/:userId/mission/:missionId
router.post("/user/:userId/mission/:missionId", async (req, res) => {
  const { userId, missionId } = req.params;
  try {
    const [result] = await pool.query(
      "INSERT INTO user_mission (user_id, mission_id, status) VALUES (?, ?, 'in_progress')",
      [userId, missionId]
    );
    res.status(201).json({ success: true, user_mission_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// 미션 완료 처리 + 포인트 적립
//PATCH /api/user_mission/:id/complete
// 미션 도전
router.post("/user/:userId/mission/:missionId", async (req, res) => {
  const { userId, missionId } = req.params;
  try {
    const mission = await startUserMission(userId, missionId);
    res.status(201).json({ success: true, user_mission_id: mission.user_mission_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// 미션 완료
router.patch("/user_mission/:id/complete", async (req, res) => {
  const { id } = req.params;
  try {
    await completeUserMission(id);
    res.json({ success: true, message: "미션 완료 및 포인트 지급 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
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



// router.patch("/user_mission/:id/complete", async (req, res) => {
//   const { id } = req.params;
//   try {
//     // 상태 업데이트
//     await pool.query(
//       "UPDATE user_mission SET status='completed', completed_at=NOW() WHERE user_mission_id=?",
//       [id]
//     );

//     // 포인트 적립
//     const [missionData] = await pool.query(
//       `SELECT user_id, mission.reward_point 
//        FROM user_mission 
//        JOIN mission ON user_mission.mission_id = mission.mission_id 
//        WHERE user_mission.user_mission_id = ?`,
//       [id]
//     );

//     if (missionData.length > 0) {
//       const { user_id, reward_point } = missionData[0];
//       await pool.query(
//         "INSERT INTO point (user_id, point_value, description) VALUES (?, ?, ?)",
//         [user_id, reward_point, "미션 완료 보상"]
//       );
//     }

//     res.json({ success: true, message: "미션 완료 및 포인트 지급 완료" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "서버 오류" });
//   }
// });

export default router;