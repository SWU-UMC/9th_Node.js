import { prisma } from "../db.config.js";

// 리뷰 데이터 삽입
export const addReview = async (data) => {
  const review = await prisma.review.create({data});
  return review;
};

// ID로 리뷰 정보 얻기
export const getReviewById = async (reviewId) => {
  const review = await prisma.review.findFirstOrThrow({where: {id: reviewId}});
  return review;
};