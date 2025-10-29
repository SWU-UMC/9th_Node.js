//src/controllers/mission.controller.js:
//가게에 미션 추가하기!

const express = require("express");
const router = express.Router();
const pool = require("../services/db.config");


//src/controllers/mission.controller.js
router.post("/restaurant/:id/mission", async (req, res) => {
  const { id } = req.params;
  const { mission_title, mission_detail, reward_point } = req.body;

  try {
    const [restaurant] = await pool.query("SELECT * FROM restaurant WHERE restaurant_id = ?", [id]);
    if (restaurant.length === 0)
      return res.status(404).json({ success: false, message: "가게가 존재하지 않습니다." });

    const [result] = await pool.query(
      `INSERT INTO mission (restaurant_id, mission_title, mission_detail, reward_point)
       VALUES (?, ?, ?, ?)`,
      [id, mission_title, mission_detail, reward_point]
    );

    res.status(201).json({ success: true, mission_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

module.exports = router;