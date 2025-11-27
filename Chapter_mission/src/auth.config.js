import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken"; // JWT 생성을 위해 import
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

dotenv.config();
const secret = process.env.JWT_SECRET;  // .env의 비밀 키

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: String(user.id), email: user.email },
        secret,
        { expiresIn: '1h' }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: String(user.id) },
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

    const foundUser = await prisma.user.findFirst({ where: { email } });
    if (foundUser !== null) {
      return { id: String(foundUser.id), email: foundUser.email, name: foundUser.name };
    }

    const createdUser  = await prisma.user.create({
      data: {
        email,
        password: "GOOGLE_OAUTH_USER",
        // 선택 필드들
        name: "예원",
        birth: new Date("1999-01-01"),
        phoneNumber: "01012345678",
        gender: "FEMALE",   // enum (MALE | FEMALE | UNKNOWN)
        nickname: "워니",
        profileImage: "https://example.com/profile.jpg",

        // inactiveDate는 optional
        inactiveDate: null,
        },
    });

    return { id: String(createdUser.id), email: createdUser.email, name: createdUser.name };
}


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

      // 값 변경
      // const jwtAccessToken = "dummy-access-token";
      // const jwtRefreshToken = "dummy-refresh-token";
     
      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });

    } catch (err) {
      return cb(err);
    }
  }
);

const jwtOptions = {
  // 요청 헤더의 'Authorization'에서 'Bearer <token>' 토큰을 추출
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {

    const userId = BigInt(payload.id);

    const user = await prisma.user.findFirst({ where: { id: payload.id } });

    if (user) {
      // BigInt가 응답으로 나가지 않게 가공해서 넘김
      const safeUser = {
        id: String(user.id),
        email: user.email,
        name: user.name,
      };

      return done(null, safeUser);
    } else {
      return done(null, false);
    }
    } catch (err) {
      return done(err, false);
    }
});