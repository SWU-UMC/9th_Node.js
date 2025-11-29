// src/routes/missions.route.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  handleChallengeMission,
  handleCompleteMission,
} from "../controllers/userMission.controller.js";

const router = Router();

router.post("/missions/:mission_id/challenges", authMiddleware, handleChallengeMission);
router.patch(
  "/user-missions/:user_mission_id/complete",
  authMiddleware,
  handleCompleteMission
);

export default router;