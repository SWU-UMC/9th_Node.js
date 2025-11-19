// src/controllers/store.controller.js
import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { createStore } from "../services/store.service.js";

export const handleAddStore = async (req, res, next) => {
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