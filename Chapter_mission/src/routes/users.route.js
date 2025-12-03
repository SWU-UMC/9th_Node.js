// src/routes/users.route.js

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { handleUserSignUp,
        handleUpdateMe,
        handleGetMe,
} from "../controllers/user.controller.js";
import { handleListUserReviews} from "../controllers/review.controller.js";
import { handleListActiveMissions } from "../controllers/userMission.controller.js";


const router = Router();

router.post("/users/signup", handleUserSignUp);
router.get("/users/me", authMiddleware, handleGetMe);
router.patch("/users/me", authMiddleware, handleUpdateMe);
router.get("/users/:user_id/reviews", handleListUserReviews);
router.get("/users/me/missions", authMiddleware, handleListActiveMissions);

export default router;