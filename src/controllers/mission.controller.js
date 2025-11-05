import { StatusCodes } from "http-status-codes";
import {
  addMissionToStore,
  challengeMission,
  listUserMissions,
  markMissionCompleted,
} from "../services/mission.service.js";
import {
  responseFromMission,
  responseFromUserMission,
} from "../dtos/mission.dto.js";
import { serialize } from "../utils/serialize.js";

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

// 진행 중인 미션 목록 조회
export const handleListUserMissions = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const cursor =
      typeof req.query.cursor === "string" ? Number(req.query.cursor) : 0;
    const take =
      typeof req.query.take === "string" ? Number(req.query.take) : 5;

    const rows = await listUserMissions(userId, cursor, take);

    const last = rows[rows.length - 1];
    const nextCursor = last ? Number(last.missionId ?? 0) : null;

    res.status(StatusCodes.OK).json({
      data: serialize(rows),
      pagination: { cursor: nextCursor },
    });
  } catch (err) {
    next(err);
  }
};

export const handleCompleteUserMission = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const missionId = Number(req.params.missionId);

    const row = await markMissionCompleted(userId, missionId);

    res.status(StatusCodes.OK).json({ result: serialize(row) });
  } catch (err) {
    next(err);
  }
};
