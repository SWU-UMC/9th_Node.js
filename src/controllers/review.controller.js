// src/controllers/review.controller.js
import express from "express";
import axios from "axios"; // 외부 API (현재 미사용)
import { prisma } from "../db.config.js"; 
import { findReviewsByUserId, listStoreReviews } from "../repositories/review.repository.js"; // ✅ Repository import
import { ReviewCreationError, ReviewNotFoundError } from "../errors.js"; //에러 관리
const router = express.Router();




 //[POST] 리뷰 추가하기
 //URL: /api/review

/**
 * @swagger
 * /api/review:
 *   post:
 *     tags:
 *       - Review
 *     summary: 리뷰 작성
 *     description: |
 *       이 API는 사용자가 미션을 완료한 뒤 리뷰를 작성할 때 사용됩니다.
 *
 *       예를 들어 미션을 수행한 뒤 화면에서 리뷰 작성 버튼을 눌렀을 때
 *       이 API에 리뷰 정보가 전달됩니다.
 *
 *       저장되는 내용은 다음과 같습니다.
 *       - 어떤 미션에 대한 리뷰인지
 *       - 어떤 가게에 남기는 리뷰인지
 *       - 어떤 유저가 작성했는지
 *       - 별점과 후기 내용
 *       - 사진이 있는 경우 함께 저장됩니다.
 *
 *     requestBody:
 *       required: true
 *       description: |
 *         리뷰 작성에 필요한 정보입니다.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mission_id:
 *                 type: number
 *                 example: 3
 *               restaurant_id:
 *                 type: number
 *                 example: 10
 *               user_id:
 *                 type: number
 *                 example: 5
 *               rating:
 *                 type: number
 *                 example: 5
 *               content:
 *                 type: string
 *                 example: 정말 맛있게 먹었어요
 *               photo:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               restaurant_name:
 *                 type: string
 *                 example: 가게이름a
 *
 *     responses:
 *       201:
 *         description: |
 *           리뷰가 정상적으로 저장된 경우입니다.
 *         content:
 *           application/json:
 *             example:
 *               resultType: SUCCESS
 *               error: null
 *               success:
 *                 message: 리뷰가 성공적으로 등록되었습니다.
 *                 data:
 *                   review_id: 25
 *                   verified_store: 가게이름a
 *
 *       400:
 *         description: |
 *           요청 데이터가 잘못된 경우의 예시입니다.
 *         content:
 *           application/json:
 *             example:
 *               resultType: FAIL
 *               error:
 *                 errorCode: REVIEW_CREATION_FAILED
 *                 reason: 리뷰 작성에 실패했습니다.
 *               success: null
 */

router.post("/review", async (req, res,next) => {
  const { mission_id, restaurant_id, user_id, content, rating, photo, restaurant_name } = req.body;

  try {
    const newReview = await prisma.mission_review.create({
      data: {
        mission_id: Number(mission_id),
        restaurant_id: Number(restaurant_id),
        user_id: Number(user_id),
        content,
        rating: Number(rating),
        photo,
      },
    });
    if (!newReview) {
      throw new ReviewCreationError("리뷰 작성에 실패했습니다.", req.body);
    }

    res.status(201).success({
      message: "리뷰가 성공적으로 등록되었습니다.",
      data: {
        review_id: newReview.review_id,
        verified_store: restaurant_name,
      },
    });
  } catch (err) {
    next(err);
  }
});


 //[GET] 특정 가게의 리뷰 목록 조회
 // URL: /api/v1/stores/:storeId/reviews

