//src/controllers/region.controller.js: 
// 특정 지역에 가게 추가하기!

const express = require("express");
const router = express.Router();
const pool = require("../services/db.config");

//POST /api/region/:regionId/restaurant
// 특정 지역에 가게 추가
router.post("/region/:regionId/restaurant", async (req, res) => {
  const { regionId } = req.params;
  const data = req.body;

  try {
    const region = await findRegionById(regionId);
    if (!region) return res.status(404).json({ success: false, message: "지역이 존재하지 않습니다." });

    const restaurant = await createRestaurant(regionId, data);
    res.status(201).json({ success: true, restaurant_id: restaurant.restaurant_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});
// router.post("/region/:regionId/restaurant", async (req, res) => {
//   const { regionId } = req.params;
//   const { restaurant_name, restaurant_address, latitude, longitude } = req.body;

//   try {
//     const [region] = await pool.query("SELECT * FROM region WHERE region_id = ?", [regionId]);
//     if (region.length === 0) {
//       return res.status(404).json({ success: false, message: "지역이 존재하지 않습니다." });
//     }

//     const [result] = await pool.query(
//       "INSERT INTO restaurant (region_id, restaurant_name, restaurant_address, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
//       [regionId, restaurant_name, restaurant_address, latitude, longitude]
//     );

//     res.status(201).json({ success: true, restaurant_id: result.insertId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "서버 오류" });
//   }
// });

module.exports = router;