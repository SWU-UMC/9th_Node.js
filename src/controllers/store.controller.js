import { StatusCodes } from "http-status-codes";
import { createStore } from "../services/store.service.js";

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
