// src/controllers/region.controller.js
import express from "express";
import { prisma } from "../db.config.js";
import { findRegionById, createRestaurant } from "../repositories/region.repository.js" ;
import { RegionNotFoundError, RestaurantCreationError } from "../errors.js"; // 에러 추가

const router = express.Router();

/**
 * [POST] 특정 지역에 가게 추가하기
 * URL: /api/region/:regionId/restaurant
 */
router.post("/region/:regionId/restaurant", async (req, res, next) => {
  const { regionId } = req.params;
  const data = req.body;

  try {
    const region = await findRegionById(regionId);
    if (!region)
      return res.status(404).json({ success: false, message: "지역이 존재하지 않습니다." });

    const restaurant = await createRestaurant(regionId, data);
    res.status(201).json({ success: true, restaurant_id: restaurant.restaurant_id });
  } catch (err) {
    next(err); // 에러 전달.
  }
});

export default router;