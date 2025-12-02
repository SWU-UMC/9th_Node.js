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
    /*
      #swagger.tags = ['Auth']
      #swagger.summary = 'Google OAuth 콜백'
      #swagger.description = 'Google 로그인 성공 후 Access Token, Refresh Token을 발급합니다.'

      #swagger.responses[200] = {
        description: 'Google OAuth 로그인 성공',
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/GoogleOAuthLoginResponse"
            }
          }
        }
      }

      #swagger.responses[401] = {
        description: 'Google OAuth 로그인 실패',
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse"
            }
          }
        }
      }
    */

    const tokens = req.user;

    res.json({
      resultType: "SUCCESS",
      success: {
        message: "Google 로그인 성공!",
        tokens,
      }
    });
  }
);

export default router;