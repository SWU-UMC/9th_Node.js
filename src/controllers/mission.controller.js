import { StatusCodes } from "http-status-codes";
import {
  addMissionToStore,
  challengeMission,
} from "../services/mission.service.js";
import {
  responseFromMission,
  responseFromUserMission,
} from "../dtos/mission.dto.js";

// POST /stores/:storeId/missions
export const handleAddMission = async (req, res) => {
  try {
    const mission = await addMissionToStore(
      req.body,
      Number(req.params.storeId)
    );
    res
      .status(StatusCodes.CREATED)
      .json({ result: responseFromMission(mission) });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: e.message });
  }
};

// POST /missions/:missionId/challenge
export const handleChallengeMission = async (req, res) => {
  try {
    const um = await challengeMission(Number(req.params.missionId));
    res
      .status(StatusCodes.CREATED)
      .json({ result: responseFromUserMission(um) });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: e.message });
  }
};
