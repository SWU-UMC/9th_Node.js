// src/middlewares/auth.middleware.js
import passport from "passport";

export const isLogin = passport.authenticate("jwt", { session: false })