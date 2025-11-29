// src/routes/stores.route.js

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { handleAddStore } from "../controllers/store.controller.js";
import { handleAddMission,
        handleListMissionsByStore, } from "../controllers/mission.controller.js";
import { handleAddReview,
        handleListStoreReviews, } from "../controllers/review.controller.js";

const router = Router();

// 지역 + 가게
router.post("/regions/:region_id/stores", authMiddleware, handleAddStore);

// 가게 미션
router.get("/stores/:store_id/missions", handleListMissionsByStore);
router.post("/stores/:store_id/missions", authMiddleware, handleAddMission);

// 가게 리뷰
router.post("/stores/:store_id/reviews", authMiddleware, handleAddReview);
router.get("/stores/:store_id/reviews", handleListStoreReviews);

export default router;