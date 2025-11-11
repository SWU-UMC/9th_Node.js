import { StatusCodes } from "http-status-codes";
import { createStore, listStoreReviews } from "../services/store.service.js";
import { listStoreMissions } from "../services/mission.service.js";

export const handleCreateStore = async (req, res, next) => {
  try {
    console.log("가게 등록 요청:", req.body);

    const { region_id, name, address } = req.body;

    if (!region_id || !name) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "region_id와 name은 필수입니다." });
    }

    const newStore = await createStore({ region_id, name, address });
    res.status(StatusCodes.CREATED).json({ result: newStore });
  } catch (err) {
    next(err);
  }
};

// 리뷰
export const handleListStoreReviews = async (req, res, next) => {
  const reviews = await listStoreReviews(
    parseInt(req.params.storeId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).json(reviews);
};

const toPlainObject = (obj) => {
  const newObj = { ...obj };
  for (const key in newObj) {
    if (typeof newObj[key] === "bigint") {
      newObj[key] = Number(newObj[key]);
    } else if (newObj[key] instanceof Date) {
      newObj[key] = newObj[key].toISOString();
    } else if (typeof newObj[key] === "object") {
      newObj[key] = toPlainObject(newObj[key]);
    }
  }
  return newObj;
};

// 미션
export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const cursor =
      typeof req.query.cursor === "string" ? Number(req.query.cursor) : 0;
    const take =
      typeof req.query.take === "string" ? Number(req.query.take) : 5;

    const result = await listStoreMissions(storeId, cursor, take);

    // BigInt와 Date 변환
    const serializedResult = toPlainObject(result);

    res.status(StatusCodes.OK).json(serializedResult);
  } catch (err) {
    next(err);
  }
};
