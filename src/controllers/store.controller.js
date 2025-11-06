import * as storeService from '../services/store.service.js';

/**
 * POST /api/v1/stores 엔드포인트 핸들러
 */
export const handleAddStore = async (req, res) => {
    const { name, address, region } = req.body;

    if (!name || !address || !region) {
        return res.status(400).json({ message: '모든 가게 정보를 입력해야 합니다.' });
    }

    try {
        const result = await storeService.addNewStore({ name, address, region });
        return res.status(201).json(result); // 201 Created
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '가게 추가 중 오류 발생' });
    }
};