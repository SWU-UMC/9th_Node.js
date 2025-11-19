// src/controllers/review.controller.js
import express from "express";
import axios from "axios"; // 외부 API (현재 미사용)
import { prisma } from "../db.config.js"; 
import { findReviewsByUserId, listStoreReviews } from "../repositories/review.repository.js"; // ✅ Repository import
import { ReviewCreationError, ReviewNotFoundError } from "../errors.js"; //에러 관리
const router = express.Router();



/**
 * [POST] 리뷰 추가하기
 * URL: /api/review
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

/**
 * [GET] 특정 가게의 리뷰 목록 조회
 * URL: /api/v1/stores/:storeId/reviews
 */
/*
  #swagger.tags = ['Review']
  #swagger.summary = '상점 리뷰 목록 조회 API'
  #swagger.description = '특정 가게의 리뷰들을 조회합니다.'

  #swagger.parameters['storeId'] = {
    in: 'path',
    description: '가게 ID',
    required: true,
    type: 'integer',
    example: 10
  }

  #swagger.responses[200] = {
    description: "상점 리뷰 목록 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            // 6주차 공통 응답 구조
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                
                // 메시지
                message: { type: "string", example: "리뷰 목록 조회 성공" },

                // 리뷰 배열 (여기서 data 배열)
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      review_id: { type: "number", example: 12 },
                      user_id: { type: "number", example: 3 },
                      mission_id: { type: "number", example: 5 },
                      restaurant_id: { type: "number", example: 10 },
                      
                      rating: { type: "number", example: 5 },
                      content: { type: "string", example: "정말 맛있어요!" },
                      photo: { type: "string", nullable: true, example: null },

                      created_at: { type: "string", example: "2025-01-10T10:00:00Z" },

                      // 중첩 관계 (JOIN 데이터이니 optional)
                      user: {
                        type: "object",
                        nullable: true,
                        properties: {
                          nickname: { type: "string", example: "감자왕" },
                          profile_image: { type: "string", nullable: true }
                        }
                      },
                      restaurant: {
                        type: "object",
                        nullable: true,
                        properties: {
                          restaurant_name: { type: "string", example: "감자탕 맛집" }
                        }
                      }
                    }
                  }
                },

                // 페이지네이션 (현재는 너의 API에서 제공 안 함 → optional)
                pagination: {
                  type: "object",
                  nullable: true,
                  properties: {
                    cursor: { type: "number", nullable: true, example: 20 }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
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

/**
 * [GET] 내가 작성한 리뷰 목록 조회
 * URL: /api/users/:userId/reviews
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

 