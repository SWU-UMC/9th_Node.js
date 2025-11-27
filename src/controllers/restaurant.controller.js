import { StatusCodes } from "http-status-codes";
import { restaurantAdd, listRestaurantReviews, missionListByRestaurant } from "../services/restaurant.service.js";

export const regionForRestaurant = async (req, res, next) => {
  /*
  #swagger.summary = '레스토랑 등록 API';
  #swagger.description = '레스토랑 정보를 입력받아 새로운 레스토랑을 생성합니다.';

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["restaurant_name", "restaurant_address", "latitude", "longitude"],
          properties: {
            restaurant_name: { 
              type: "string", 
              example: "스시 하루",
              description: "레스토랑 이름" 
            },
            restaurant_address: { 
              type: "string", 
              example: "서울 강남구 테헤란로 123",
              description: "레스토랑 주소" 
            },
            latitude: { 
              type: "number", 
              example: "37.498",
              description: "위도" 
            },
            longitude: { 
              type: "number", 
              example: "127.027",
              description: "경도" 
            }
          }
        }
      }
    }
  }

  #swagger.responses[200] = {
    description: "레스토랑 등록 성공",
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
                  type: "object",
                  properties: {
                    restaurant_id: { type: "number", example: 10 },
                    restaurant_name: { type: "string", example: "김밥천국 강남점" },
                    restaurant_address: { type: "string", example: "서울 강남구 테헤란로 123" },
                    latitude: { type: "float", example: "37.498" },
                    longitude: { type: "float", example: "127.027" },
                    created_at: { type: "string", example: "2025-01-10T12:30:00Z" }
                  }
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
    console.log("body:", req.body);
    const restaurant = await restaurantAdd(req.body); 
    res.status(StatusCodes.CREATED).success(restaurant);
  } catch (error) {
    next(error);
    }
  };

//특정 레스토랑의 리뷰 목록
export const handleListRestaurantReviews = async (req, res, next) => {
/*
  #swagger.summary = '레스토랑 리뷰 목록 조회 API';
  #swagger.responses[200] = {
    description: "레스토랑 리뷰 목록 조회 성공 응답",
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
                      restaurant: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                      user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
                      content: { type: "string" }
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
  try {
  const reviews = await listRestaurantReviews(
    parseInt(req.params.restaurant_id),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.CREATED).success(reviews);
} catch (error) {
  next(error);
}
};

//특정 레스토랑 미션 목록
export const getMissionsByRestaurantController = async (req, res, next) => {
  /*
  #swagger.summary = '특정 레스토랑 미션 목록 조회 API';
  #swagger.description = '특정 레스토랑에 등록된 미션들을 커서 기반으로 조회합니다.';

  #swagger.parameters['restaurant_id'] = {
    in: "path",
    required: true,
    description: "레스토랑 ID",
    schema: { type: "number", example: 3 }
  }

  #swagger.parameters['cursor'] = {
    in: "query",
    required: false,
    description: "커서 값(마지막 mission_id). 없으면 0부터 시작.",
    schema: { type: "number", example: 10 }
  }

  #swagger.parameters['limit'] = {
    in: "query",
    required: false,
    description: "한 페이지에 불러올 미션 수",
    schema: { type: "number", example: 5 }
  }

  #swagger.responses[200] = {
    description: "레스토랑 미션 목록 조회 성공",
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
                      mission_id: { type: "number", example: 12 },
                      title: { type: "string", example: "산책 인증 미션" },
                      description: { type: "string", example: "3km 산책 인증하면 리워드 지급" },
                      reward: { type: "number", example: 500 }
                    }
                  }
                },
                pagination: {
                  type: "object",
                  properties: {
                    cursor: { 
                      type: "number", 
                      nullable: true, 
                      example: 15,
                      description: "다음 페이지 요청 시 사용할 커서 값"
                    }
                  }
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
    const { restaurant_id } = req.params;
    const { cursor, limit } = req.query;

    const result = await missionListByRestaurant(
      restaurant_id,
      typeof cursor === "string" ? parseInt(cursor) : 0,
      Number(limit) || 5
    );

    res.status(StatusCodes.CREATED).success(result);
  } catch (error) {
    next(error);
  }
};