/**
 * @swagger
 * /api/v1/stores/{storeId}/reviews:
 *   get:
 *     tags:
 *       - Review
 *     summary: 특정 가게의 리뷰 목록 조회
 *     description: |
 *       이 API는 특정 가게에 등록된 모든 리뷰를 조회하는 기능입니다.
 *
 *       화면에서 가게 상세 페이지를 열 때
 *       해당 가게의 리뷰 목록을 불러오기 위해 사용됩니다.
 *
 *       반환되는 정보는 다음과 같습니다.
 *       - 리뷰 아이디
 *       - 몇 점을 주었는지
 *       - 리뷰 내용
 *       - 리뷰 사진 여부
 *       - 작성한 날짜
 *       - 작성자 닉네임과 프로필 사진
 *       - 가게 이름
 *
 *       가게 상세 화면에 리뷰를 표시할 때 사용됩니다.
 *
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         description: 리뷰를 조회할 가게의 고유 번호
 *         schema:
 *           type: integer
 *           example: 10
 *
 *     responses:
 *       200:
 *         description: |
 *           리뷰 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: 리뷰 목록 조회 성공
 *                     data:
 *                       type: array
 *                       description: 가게 리뷰 리스트
 *                       items:
 *                         type: object
 *                         properties:
 *                           review_id:
 *                             type: number
 *                             example: 12
 *                           user_id:
 *                             type: number
 *                             example: 3
 *                           mission_id:
 *                             type: number
 *                             example: 5
 *                           restaurant_id:
 *                             type: number
 *                             example: 10
 *                           rating:
 *                             type: number
 *                             example: 5
 *                           content:
 *                             type: string
 *                             example: 정말 맛있어요
 *                           photo:
 *                             type: string
 *                             example: null
 *                           created_at:
 *                             type: string
 *                             example: 2025-01-10T10:00:00Z
 *                           user:
 *                             type: object
 *                             properties:
 *                               nickname:
 *                                 type: string
 *                                 example: 감자왕
 *                               profile_image:
 *                                 nullable: true
 *                           restaurant:
 *                             type: object
 *                             properties:
 *                               restaurant_name:
 *                                 type: string
 *                                 example: 감자탕 맛집
 *
 *       404:
 *         description: |
 *           해당 가게에 리뷰가 아예 없는 경우
 *         content:
 *           application/json:
 *             example:
 *               resultType: FAIL
 *               error:
 *                 errorCode: REVIEW_NOT_FOUND
 *                 reason: 해당 가게의 리뷰가 존재하지 않습니다.
 *               success: null
 */
router.get("/v1/stores/:storeId/reviews", async (req, res,next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor =
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const reviews = await listStoreReviews(storeId, cursor);
    
    if (!reviews.length) {
      throw new ReviewNotFoundError("해당 가게의 리뷰가 존재하지 않습니다.", { storeId });
    }

    res.status(200).success({
      message: "리뷰 목록 조회 성공",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
});


 // [GET] 내가 작성한 리뷰 목록 조회
 // URL: /api/users/:userId/reviews

/**
 * @swagger
 * /api/users/{userId}/reviews:
 *   get:
 *     tags:
 *       - Review
 *     summary: 내가 작성한 리뷰 조회
 *     description: |
 *       이 API는 특정 유저가 지금까지 작성한 모든 리뷰를 조회하는 기능입니다.
 *
 *       마이페이지에서 내가 남긴 리뷰 목록을 볼 때 사용됩니다.
 *
 *       응답에 포함되는 정보는 다음과 같습니다.
 *       - 리뷰 아이디
 *       - 가게 이름
 *       - 별점
 *       - 리뷰 내용
 *       - 리뷰 사진
 *       - 작성 시간
 *       - 내 프로필 정보
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: 리뷰를 조회할 유저의 고유 번호
 *         schema:
 *           type: integer
 *           example: 4
 *
 *     responses:
 *       200:
 *         description: 유저가 작성한 리뷰 목록 조회 성공
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - review_id: 23
 *                   restaurant_name: 홍대돈까스
 *                   rating: 5
 *                   content: 너무 맛있었어요
 *                   photo: null
 *                   owner_reply: null
 *                   created_at: 2025-02-01T12:30:00Z
 *                   user_nickname: 감자
 *                   user_profile_image: null
 *
 *       404:
 *         description: 해당 유저가 작성한 리뷰가 없는 경우
 *         content:
 *           application/json:
 *             example:
 *               resultType: FAIL
 *               error:
 *                 errorCode: REVIEW_NOT_FOUND
 *                 reason: 작성한 리뷰가 없습니다.
 *               success: null
 */
router.get("/users/:userId/reviews", async (req, res,next) => {
  const { userId } = req.params;

  try {
    const reviews = await findReviewsByUserId(userId);

    if (!reviews.length) {
      throw new ReviewNotFoundError("작성한 리뷰가 없습니다.", { userId });
    }

    const formatted = reviews.map((r) => ({
      review_id: r.review_id,
      restaurant_name: r.restaurant?.restaurant_name,
      rating: r.rating,
      content: r.content,
      photo: r.photo,
      owner_reply: r.owner_reply,
      created_at: r.created_at,
      user_nickname: r.user?.nickname,
      user_profile_image: r.user?.profile_image,
    }));

    res.status(200).json({ success: true, data: formatted });
  }  catch (err) {
    next(err);
  }
});

export default router;

 