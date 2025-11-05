import { StatusCodes } from "http-status-codes";
import { addReviewToStore } from "../services/review.service.js";
import { responseFromReview } from "../dtos/review.dto.js";

export const handleAddReview = async (req, res) => {
  try {
    const review = await addReviewToStore(req.body, Number(req.params.storeId));
    res
      .status(StatusCodes.CREATED)
      .json({ result: responseFromReview(review) });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: e.message });
  }
};
