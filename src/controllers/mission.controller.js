import { StatusCodes } from "http-status-codes";
import {
  bodyToMission,
  bodyToChallenge, 
} from "../dtos/mission.dto.js";
import {
  createMission,
  challengeMission,
} from "../services/mission.service.js";

export const handleAddMission = async (req, res, next) => {
  console.log("가게에 미션 추가를 요청했습니다!");
  console.log("params (restaurantId):", req.params);
  console.log("body (point, content, deadline):", req.body);

  try {
    const missionData = bodyToMission(req.body, req.params);
    const newMission = await createMission(missionData);
    res.status(StatusCodes.CREATED).json({ result: newMission });

  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

export const handleChallengeMission = async (req, res, next) => {
  console.log("미션 도전하기를 요청했습니다");
  console.log("params (missionId):", req.params);
  console.log("body (userId):", req.body);

  try {
    const challengeData = bodyToChallenge(req.body, req.params);
    const newChallenge = await challengeMission(challengeData);

    res.status(StatusCodes.CREATED).json({ result: newChallenge });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};