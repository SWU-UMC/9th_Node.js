import * as challengeRepository from '../repositories/userChallenge.repository.js';

export const startMissionChallenge = async (userId, missionId) => {
    
    // 1. [필수 검증]: 이미 도전 중인지 확인
    const isOngoing = await challengeRepository.findOngoingChallenge(userId, missionId);

    if (isOngoing) {
        // 이미 도전 중이라면 오류 발생
        const error = new Error('이미 도전 중인 미션입니다.');
        error.status = 409; // HTTP 409 Conflict
        throw error;
    }

    // 2. 새로운 도전 생성
    const newChallengeId = await challengeRepository.createChallenge(userId, missionId);
    
    return {
        challengeId: newChallengeId,
        message: '미션 도전이 시작되었습니다.'
    };
};