import { StatusCodes } from "http-status-codes";
import { bodyToRestaurant } from "../dtos/restaurant.dto.js";
import { 
  createRestaurant,
  listRestaurantReviews,
} from "../services/restaurant.service.js";

export const handleAddRestaurant = async (req, res, next) => {
  /*
    #swagger.summary = '가게 추가 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "제미니 식당" },
              address: { type: "string", example: "서울시 마포구" },
              detailAddress: { type: "string", example: "101호" },
              phoneNumber: { type: "string", example: "010-0000-0000" },
              regionId: { type: "number", example: 1 },
              categoryId: { type: "number", example: 1 }
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "가게 추가 성공",
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
                  name: { type: "string" },
                  regionName: { type: "string" },
                  categoryName: { type: "string" }
                }
              }
            }
          }
        }
      }
    };
  */
  console.log("가게 추가를 요청했습니다");
  console.log("body:", req.body);

  const restaurantData = bodyToRestaurant(req.body);
  const newRestaurant = await createRestaurant(restaurantData);
  res.status(StatusCodes.CREATED).success(newRestaurant);
};

export const handleListRestaurantReviews = async (req, res, next) => {
  /*
    #swagger.summary = '가게 리뷰 목록 조회 API';
    #swagger.parameters['restaurantId'] = { description: '가게 ID', type: 'number' };
    #swagger.parameters['cursor'] = { description: '페이징 커서', type: 'number', required: false };
    #swagger.responses[200] = {
      description: "가게 리뷰 목록 조회 성공",
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
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        content: { type: "string" },
                        user: { type: "object", properties: { name: { type: "string" } } }
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
  */
  const restaurantId = parseInt(req.params.restaurantId);
  const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;
  
  const reviews = await listRestaurantReviews(restaurantId, cursor);
  res.status(StatusCodes.OK).success(reviews);
};