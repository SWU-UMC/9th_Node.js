//src/controllers/user_mission.controller.js
import express from "express";
import {
  startUserMission,
  completeUserMission,
  listInProgressMissionsByUser,
} from "../repositories/user_mission.repository.js";
import {
  UserMissionStartError,
  UserMissionCompleteError,
} from "../errors.js"; //에러 - 리펙토링 진행함.

const router = express.Router();


 // [POST] 미션 도전 시작
 // URL: /api/user/:userId/mission/:missionId

/**
 * @swagger
 * /api/user/{userId}/mission/{missionId}:
 *   post:
 *     tags:
 *       - UserMission
 *     summary: 미션 도전 시작
 *     description: |
 *       이 API는 사용자가 특정 미션에 도전할 때 사용됩니다.
 *
 *       예를 들어 화면에서 사용자가 미션 도전 버튼을 눌렀을 때
 *       이 API를 호출하여 해당 유저가 미션을 시작한 상태로 저장합니다.
 *
 *       저장되는 내용은 다음과 같습니다.
 *       - 어떤 유저가
 *       - 어떤 미션을
 *       - 어떤 시점에 시작했는지
 *
 *       미션을 시작해야 나중에 완료 처리나 리뷰 작성이 가능해집니다.
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: 미션을 시작할 유저의 고유 번호
 *         schema:
 *           type: integer
 *           example: 3
 *
 *       - in: path
 *         name: missionId
 *         required: true
 *         description: 시작할 미션의 고유 번호
 *         schema:
 *           type: integer
 *           example: 7
 *
 *     responses:
 *       201:
 *         description: 미션 도전이 정상적으로 시작된 경우의 응답입니다.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: 미션 도전이 시작되었습니다!
 *               user_mission_id: 15
 *
 *       400:
 *         description: 유효하지 않은 요청 또는 미션 시작 실패
 *         content:
 *           application/json:
 *             example:
 *               resultType: FAIL
 *               error:
 *                 errorCode: MISSION_START_FAILED
 *                 reason: 미션 도전 시작에 실패했습니다.
 *               success: null
 */

router.post("/user/:userId/mission/:missionId", async (req, res) => {
  const { userId, missionId } = req.params;

  try {
    const mission = await startUserMission(userId, missionId);

    if (!mission) {
      throw new UserMissionStartError("미션 도전 시작에 실패했습니다.", { userId, missionId });
    }

    
    res.status(201).json({
      success: true,
      message: "미션 도전이 시작되었습니다!",
      user_mission_id: mission.user_mission_id,
    });
  } catch (err) {
    next(err);
  }
});




 // [PATCH] 미션 완료 처리 + 포인트 적립
 // URL: /api/user_mission/:id/complete

/**
 * @swagger
 * /api/user_mission/{id}/complete:
 *   patch:
 *     tags:
 *       - UserMission
 *     summary: 미션 완료 처리
 *     description: |
 *       이 API는 사용자가 시작한 미션을 완료했을 때 사용됩니다.
 *
 *       예를 들어 미션 조건을 충족한 뒤 인증이 완료되면
 *       프론트에서 이 API를 호출하여 다음 작업을 수행합니다.
 *
 *       - 미션 상태를 완료로 변경  
 *       - 해당 미션의 포인트 지급  
 *       - 완료 시간 기록  
 *
 *       이 API는 미션 성공 화면이나 리뷰 작성 완료 버튼을 구현할 때 필요합니다.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 유저가 시작한 미션의 고유 번호
 *         schema:
 *           type: integer
 *           example: 12
 *
 *     responses:
 *       200:
 *         description: 미션 완료와 포인트 지급이 정상적으로 처리된 경우
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: 미션 완료! 500P 지급 완료
 *               data:
 *                 user_mission_id: 12
 *                 user_id: 3
 *                 mission_id: 7
 *                 mission_title: 12000원 이상 식사를 하세요
 *                 reward_point: 500
 *                 completed_at: 2025-02-01T15:21:00Z
 *
 *       400:
 *         description: 미션 완료 처리 실패
 *         content:
 *           application/json:
 *             example:
 *               resultType: FAIL
 *               error:
 *                 errorCode: MISSION_COMPLETE_FAILED
 *                 reason: 미션 완료 처리에 실패했습니다.
 *               success: null
 */
router.patch("/user_mission/:id/complete", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await completeUserMission(id);

    if (!result) {
      throw new UserMissionCompleteError("미션 완료 처리에 실패했습니다.", { user_mission_id: id });
    }

    res.json({
      success: true,
      message: `미션 완료! ${result.mission.reward_point}P 지급 완료 🎉`,
      data: {
        user_mission_id: result.user_mission_id,
        user_id: result.user_id,
        mission_id: result.mission_id,
        mission_title: result.mission.mission_title,
        reward_point: result.mission.reward_point,
        completed_at: result.completed_at,
      },
    });
  } catch (err) {
    next(err);
  }
});



 // [GET] 사용자의 진행 중인 미션 목록 조회
 // URL: /api/users/:userId/missions/in-progress

/**
 * @swagger
 * /api/users/{userId}/missions/in-progress:
 *   get:
 *     tags:
 *       - UserMission
 *     summary: 사용자의 진행 중인 미션 조회
 *     description: |
 *       이 API는 사용자가 현재 진행 중인 미션 목록을 조회하는 기능입니다.
 *
 *       마이페이지의 진행중인 미션 탭이나
 *       홈 화면에서 유저가 지금 어떤 미션을 수행 중인지 보여줄 때 사용됩니다.
 *
 *       반환되는 정보는 다음과 같습니다.
 *       - 사용자의 아이디
 *       - 미션 제목과 상세 내용
 *       - 어떤 가게의 미션인지
 *       - 미션 보상 포인트
 *       - 미션 시작 시간
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: 진행 중인 미션을 조회할 유저의 고유 번호
 *         schema:
 *           type: integer
 *           example: 3
 *
 *     responses:
 *       200:
 *         description: 사용자가 현재 수행 중인 미션 목록 조회 성공
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - user_id: 3
 *                   restaurant_name: 가게이름a
 *                   region_id: 1
 *                   mission_id: 7
 *                   mission_title: 12000원 이상 식사를 하세요
 *                   mission_detail: 가게이름a에서 12000원 이상 식사 인증
 *                   reward_point: 500
 *                   started_at: 2025-01-28T12:10:00Z
 *
 *       404:
 *         description: 유저가 진행 중인 미션이 없는 경우
 *         content:
 *           application/json:
 *             example:
 *               resultType: FAIL
 *               error:
 *                 errorCode: MISSION_NOT_FOUND
 *                 reason: 진행 중인 미션이 없습니다.
 *               success: null
 */
router.get("/users/:userId/missions/in-progress", async (req, res) => {
  const { userId } = req.params;

  try {
    const missions = await listInProgressMissionsByUser(userId);

    const formatted = missions.map((m) => ({
      user_id: m.user_id,
      restaurant_name: m.mission.restaurant.restaurant_name,
      region_id: m.mission.restaurant.region_id,
      mission_id: m.mission.mission_id,
      mission_title: m.mission.mission_title,
      mission_detail: m.mission.mission_detail,
      reward_point: m.mission.reward_point,
      started_at: m.started_at,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
});



export default router;