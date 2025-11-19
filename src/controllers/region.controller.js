// src/controllers/region.controller.js
import express from "express";
import { prisma } from "../db.config.js";
import { findRegionById, createRestaurant } from "../repositories/region.repository.js" ;
import { RegionNotFoundError, RestaurantCreationError } from "../errors.js"; // 에러 추가

const router = express.Router();

/**
 * [POST] 특정 지역에 가게 추가하기
 * URL: /api/region/:regionId/restaurant
 */
/*
  #swagger.tags = ['Region']
  #swagger.summary = '특정 지역에 가게 추가'
  #swagger.description = '
    이 API는 특정 지역에 새로운 가게를 등록하는 기능입니다.

    예를 들어 서울 지역에 가게 하나를 새로 추가할 때 사용됩니다.
    지역 번호를 전달하면 해당 지역이 실제로 존재하는지 먼저 확인한 뒤,
    전달된 가게 정보를 저장합니다.

    프론트 화면에서는 지역별 가게 리스트를 구성하거나,
    특정 지역 선택 후 등록된 가게를 관리할 때 이 API가 사용됩니다.
    그러나 아직은 실습,연습 단계로 서울(1), 부산(2)만 지역이 등록된 상황입니다.
  '

  #swagger.parameters['regionId'] = {
    in: 'path',
    required: true,
    description: '가게를 추가할 지역의 고유 번호',
    example: 1
  }

  #swagger.requestBody = {
    required: true,
    description: '
      새로 등록할 가게 정보를 전달합니다.
      가게 이름이나 주소 같은 기본 정보를 포함합니다.
    ',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            restaurant_name: { type: "string", example: "서울김밥천국" },
            address: { type: "string", example: "서울시 강남구 테헤란로 1길" }
          }
        }
      }
    }
  }

  #swagger.responses[201] = {
    description: '
      가게 생성 성공
      새로운 가게가 정상적으로 등록되었을 때의 응답입니다.
    ',
    content: {
      "application/json": {
        example: {
          success: true,
          restaurant_id: 15
        }
      }
    }
  }

  #swagger.responses[404] = {
    description: '
      해당 지역이 존재하지 않을 경우의 응답입니다.
    ',
    content: {
      "application/json": {
        example: {
          success: false,
          message: "지역이 존재하지 않습니다."
        }
      }
    }
  }
*/
router.post("/region/:regionId/restaurant", async (req, res, next) => {
  const { regionId } = req.params;
  const data = req.body;

  try {
    const region = await findRegionById(regionId);
    if (!region)
      return res.status(404).json({ success: false, message: "지역이 존재하지 않습니다." });

    const restaurant = await createRestaurant(regionId, data);
    res.status(201).json({ success: true, restaurant_id: restaurant.restaurant_id });
  } catch (err) {
    next(err); // 에러 전달.
  }
});

export default router;