import { prisma } from "../db.config.js";

//특정 유저가 특정 미션을 완료했는지 확인
export const findCompletedMission = async (user_id, mission_id) => {
  return await prisma.user_mission.findFirst({
    where: {
      user_id,
      mission_id,
      status: 1,
    },
    include: {
      mission: {  
        select: { restaurant_id: true }
      }
    }
  });
};


//해당 미션에 대해 이미 리뷰를 작성했는지 유효성 확인
export const findReviewByMission = async (user_id, mission_id) => {
    try {
        const review = await prisma.mission_review.findFirst({
            where: {
                user_id,
                mission_id,
            },
        });
        return review || null;
    } catch (err) {
        console.error("해당 미션 작성 유효성 검사 중 오류: ", err);
        throw err;
    }
};

//리뷰 추가하기
export const createReview = async (data) => {
    try {
        const review = await prisma.mission_review.create({
            data: {
                mission_id: data.mission_id,
                restaurant_id: data.restaurant_id,
                user_id: data.user_id,
                content: data.content,
                rating: data.rating,
                photo: data.photo,
            },
        });
        return review;
    } catch (err) {
        console.error("리뷰 추가하던 중 오류: ", err);
        throw err;
    }
};

//ID로 리뷰 조회
export const getReviewById = async (review_id) => {
    try {
        const review = await prisma.mission_review.findUnique({
            where: {
                review_id,
            },
        });
        return review || null;
    } catch (err) {
        console.error("리뷰 Id로 리뷰 조회 중 오류: ", err);
        throw err;
    }
};

//mission-06
//내가 쓴 리뷰 목록
export const getMyReviews = async (user_id, cursor = null, limit = 5) => {
    try {
        const reviews = await prisma.mission_review.findMany({
            where: { user_id },
            select: {
                review_id: true,
                content: true,
                rating: true,
                created_at: true,
                user: {
                    select: {
                        name: true,
                    },
                },
                restaurant: {
                    select: {
                    restaurant_name: true, // 화면 상단 고정
                },
            },
        },
        orderBy: {review_id: "asc"},
        take: limit,
        ...(cursor && { cursor: { review_id: Number(cursor)}, skip: 1}),
    });
    const nextCursor = reviews.length > 0 ? reviews[reviews.length - 1].review_id : null;

    return { restaurantName, reviews, nextCursor };
  } catch (err) {
    console.error("getRestaurantReviews Error:", err);
    throw err;
  }
};
