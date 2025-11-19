import * as missionRepository from '../repositories/mission.repository.js';
import * as storeRepository from '../repositories/store.repository.js';

// Error handling with standard Error and status codes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = '요청하신 리소스를 찾을 수 없습니다.') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = '유효성 검사에 실패했습니다.', errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * 새로운 미션 추가
 * @param {number} storeId - 가게 ID
 * @param {Object} missionData - 미션 데이터
 * @returns {Promise<Object>} 생성된 미션 정보
 */
export const addNewMission = async (storeId, missionData) => {
    // 가게 존재 여부 확인
    const storeExists = await storeRepository.storeExists(storeId);
    if (!storeExists) {
        throw new NotFoundError('가게를 찾을 수 없습니다.');
    }
    
    const missionId = await missionRepository.createMission(
        storeId, 
        missionData.content, 
        missionData.reward, 
        missionData.deadline
    );
    
    return { missionId, message: '미션이 가게에 추가되었습니다.' };
};

/**
 * 사용자의 미션 목록 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} 사용자 미션 목록
 */
export const getUserMissions = async (userId) => {
    return await missionRepository.getUserMissions(userId);
};

/**
 * 미션 완료 처리
 * @param {number} userId - 사용자 ID
 * @param {number} missionId - 미션 ID
 * @returns {Promise<Object>} 처리 결과
 */
export const completeMission = async (userId, missionId) => {
    const result = await missionRepository.completeMission(userId, missionId);
    if (result.affectedRows === 0) {
        throw new NotFoundError('미션을 찾을 수 없거나 이미 완료된 미션입니다.');
    }
    return { success: true, message: '미션이 성공적으로 완료되었습니다.' };
};

/**
 * 사용자에게 미션 할당
 * @param {number} userId - 사용자 ID
 * @param {number} missionId - 미션 ID
 * @returns {Promise<Object>} 할당 결과
 */
export const assignMissionToUser = async (userId, missionId) => {
    // 미션 존재 여부 확인
    const mission = await missionRepository.getMissionById(missionId);
    if (!mission) {
        throw new NotFoundError('미션을 찾을 수 없습니다.');
    }
    
    // 이미 할당된 미션인지 확인
    const isAssigned = await missionRepository.isMissionAssigned(userId, missionId);
    if (isAssigned) {
        throw new ValidationError('이미 할당된 미션입니다.');
    }
    
    // 미션 할당
    await missionRepository.assignMissionToUser(userId, missionId);
    return { success: true, message: '미션이 성공적으로 할당되었습니다.' };
};

/**
 * 사용자 리뷰 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} 사용자 리뷰 목록
 */
export const getUserReviews = async (userId) => {
    return await missionRepository.getUserReviews(userId);
};

/**
 * 가게의 미션 목록 조회
 * @param {number} storeId - 가게 ID
 * @returns {Promise<Array>} 가게 미션 목록
 */
export const getStoreMissions = async (storeId) => {
    return await missionRepository.getMissionsByStoreId(storeId);
};

/**
 * 미션 도전
 * @param {number} missionId - 미션 ID
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 도전 결과
 */
export const challengeMission = async (missionId, userId) => {
    // 미션 존재 여부 확인
    const mission = await missionRepository.getMissionById(missionId);
    if (!mission) {
        throw new NotFoundError('미션을 찾을 수 없습니다.');
    }
    
    // 이미 도전 중인 미션인지 확인
    const isChallenging = await missionRepository.isMissionChallenging(userId, missionId);
    if (isChallenging) {
        throw new ValidationError('이미 도전 중인 미션입니다.');
    }
    
    // 미션 도전 시작
    await missionRepository.startMissionChallenge(userId, missionId);
    return { success: true, message: '미션 도전이 시작되었습니다.' };
};

/**
 * 미션 성공 요청
 * @param {number} userId - 사용자 ID
 * @param {number} missionId - 미션 ID
 * @returns {Promise<Object>} 처리 결과
 */
export const requestMissionSuccess = async (userId, missionId) => {
    const affectedRows = await missionRepository.updateMissionSuccess(userId, missionId);
    if (affectedRows === 0) {
        throw new Error('미션 성공 요청에 실패했습니다. (미션이 진행 중이 아니거나 존재하지 않습니다.)');
    }
    return { success: true };
};

/**
 * 리뷰 작성 (미션 완료 후)
 * @param {number} userId - 사용자 ID
 * @param {number} missionId - 미션 ID
 * @param {Object} reviewData - 리뷰 데이터
 * @returns {Promise<number>} 리뷰 ID
 */
/**
 * 리뷰 작성 (미션 완료 후)
 * @param {number} userId - 사용자 ID
 * @param {number} missionId - 미션 ID
 * @param {Object} reviewData - 리뷰 데이터
 * @returns {Promise<number>} 리뷰 ID
 */
export const writeReview = async (userId, missionId, reviewData) => {
    // 1. (추가 검증: 미션이 완료 상태인지 확인하는 로직 추가 가능)
    // 현재는 바로 DB 저장 로직만 구현

    // 2. Repository 호출
    const reviewId = await missionRepository.insertReviewForMission(userId, missionId, reviewData);
    return reviewId;
};