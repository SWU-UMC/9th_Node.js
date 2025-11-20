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
    type: 'integer',
    description: '가게가 속한 지역의 ID'
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $categoryId: 4,
          $name: "홍대 떡볶이",
          address: "서울 마포구 홍익로 10",
          description: "매운맛이 매력적인 분식집"
        }
      }
    }
  }

  #swagger.responses[201] = {
    description: '가게 등록 성공',
    schema: {
      $ref: '#/components/schemas/SuccessResponse',
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

  #swagger.responses[400] = {
    description: '잘못된 요청 (필드 누락 또는 형식 오류)',
    schema: { $ref: '#/components/schemas/ErrorResponse' }
  }

  #swagger.responses[404] = {
    description: '해당 region_id가 존재하지 않는 경우',
    schema: { $ref: '#/components/schemas/ErrorResponse' }
  }

  #swagger.responses[409] = {
    description: '이미 동일한 이름의 가게가 존재하는 경우 등',
    schema: { $ref: '#/components/schemas/ErrorResponse' }
  }

  #swagger.responses[500] = {
    description: '서버 내부 오류',
    schema: { $ref: '#/components/schemas/ErrorResponse' }
  }
*/

  const { regionId } = req.params;

  console.log("가게 등록 요청:", req.body);

  try {
    const storeData = bodyToStore(req.body, regionId);
    const store = await createStore(storeData);

    res.status(StatusCodes.CREATED).success(store);
  } catch (error) {
    next(error);
  }
};