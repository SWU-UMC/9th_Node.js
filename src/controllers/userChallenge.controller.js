import * as challengeService from '../services/userChallenge.service.js';

/**
 * POST /api/v1/users/{userId}/challenges 엔드포인트 핸들러
 */
export const handleChallengeMission = async (req, res) => {
    // 인증된 사용자 ID 사용
    const userId = req.user.id;
    // Body에서 도전할 미션 ID 획득
    const { missionId } = req.body; 

    if (!missionId) {
        return res.status(400).json({ message: '도전할 missionId를 입력해야 합니다.' });
    }

    try {
        const result = await challengeService.startMissionChallenge(userId, missionId);
        return res.status(201).json(result);
    } catch (error) {
        console.error(error);
        // Service에서 던진 409 Conflict 에러 등을 처리
        return res.status(error.status || 500).json({ 
            message: error.message || '미션 도전 중 오류 발생' 
        });
    }
};