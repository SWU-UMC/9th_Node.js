import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { createReview } from "../services/review.service.js";

export const handleAddReview = async (req, res, next) => {
  /*
    #swagger.summary = '리뷰 작성 API';
    #swagger.security = [{ "bearerAuth": [] }];
    #swagger.parameters['restaurantId'] = { description: '가게 ID', type: 'number' };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              content: { type: "string", example: "정말 맛있어요!" },
              rating: { type: "number", example: 4.5 }
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "리뷰 작성 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  content: { type: "string" },
                  rating: { type: "number" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "가게가 존재하지 않음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "R001" },
                  reason: { type: "string", example: "존재하지 않는 가게입니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  console.log("리뷰 추가를 요청했습니다");
  console.log("params (restaurantId):", req.params);
  console.log("body (content, rating):", req.body);
  console.log("user (from jwt):", req.user); // 토큰에서 추출한 유저 정보 확인

  // req.user.id를 DTO의 3번째 인자로 전달
  const reviewData = bodyToReview(req.body, req.params, req.user.id);

  const newReview = await createReview(reviewData);
  res.status(StatusCodes.CREATED).success(newReview);
};