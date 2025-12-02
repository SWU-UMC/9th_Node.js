// src/controllers/user.controller.js
//07에는 기존 res.json을 success, error로 통일할 수 있게 수정함.
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../db.config.js";
import {
  addUser,
  getUser,
  setPreference,
  getUserPreferencesByUserId,
} from "../repositories/user.repository.js";

const router = express.Router();


 // [POST] 회원가입 요청
 // URL: /api/users/signup

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     tags:
 *       - User
 *     summary: 회원가입
 *     description: |
 *       이 API는 사용자가 이메일, 비밀번호, 닉네임 등을 입력하여 새로운 계정을 생성할 때 사용됩니다.
 *
 *       예를 들어 회원가입 화면에서 가입하기 버튼을 눌렀을 때
 *       이 API에 입력한 정보가 전달되어 회원 정보가 저장됩니다.
 *
 *       성공 시 생성된 유저 정보를 반환합니다.
 *
 *     requestBody:
 *       required: true
 *       description: 사용자가 회원가입 화면에서 입력한 기본 정보입니다.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nickname
 *             properties:
 *               email:
 *                 type: string
 *                 example: "potato@example.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *               nickname:
 *                 type: string
 *                 example: "감자"
 *
 *     responses:
 *       201:
 *         description: 회원가입이 정상적으로 완료된 경우의 응답입니다.
 *         content:
 *           application/json:
 *             example:
 *               resultType: SUCCESS
 *               error: null
 *               success:
 *                 message: "회원가입 완료"
 *                 user:
 *                   user_id: 1
 *                   email: "test@example.com"
 *                   nickname: "감자"
 *                   created_at: "2025-01-01T10:00:00Z"
 *
 *       409:
 *         description: 이미 동일한 이메일로 가입된 계정이 있는 경우의 응답입니다.
 *         content:
 *           application/json:
 *             example:
 *               resultType: FAIL
 *               error:
 *                 errorCode: "DUPLICATE_EMAIL"
 *                 reason: "이미 존재하는 이메일입니다."
 *               success: null
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


 //[GET] 특정 사용자 정보 조회
 
/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     tags:
 *       - User
 *     summary: 사용자 정보 조회
 *     description: |
 *       이 API는 단일 사용자 정보를 조회할 때 사용됩니다.
 *
 *       예를 들어 마이페이지 화면을 열 때
 *       해당 유저의 프로필 정보를 불러오기 위해 사용됩니다.
 *
 *       사용자 아이디를 경로로 전달하면
 *       해당 유저의 상세 정보를 반환합니다.
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: 조회할 사용자의 고유 번호
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *         content:
 *           application/json:
 *             example:
 *               resultType: SUCCESS
 *               error: null
 *               success:
 *                 user_id: 1
 *                 email: "poteto@example.com"
 *                 nickname: "감자"
 *                 created_at: "2025-01-01T10:00:00Z"
 *
 *       404:
 *         description: 해당 유저가 존재하지 않는 경우
 *         content:
 *           application/json:
 *             example:
 *               resultType: FAIL
 *               error:
 *                 errorCode: USER_NOT_FOUND
 *                 reason: "사용자를 찾을 수 없습니다."
 *               success: null
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

 // [POST] 사용자 선호 음식 카테고리 등록

/**
 * @swagger
 * /api/users/{userId}/preferences:
 *   post:
 *     tags:
 *       - User
 *     summary: 사용자 선호 카테고리 등록
 *     description: |
 *       이 API는 사용자가 좋아하는 음식 카테고리를 선택하거나
 *       취향을 등록할 때 사용됩니다.
 *
 *       예를 들어 취향 분석 화면에서 유저가 카테고리를 선택하면
 *       선택된 카테고리를 저장하기 위해 이 API를 호출합니다.
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: 선호 카테고리를 등록할 사용자의 고유 번호
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *       description: 등록할 음식 카테고리의 고유 번호입니다.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               foodCategoryId:
 *                 type: number
 *                 example: 4
 *
 *     responses:
 *       201:
 *         description: 선호 카테고리가 정상적으로 저장된 경우
 *         content:
 *           application/json:
 *             example:
 *               resultType: SUCCESS
 *               error: null
 *               success:
 *                 message: "선호 카테고리가 추가되었습니다."
 *
 *       400:
 *         description: 카테고리 등록 실패 또는 잘못된 입력
 *         content:
 *           application/json:
 *             example:
 *               resultType: FAIL
 *               error:
 *                 errorCode: INVALID_CATEGORY
 *                 reason: "잘못된 카테고리입니다."
 *               success: null
 */

router.post("/users/:userId/preferences",isLogin, async (req, res, next) => { //선호 카테고리 등록은 로그인한 사용자만!
  try {
    await setPreference(Number(req.params.userId), Number(req.body.foodCategoryId));
    res.status(StatusCodes.CREATED).success({
      message: "선호 카테고리가 추가되었습니다.",
    });
  } catch (err) {
    next(err);
  }
});


 // [GET] 사용자 선호 음식 카테고리 목록 조회

/**
 * @swagger
 * /api/users/{userId}/preferences:
 *   get:
 *     tags:
 *       - User
 *     summary: 사용자 선호 카테고리 조회
 *     description: |
 *       이 API는 사용자가 등록한 선호 음식 카테고리 목록을 조회합니다.
 *
 *       예를 들어 마이페이지에서 내가 선택한 취향 목록을 보여주거나
 *       추천 시스템에서 선호 카테고리를 기반으로 추천할 때 사용됩니다.
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: 선호 카테고리를 조회할 사용자의 고유 번호
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: 선호 카테고리 목록 조회 성공
 *         content:
 *           application/json:
 *             example:
 *               resultType: SUCCESS
 *               error: null
 *               success:
 *                 - category_id: 4
 *                   category_name: "한식"
 *                 - category_id: 7
 *                   category_name: "일식"
 *
 *       404:
 *         description: 해당 유저가 등록한 선호 카테고리가 없는 경우
 *         content:
 *           application/json:
 *             example:
 *               resultType: FAIL
 *               error:
 *                 errorCode: NO_PREFERENCES
 *                 reason: "등록된 선호 카테고리가 없습니다."
 *               success: null
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

// 로그인한 유저가 자신의 정보 수정 하는 api를 생성! 
router.patch("/users/me", isLogin, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { nickname, phone_number, birth } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        nickname,
        phone_number,
        birth: birth ? new Date(birth) : undefined,
      },
    });

    return res.success({
      message: "내 정보가 성공적으로 수정되었습니다.",
      user: updated,
    });
  } catch (err) {
    next(err);
  }
});

export default router;