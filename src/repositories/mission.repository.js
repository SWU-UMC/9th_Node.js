import { prisma } from '../db.config.js';

/**
 * 새로운 미션 정보를 DB에 삽입
 */
export const createMission = async (storeId, content, reward, deadline) => {
    const mission = await prisma.mission.create({
        data: {
            storeId: parseInt(storeId),
            content,
            reward: parseFloat(reward),
            deadline: new Date(deadline)
        }
    });
    return mission.id;
};

/**
 * 특정 사용자의 미션 목록 조회
 */
export const getMissionsByStatus = async (userId, status) => {
    if (!['in_progress', 'completed'].includes(status)) {
        return [];
    }

    const missions = await prisma.userMission.findMany({
        where: {
            userId: parseInt(userId),
            status: status
        },
        include: {
            mission: true
        }
    });

    return missions;
};

/**
 * 미션 성공 상태 업데이트
 */
export const updateMissionSuccess = async (userId, missionId) => {
    const result = await prisma.userMission.updateMany({
        where: {
            userId: parseInt(userId),
            missionId: parseInt(missionId),
            status: 'in_progress'
        },
        data: {
            status: 'completed',
            completedAt: new Date()
        }
    });
    
    return result.count;
};