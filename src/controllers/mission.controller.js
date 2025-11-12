import { StatusCodes } from "http-status-codes";
import { missionAdd  } from "../services/mission.service.js";

export const addMissionController = async (req, res, next) => {
    try {
        const { restaurant_id } = req.params;
        const mission = await missionAdd({
          restaurant_id: Number(restaurant_id),
          ...req.body});

        res.status(StatusCodes.OK).success(mission);
  } catch (error) {
    next(error);
  }
};