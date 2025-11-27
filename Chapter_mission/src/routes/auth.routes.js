// routes/auth.routes.js
import passport from "passport";
import express from "express";
const router = express.Router();

// OAuth2 Google 로그인 엔드포인트
router.get("/oauth2/login/google",
  passport.authenticate("google", { session: false })
);

router.get("/oauth2/callback/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    res.json({
      resultType: "SUCCESS",
      success: {
        message: "Google 로그인 성공!",
        tokens: req.user
      }
    });
  }
);

export default router;