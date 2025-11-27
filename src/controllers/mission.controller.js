// src/controllers/mission.controller.js
import express from "express";

import {
  findRestaurantById,
  createMission,
  listMissionsByRestaurant,
} from "../repositories/mission.repository.js";

import {
  RestaurantNotFoundError,
  MissionCreationError,
} from "../errors.js"; // 추가! error.js


const router = express.Router();


 //[POST] 특정 가게에 미션 추가하기
 //URL: /api/restaurant/:id/mission

/**
 * @swagger
 * /api/restaurant/{id}/mission:
 *   post:
 *     tags:
 *       - Mission
 *     summary: 특정 가게에 새로운 미션을 생성하는 api입니다!
 *     description: |
 *       이 API는 "특정 가게"에 새로운 미션을 추가하는 기능입니다.

 *       **미션이란?**  
 *       유저가 특정 가게에 예를 들어 **12,000원 이상의 식사를 하세요!** 와 같은
 *       목표를 설정하여 수행하는 기능입니다.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *         description: 미션을 추가할 가게의 고유 번호(ID)
 *
 *     requestBody:
 *       required: true
 *       description: |
 *         ### 미션을 생성할 때 필요한 정보
 *
 *         - **mission_title**: 미션의 제목  
 *         - **mission_detail**: 미션 상세 설명  
 *         - **reward_point**: 미션 완료 시 지급되는 포인트  
 *
 *         아래는 실제 JSON 예시입니다.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mission_title
 *               - mission_detail
 *               - reward_point
 *             properties:
 *               mission_title:
 *                 type: string
 *                 example: "가게이름 a"
 *               mission_detail:
 *                 type: string
 *                 example: "12,000원의 식사를 하세요!"
 *               reward_point:
 *                 type: number
 *                 example: 50
 *
 *     responses:
 *       201:
 *         description: 미션 생성 성공
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
 *                       example: 미션이 성공적으로 추가되었습니다.
 *                     data:
 *                       type: object
 *                       properties:
 *                         mission_id:
 *                           type: number
 *                           example: 21
 *
 *       404:
 *         description: 가게 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: FAIL
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: RESTAURANT_NOT_FOUND
 *                     reason:
 *                       type: string
 *                       example: 가게가 존재하지 않습니다.
 *                 success:
 *                   nullable: true
 *                   example: null
 */

router.post("/restaurant/:id/mission", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const restaurant = await findRestaurantById(id);
    if (!restaurant) {
      //  커스텀 에러 던지기 (전역 핸들러로 전달)
      throw new RestaurantNotFoundError("가게가 존재하지 않습니다.", { id });
    }

    const mission = await createMission(id, data);
     // 통일된 응답 포맷 사용 -> 리펙토링 진행.
     res.status(201).success({
      message: "미션이 성공적으로 추가되었습니다.",
      data: { mission_id: mission.mission_id },
    });
  } catch (err) {
    next(err); // 전역 에러 핸들러로 전달 -> error.js에 해당 내용 작성됨.
  }
});


 //[GET] 특정 가게의 미션 목록 조회
 //URL: /api/restaurants/:restaurantId/missions?userId=1
 
/**
 * @swagger
 * /api/restaurants/{restaurantId}/missions:
 *   get:
 *     tags:
 *       - Mission
 *     summary: 특정 가게의 미션 목록 조회
 *     description: |
 *       이 API는 특정 가게에 등록된 모든 미션을 조회하는 기능입니다.
 *
 *       아래와 같은 화면(미션 리스트 화면)을 구성하기 위해 필요한 데이터를 제공합니다:
 *       **500p 가게이름a에서 12,000원 이상의 식사를 하세요!** 화면을 위한 api입니다.
 *
 *       ---
 *       ### 이 API로 알 수 있는 정보
 *       - 미션 보상 포인트 (reward_point)
 *       - 미션의 제목/설명 (mission_title / mission_detail)
 *       - 가게 이름 (restaurant_name)
 *       - 해당 유저가 미션을 완료했는지 여부 (status)
 *           - not_started → 아직 미션을 시작하지 않음  
 *           - in_progress → 유저가 미션을 진행 중  
 *           - completed → 미션 완료 (리뷰 작성 버튼 생성 가능)  
 *
 *       ---
 *       따라서 이 API는
 *       - 유저가 어떤 미션을 할 수 있는지  
 *       - 각 미션의 현재 상태가 무엇인지  
 *       - 화면을 구성하는 모든 텍스트와 정보를 제공하는 **핵심 API**입니다.
 *
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *         description: 미션을 조회할 가게의 고유 번호
 *
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: |
 *           (선택) 유저의 미션 진행 상태 표시를 위해 userId를 받을 수 있습니다.
 *
 *           • userId가 전달되면  
 *             → 해당 유저가 이 미션을 "진행중/성공/미시작" 중 무엇인지 표시  
 *
 *           • userId가 없으면  
 *             → 전체 미션 목록만 조회됩니다.
 *
 *     responses:
 *       200:
 *         description: |
 *           미션 목록 조회 성공  
 *
 *           아래는 실제 화면에 필요한 모든 정보를 포함한 예시입니다.
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: 미션 목록 조회 성공
 *                     data:
 *                       type: array
 *                       description: 특정 가게에 등록된 미션 리스트
 *                       items:
 *                         type: object
 *                         properties:
 *                           restaurant_name:
 *                             type: string
 *                             example: 가게이름a
 *                             description: 미션이 속해 있는 가게의 이름
 *                           region_id:
 *                             type: number
 *                             example: 1
 *                             description: 해당 가게가 위치한 지역 ID
 *                           mission_id:
 *                             type: number
 *                             example: 3
 *                             description: 각 미션의 고유 번호
 *                           mission_title:
 *                             type: string
 *                             example: 12,000원 이상 식사를 하세요!
 *                             description: 미션 제목 (UI에서 상단의 굵은 글씨)
 *                           mission_detail:
 *                             type: string
 *                             example: 가게이름a에서 12,000원 이상의 식사 시 인증하세요!
 *                             description: 미션 상세 내용. 사용자가 실제로 해야 할 행동.
 *                           reward_point:
 *                             type: number
 *                             example: 500
 *                             description: 미션 성공 시 획득할 포인트
 *                           status:
 *                             type: string
 *                             example: completed
 *                             description: |
 *                               미션 진행 상태
 *
 *                               • not_started → 아직 미션 시작 안함  
 *                               • in_progress → 유저가 진행 중  
 *                               • completed → 미션 완료 (UI에서 '성공' 표시)
 */
router.get("/restaurants/:restaurantId/missions", async (req, res) => {
  const { restaurantId } = req.params;
  const userId = Number(req.query.userId) || 0; // 쿼리에서 userId 받기 (연습용)

  try {
    const missions = await listMissionsByRestaurant(restaurantId, userId);

    const formatted = missions.map((m) => ({
      restaurant_name: m.restaurant.restaurant_name,
      region_id: m.restaurant.region_id ?? 1, // 서울 = 1
      mission_id: m.mission_id,
      mission_title: m.mission_title,
      mission_detail: m.mission_detail,
      reward_point: m.reward_point,
      status: m.user_mission.length
        ? m.user_mission[0].status
        : "not_started", // 아직 안 한 경우
    }));

    res.status(200).json({
      success: true,
      message: "미션 목록 조회 성공",
      data: formatted,
    });
  }  catch (err) {
    next(err);
  }
});


export default router;