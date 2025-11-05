// src/controllers/mission.controller.js
import express from "express";
import { findRestaurantById, createMission } from "../repositories/mission.repository.js";

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

export default router;