import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken"; // JWT 생성을 위해 import 

dotenv.config();
const secret = process.env.JWT_SECRET; // .env의 비밀 키 

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    secret,                           
    { expiresIn: '1h' }                 
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },                   
    secret,
    { expiresIn: '14d' }                
  );
};


// GoogleVerify 
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
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
    },
  });

  return { id: created.id, email: created.email, name: created.name };
};

// GoogleStrategy 

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "/oauth2/callback/google", 
    scope: ["email", "profile"],
  },
  

  async (accessToken, refreshToken, profile, cb) => {
    try {
     
      const user = await googleVerify(profile);
      
      
      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);


     
      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });

    } catch (err) {
      return cb(err);
    }
  }
);

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const jwtOptions = {
  // 요청 헤더의 'Authorization'에서 'Bearer <token>' 토큰을 추출
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: payload.id } });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

/**
 * JWT 인증 미들웨어
 * 인증이 필요한 라우트에 사용
 */
export const authenticateJWT = (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error('JWT 인증 오류:', err);
      return res.status(500).json({
        success: false,
        message: '인증 처리 중 오류가 발생했습니다.'
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }
    
    // 인증된 사용자 정보를 req.user에 저장
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * 관리자 권한 확인 미들웨어
 * 관리자만 접근 가능한 라우트에 사용
 */
export const requireAdmin = (req, res, next) => {
  // authenticateJWT 미들웨어를 먼저 통과해야 함
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '인증이 필요합니다.'
    });
  }

  // 여기서는 간단히 isAdmin 플래그로 관리자 여부를 확인
  // 실제 구현에서는 사용자 역할(role)을 확인하는 로직으로 대체해야 함
  if (req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: '관리자 권한이 필요합니다.'
  });
};