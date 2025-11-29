// src/routes/users.route.js

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { handleUserSignUp,
        handleUpdateMe
} from "../controllers/user.controller.js";
import { handleListUserReviews} from "../controllers/review.controller.js";
import { handleListActiveMissions } from "../controllers/userMission.controller.js";


const router = Router();

router.post("/users/signup", handleUserSignUp);
router.patch("/users/me", authMiddleware, handleUpdateMe);
router.get("users/:user_id/reviews", handleListUserReviews);
router.get("/users/:user_id/missions", handleListActiveMissions);

export default router;