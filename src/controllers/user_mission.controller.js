//src/controllers/user_mission.controller.js
//유저의 미션 도전 및 완료

const express = require("express");
const router = express.Router();
const pool = require("../services/db.config");

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

module.exports = router;