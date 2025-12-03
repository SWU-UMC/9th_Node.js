// src/controllers/store.controller.js
import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { createStore } from "../services/store.service.js";

// 가게 등록
export const handleAddStore = async (req, res, next) => {
  /*
    #swagger.tags = ['Stores']
    #swagger.summary = '가게 등록'
    #swagger.description = '특정 지역(region_id)에 새로운 가게를 등록합니다.'

    #swagger.parameters['region_id'] = {
      in: 'path',
      required: true,
      schema: {
        type: 'integer'
      },
      description: '가게가 속한 지역의 ID'
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              categoryId: { type: "integer" },
              name: { type: "string" },
              address: { type: "string" },
              description: { type: "string" }
            },
            required: ["categoryId", "name"],
            example: {
              categoryId: 4,
              name: "홍대 떡볶이",
              address: "서울 마포구 홍익로 10",
              description: "매운맛이 매력적인 분식집"
            }
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: '가게 등록 성공',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/SuccessResponse'
          },
          example: {
            resultType: "SUCCESS",
            error: null,
            success: {
              id: 12,
              regionId: 3,
              categoryId: 4,
              name: "홍대 떡볶이",
              address: "서울 마포구 홍익로 10",
              description: "매운맛이 매력적인 분식집",
              createdAt: "2025-01-15T12:00:00.000Z",
              updatedAt: "2025-01-15T12:00:00.000Z"
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: '잘못된 요청 (필드 누락 또는 형식 오류)',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ErrorResponse'
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "unknown",
              reason: "요청 형식이 올바르지 않습니다. (예: name 누락, categoryId 타입 오류 등)",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: '해당 region_id가 존재하지 않는 경우',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ErrorResponse'
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "U007",
              reason: "해당 지역(region_id)이 존재하지 않습니다.",
              data: { regionId: 3 }
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: '이미 동일한 이름의 가게가 존재하는 경우 등',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ErrorResponse'
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "U008",
              reason: "이미 동일한 이름의 가게가 존재합니다.",
              data: { name: "홍대 떡볶이" }
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[500] = {
      description: '서버 내부 오류',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ErrorResponse'
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "unknown",
              reason: "서버 내부 오류가 발생했습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */

  // path param에서 region_id 가져와서 숫자로 변환
  const regionIdParam = req.params.region_id;
  const regionIdNum = Number(regionIdParam);

  console.log("가게 등록 요청:", {
    regionIdParam,
    body: req.body,
  });

  try {
    // DTO에 number 타입 regionId 넘김
    const storeData = bodyToStore(req.body, regionIdNum);

    // 서비스 레이어 호출
    const store = await createStore(storeData);

    res.status(StatusCodes.CREATED).success(store);
  } catch (error) {
    next(error);
  }
};