// src/controllers/user.controller.js
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
router.post("/users/signup", async (req, res) => {
  console.log("📩 회원가입 요청 도착");
  console.log("body:", req.body);

  try {
    const createdUserId = await addUser(req.body);

    if (!createdUserId) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, message: "이미 존재하는 이메일입니다." });
    }

    const user = await getUser(createdUserId);
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, user, message: "회원가입 완료" });
  } catch (err) {
    console.error("❌ 회원가입 오류:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "서버 오류" });
  }
});

/**
 * [GET] 특정 사용자 정보 조회
 * URL: /api/users/:userId
 */
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getUser(Number(userId));
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    res.status(StatusCodes.OK).json({ success: true, user });
  } catch (err) {
    console.error("❌ 사용자 조회 오류:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "서버 오류" });
  }
});

/**
 * [POST] 사용자 선호 음식 카테고리 등록
 * URL: /api/users/:userId/preferences
 */
router.post("/users/:userId/preferences", async (req, res) => {
  const { userId } = req.params;
  const { foodCategoryId } = req.body;

  try {
    await setPreference(Number(userId), Number(foodCategoryId));
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "선호 카테고리가 추가되었습니다." });
  } catch (err) {
    console.error("❌ 선호 카테고리 추가 오류:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "서버 오류" });
  }
});

/**
 * [GET] 사용자 선호 음식 카테고리 목록 조회
 * URL: /api/users/:userId/preferences
 */
router.get("/users/:userId/preferences", async (req, res) => {
  const { userId } = req.params;

  try {
    const preferences = await getUserPreferencesByUserId(Number(userId));

    if (!preferences.length) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({
          success: false,
          message: "등록된 선호 카테고리가 없습니다.",
          data: [],
        });
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, data: preferences });
  } catch (err) {
    console.error("❌ 선호 카테고리 조회 오류:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "서버 오류" });
  }
});

export default router;