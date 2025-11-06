import * as storeRepository from '../repositories/store.repository.js';
import { prisma } from '../db.config.js';
import { responseFromReviews, createReviewDto } from '../dtos/store.dto.js';
import { Prisma } from '@prisma/client';
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
 * ID로 가게 상세 정보 조회
 * @param {string|number} storeId - 조회할 가게 ID
 * @returns {Promise<Object|null>} 가게 정보 또는 null
 */
export const getStoreById = async (storeId) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: Number(storeId) },
      include: {
        missions: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // 최근 5개 리뷰만 가져오기
        }
      }
    });
    return store;
  } catch (error) {
    console.error('Error fetching store by ID:', error);
    throw error;
  }
};

/**
 * 가게 리뷰 생성 서비스
 */
export const createStoreReview = async (reviewData) => {
  try {
    console.log('Creating review with data:', reviewData);
    
    // 1. DTO를 통한 데이터 검증
    let validatedData;
    try {
      validatedData = createReviewDto(reviewData);
      console.log('Validated data:', validatedData);
    } catch (dtoError) {
      console.error('DTO validation failed:', dtoError);
      throw new Error(`유효하지 않은 리뷰 데이터입니다: ${dtoError.message}`);
    }
    
    // 2. 가게 존재 여부 확인
    const storeExists = await storeRepository.findStoreById(validatedData.storeId);
    if (!storeExists) {
      throw new Error('가게를 찾을 수 없습니다.');
    }
    
    // 3. 사용자 존재 여부 확인
    const userExists = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    });
    
    if (!userExists) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    
    // 4. 리뷰 생성
    const review = await storeRepository.createStoreReview(validatedData);
    
    // 5. 생성된 리뷰 조회 (관계 포함)
    const createdReview = await prisma.storeReview.findUnique({
      where: { id: review.id },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return {
      id: createdReview.id,
      content: createdReview.content,
      rating: createdReview.rating,
      createdAt: createdReview.createdAt,
      user: {
        id: createdReview.user.id,
        name: createdReview.user.name
      }
    };
  } catch (error) {
    console.error('Error in createStoreReview:', error);
    if (error.message.includes('Unique constraint')) {
      throw new Error('이미 리뷰를 작성하셨습니다.');
    }
    throw error;
  }
};