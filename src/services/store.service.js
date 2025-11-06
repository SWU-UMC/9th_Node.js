import * as storeRepository from '../repositories/store.repository.js';
import { prisma } from '../db.config.js';
import { responseFromReviews, createReviewDto } from '../dtos/store.dto.js';
/**
 * 가게 추가 비즈니스 로직. (단순 삽입)
 */
export const addNewStore = async (storeData) => {
    // 필요 시 여기에 가게 이름 중복 검증 등의 로직을 추가
    
    const storeId = await storeRepository.createStore(
        storeData.name, 
        storeData.address, 
        storeData.region
    );
    
    return { storeId: storeId, message: '가게가 성공적으로 추가되었습니다.' };
};

export const listStoreReviews = async (storeId, cursor = 0) => {
  const reviews = await storeRepository.getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

/**
 * 가게 리뷰 생성 서비스
 */
export const createStoreReview = async (reviewData) => {
  // 1. DTO를 통한 데이터 검증
  const validatedData = createReviewDto(reviewData);
  
  // 2. 가게 존재 여부 확인
  const storeExists = await storeRepository.findStoreById(validatedData.storeId);
  if (!storeExists) {
    throw new Error('가게를 찾을 수 없습니다.');
  }
  
  // 3. 리뷰 생성
  const review = await storeRepository.createStoreReview(validatedData);
  
  return {
    id: review.id,
    content: review.content,
    rating: review.rating,
    createdAt: review.createdAt,
    user: {
      id: review.user.id,
      name: review.user.name
    }
  };
};