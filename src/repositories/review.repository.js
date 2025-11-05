import { prisma } from "../db.config.js";

/**
 * 특정 식당(restaurant_id)의 모든 리뷰를 가져오는 함수
 * 커서 기반 페이지네이션을 적용하여, id가 cursor보다 큰 리뷰 5개씩 반환
 */
export const getAllStoreReviews = async (restaurantId, cursor = 0) => {
    const reviews = await prisma.mission_review.findMany({
      select: {
        review_id: true,
        content: true,
        rating: true,
        photo: true,
        created_at: true,
        // 리뷰 작성자 정보
        user: {
          select: {
            id: true,
            name: true,
            nickname: true,
            profile_image: true,
          },
        },
        // 관련 식당 정보
        restaurant: {
          select: {
            restaurant_id: true,
            restaurant_name: true,
          },
        },
        // 관련 미션 정보
        mission: {
          select: {
            mission_id: true,
            mission_title: true,
          },
        },
      },
      where: {
        restaurant_id: restaurantId,
        review_id: { gt: cursor },
      },
      orderBy: { review_id: "asc" },
      take: 5, // 페이지당 5개씩
    });
  
    return reviews;
  };