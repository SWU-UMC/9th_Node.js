import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { createReview } from "../services/review.service.js";

export const handleAddReview = async (req, res, next) => {
  /*
    #swagger.summary = '리뷰 작성 API';
    #swagger.parameters['restaurantId'] = { description: '가게 ID', type: 'number' };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "number", example: 1 },
              content: { type: "string", example: "맛있어요!" },
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
  */
  console.log("리뷰 추가를 요청했습니다");
  console.log("params (restaurantId):", req.params);
  console.log("body (userId, content, rating):", req.body);

  const reviewData = bodyToReview(req.body, req.params);
  const newReview = await createReview(reviewData);
  res.status(StatusCodes.CREATED).success(newReview);
};