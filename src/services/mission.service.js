import * as missionRepository from '../repositories/mission.repository.js';
// 💡 미션 추가 시 storeId가 유효한지 검증하려면 storeRepository를 임포트하여 사용

export const addNewMission = async (storeId, missionData) => {
    // 💡 [옵션 검증]: storeId가 유효한지 여기서 검사
    
    const missionId = await missionRepository.createMission(
        storeId, 
        missionData.content, 
        missionData.reward, 
        missionData.deadline
    );
    
    return { missionId: missionId, message: '미션이 가게에 추가되었습니다.' };
};



















/*
const missionRepository = require('../repositories/mission.repository.js');

// 미션 목록 조회
exports.getMissions = async (userId, status) => {
    // status 유효성 검사
    if (status !== 'in_progress' && status !== 'completed') {
        throw new Error('유효하지 않은 미션 상태(status)입니다.');
    }
    return await missionRepository.getMissionsByStatus(userId, status);
};

// 미션 성공 요청
exports.requestMissionSuccess = async (userId, missionId) => {
    const affectedRows = await missionRepository.updateMissionSuccess(userId, missionId);
    if (affectedRows === 0) {
        throw new Error('미션 성공 요청에 실패했습니다. (미션이 진행 중이 아니거나 존재하지 않습니다.)');
    }
    return { success: true };
};

// 리뷰 작성 (미션 완료 후)
exports.writeReview = async (userId, missionId, reviewData) => {
    // 1. (추가 검증: 미션이 완료 상태인지 확인하는 로직 추가 가능)
    // 현재는 바로 DB 저장 로직만 구현

    // 2. Repository 호출
    const reviewId = await missionRepository.insertReviewForMission(userId, missionId, reviewData);
    return reviewId;
};

// (미션 요구사항 1-4번) 미션 도전하기
exports.challengeMission = async (userId, missionId) => {
    // 1. 도전 중인지 검증 (미션 요구사항)
    const isChallenging = await missionRepository.checkIfMissionIsChallenging(userId, missionId);
    if (isChallenging) {
        throw new Error('이미 도전 중인 미션입니다.');
    }

    // 2. 도전 시작 (DB 저장)
    const challengeId = await missionRepository.startMissionChallenge(userId, missionId);
    return challengeId;
};
*/