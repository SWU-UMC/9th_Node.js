// src/controllers/user.controller.js
//07에는 기존 res.json을 success, error로 통일할 수 있게 수정함.
import express from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../db.config.js";
import {
  addUser,
  getUser,
  setPreference,
  getUserPreferencesByUserId,
} from "../repositories/user.repository.js";

const router = express.Router();

/**
 * [POST] 회원가입 요청
 * URL: /api/users/signup
 */
/*
  #swagger.tags = ['User']
  #swagger.summary = '회원가입 API'
  #swagger.description = '이메일, 비밀번호, 닉네임 등 사용자 정보를 입력받아 회원가입을 처리합니다.'

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["email", "password", "nickname"],
          properties: {
            email: { type: "string", example: "test@example.com" },
            password: { type: "string", example: "12345678" },
            nickname: { type: "string", example: "감자러버" }
          }
        }
      }
    }
  }

  #swagger.responses[201] = {
    description: "회원가입 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              example: {
                message: "회원가입 완료",
                user: {
                  user_id: 1,
                  email: "test@example.com",
                  nickname: "감자러버",
                  created_at: "2025-01-01T10:00:00Z"
                }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[409] = {
    description: "이미 존재하는 이메일",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              example: {
                errorCode: "DUPLICATE_EMAIL",
                reason: "이미 존재하는 이메일입니다."
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }
*/
router.post("/users/signup", async (req, res, next) => {
  try {
    const createdUserId = await addUser(req.body);

    if (!createdUserId) {
      return res.status(StatusCodes.CONFLICT).error({
        errorCode: "DUPLICATE_EMAIL",
        reason: "이미 존재하는 이메일입니다.",
      });
    }

    const user = await getUser(createdUserId);
    res.status(StatusCodes.CREATED).success({
      message: "회원가입 완료",
      user,
    });
  } catch (err) {
    next(err); // 전역 에러 미들웨어로 전달
  }
});

/**
 * [GET] 특정 사용자 정보 조회
 */
router.get("/users/:userId", async (req, res, next) => {
  try {
    const user = await getUser(Number(req.params.userId));
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).error({
        errorCode: "USER_NOT_FOUND",
        reason: "사용자를 찾을 수 없습니다.",
      });
    }

    res.status(StatusCodes.OK).success(user);
  } catch (err) {
    next(err);
  }
});

/**
 * [POST] 사용자 선호 음식 카테고리 등록
 */
router.post("/users/:userId/preferences", async (req, res, next) => {
  try {
    await setPreference(Number(req.params.userId), Number(req.body.foodCategoryId));
    res.status(StatusCodes.CREATED).success({
      message: "선호 카테고리가 추가되었습니다.",
    });
  } catch (err) {
    next(err);
  }
});

/**
 * [GET] 사용자 선호 음식 카테고리 목록 조회
 */
router.get("/users/:userId/preferences", async (req, res, next) => {
  try {
    const preferences = await getUserPreferencesByUserId(Number(req.params.userId));

    if (!preferences.length) {
      return res.status(StatusCodes.NOT_FOUND).error({
        errorCode: "NO_PREFERENCES",
        reason: "등록된 선호 카테고리가 없습니다.",
        data: [],
      });
    }

    res.status(StatusCodes.OK).success(preferences);
  } catch (err) {
    next(err);
  }
});

export default router;