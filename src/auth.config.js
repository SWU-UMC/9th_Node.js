// src/auth.config.js
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken";

dotenv.config();

// JWT Secret
const secret = process.env.JWT_SECRET;

// Access Token
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    secret,
    { expiresIn: "1h" }
  );
};

// Refresh Token
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    secret,
    { expiresIn: "14d" } //14일 유지
  );
};


// Google Verify (유저 조회/없으면 생성)

const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`profile.email was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    return { id: user.id, email: user.email, name: user.name };
  }

  const created = await prisma.user.create({
    data: {
      email,
      name: profile.displayName,
      gender: "N",
      birth: new Date(1970, 0, 1),
      phone_number: "추후 수정", 
      password: null,  
    },
  });

  return { id: created.id, email: created.email, name: created.name };
};

//Google OAuth Strategy
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "/oauth2/callback/google",
    scope: ["email", "profile"],
  },

  async (accessToken, refreshToken, profile, cb) => {
    try {
      // DB 검증/생성
      const user = await googleVerify(profile);

      // JWT 발급
      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      // passport에게 반환
      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } catch (err) {
      return cb(err);
    }
  }
);


//Passport에 전략 등록

passport.use(googleStrategy);

// JWT Strategy 옵션
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization: Bearer 토큰
    secretOrKey: process.env.JWT_SECRET,
  };
  
  // JWT Strategy 구현
  export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { id: payload.id } });
  
      if (user) {
        return done(null, user); // 인증 성공 → req.user에 user 저장됨
      } else {
        return done(null, false); // 실패
      }
    } catch (err) {
      return done(err, false);
    }
  });
  
  // JWT Strategy 등록
  passport.use(jwtStrategy);