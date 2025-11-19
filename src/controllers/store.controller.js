import { StatusCodes } from "http-status-codes";
import { createStore, listStoreReviews } from "../services/store.service.js";
import { listStoreMissions } from "../services/mission.service.js";
import { serialize } from "../utils/serialize.js";

export const handleCreateStore = async (req, res, next) => {
  try {
    const newStore = await createStore(req.body);
    res.status(StatusCodes.CREATED).success(newStore);
  } catch (err) {
    next(err);
  }
};

// 리뷰
export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const cursor =
      typeof req.query.cursor === "string" ? Number(req.query.cursor) : 0;

    const reviews = await listStoreReviews(storeId, cursor);
    res.status(StatusCodes.OK).success(reviews);
  } catch (err) {
    next(err);
  }
};

// 미션
export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const cursor =
      typeof req.query.cursor === "string" ? Number(req.query.cursor) : 0;
    const take =
      typeof req.query.take === "string" ? Number(req.query.take) : 5;

    const result = await listStoreMissions(storeId, cursor, take);

    // BigInt와 Date 변환
    const serializedResult = serialize(result);

    res.status(StatusCodes.OK).success(serializedResult);
  } catch (err) {
    next(err);
  }
};
