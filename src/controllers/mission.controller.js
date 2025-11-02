import * as missionService from '../services/mission.service.js';

/**
 * POST /api/v1/stores/{storeId}/missions 엔드포인트 핸들러
 */
export const handleAddMission = async (req, res) => {
    const storeId = parseInt(req.params.storeId);
    const { content, reward, deadline } = req.body;

    if (!content) {
        return res.status(400).json({ message: '미션 내용을 입력해야 합니다.' });
    }

    try {
        const result = await missionService.addNewMission(storeId, { content, reward, deadline });
        return res.status(201).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '미션 추가 중 오류 발생' });
    }
};
