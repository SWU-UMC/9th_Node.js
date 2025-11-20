import { StatusCodes } from "http-status-codes";
import { reviewAdd, listMyReviews } from "../services/review.service.js";

export const addReviewController = async (req, res, next) => {
  /*
  #swagger.summary = '리뷰 등록 API'
  #swagger.parameters['restaurant_id'] = {
    in: 'path',
    description: '리뷰를 남길 레스토랑 ID',
    required: true,
    type: 'number',
    example: 2
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["user_id","mission_id", "content", "rating", "photo"],
          properties: {
            user_id: { type: "number", example: 5, description: "리뷰 작성자 ID" },
            mission_id: { type: "number", example: 1, description: "미션 Id"},
            content: { type: "string", example: "여기 진짜 맛있어요!" },
            rating: { type: "number", example: 5, description: "별점 (1~5)" },
            photo: { type: "string", nullable: true, example: "https://cdn.example.com/photo1.jpg" }
          }
        }
      }
    }
  }

  #swagger.responses[200] = {
    description: "리뷰 등록 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              description: "등록된 리뷰 데이터",
              properties: {
                review_id: { type: "number", example: 50 },
                user_id: { type: "number", example: 1 },
                mission_id: { type: "number", example: 101, nullable: true },
                restaurant_id: { type: "number", example: 12 },
                content: { type: "string", example: "여기 너무 맛있어요!" },
                rating: { type: "number", example: 5 },
                photo: { type: "string", example: "https://cdn.example.com/photo1.jpg" },
                created_at: { type: "string", example: "2025-01-22T12:33:11.000Z" }
              }
            }
          }
        }
      }
    }
  }
*/
    try {
        const { restaurant_id } = req.params;
        const { user_id, mission_id } = req.body;

      const review = await reviewAdd(
      Number(user_id), 
      Number(mission_id),  
      req.body // content, rating, photo 등이 담긴 객체
    );

        res.status(StatusCodes.CREATED(201)).success(review);
  } catch (error) {
    next(error);
    }
  };

// '내가 쓴 리뷰' 목록을 조회하는 전용 컨트롤러
export const handleUserReviewList = async (req, res, next) => {
  /*
  #swagger.summary = '내가 쓴 리뷰 목록 조회 API';
  #swagger.parameters['user_id'] = {
    in: 'path',
    description: '사용자 ID',
    required: true,
    type: 'number',
    example: 12
  }

  #swagger.parameters['cursor'] = {
    in: 'query',
    description: '페이지네이션용 커서',
    required: false,
    type: 'number',
    example: 10
  }

  #swagger.parameters['limit'] = {
    in: 'query',
    description: '한 번에 가져올 리뷰 개수',
    required: false,
    type: 'number',
    example: 5
  }

  #swagger.responses[200] = {
    description: "내가 쓴 리뷰 목록 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              description: "내가 쓴 리뷰 데이터",
              properties: {
                data: { 
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      review_id: { type: "number", example: 1 },
                      restaurant_name: { type: "string", example: "김밥천국 홍대점" },
                      rating: { type: "number", example: 4 },
                      content: { type: "string", example: "여기 너무 맛있어요!" },
                      created_at: { type: "string", example: "2025-01-22T12:33:11.000Z" }
                    }
                  }
                },
                nextCursor: {
                  type: "number",
                  nullable: true,
                  example: 20,
                  description: "다음 페이지 호출을 위한 커서 (없으면 null)"
                }
              }
            }
          }
        }
      } 
    }
  }; 
*/

  try {
    const userId = parseInt(req.params.user_id); 
    const { cursor, limit = 5 } = req.query;

    const cursorValue = req.query.cursor ? parseInt(req.query.cursor, 10) : 0;
        const limitValue = req.query.limit ? parseInt(req.query.limit, 10) : 5;

    if (isNaN(userId)) {
    throw new Error('유효하지 않은 사용자 ID 형식입니다.');
    }

    const { reviews, nextCursor } = await listMyReviews( // 👈 서비스 함수 사용
            userId,
            cursorValue,
            limitValue
        );    
        
        res.status(StatusCodes.OK).success({ 
            data: reviews.map(r => ({
                review_id: r.review_id,
                restaurant_name: r.restaurant.restaurant_name, 
                rating: r.rating,
                content: r.content,
                created_at: r.created_at,
            })),
            nextCursor,
        });
    } catch (error) {
        next(error);
    }
};