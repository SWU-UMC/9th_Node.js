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
export const getUserMissions = async (userId) => {
    const missions = await prisma.userMission.findMany({
        where: {
            userId: parseInt(userId)
        },
        include: {
            mission: true
        }
    });
    return missions;
};

/**
 * 미션 ID로 미션 조회
 */
export const getMissionById = async (missionId) => {
    return await prisma.mission.findUnique({
        where: {
            id: parseInt(missionId)
        }
    });
};

/**
 * 미션 완료 처리
 */
export const completeMission = async (userId, missionId) => {
    return await prisma.userMission.updateMany({
        where: {
            userId: parseInt(userId),
            missionId: parseInt(missionId),
            status: 'IN_PROGRESS'
        },
        data: {
            status: 'COMPLETED',
            completedAt: new Date()
        }
    });
};

/**
 * 사용자에게 미션 할당
 */
export const assignMissionToUser = async (userId, missionId) => {
    return await prisma.userMission.create({
        data: {
            userId: parseInt(userId),
            missionId: parseInt(missionId),
            status: 'IN_PROGRESS'
        }
    });
};

/**
 * 사용자 리뷰 조회
 */
export const getUserReviews = async (userId) => {
    return await prisma.review.findMany({
        where: {
            userId: parseInt(userId)
        },
        include: {
            mission: true,
            store: true
        }
    });
};

/**
 * 가게의 미션 목록 조회
 */
export const getMissionsByStoreId = async (storeId) => {
    return await prisma.mission.findMany({
        where: {
            storeId: parseInt(storeId)
        }
    });
};

/**
 * 미션 도전 시작
 */
export const startMissionChallenge = async (userId, missionId) => {
    return await prisma.userMission.create({
        data: {
            userId: parseInt(userId),
            missionId: parseInt(missionId),
            status: 'IN_PROGRESS'
        }
    });
};

/**
 * 미션 할당 여부 확인
 */
export const isMissionAssigned = async (userId, missionId) => {
    const count = await prisma.userMission.count({
        where: {
            userId: parseInt(userId),
            missionId: parseInt(missionId)
        }
    });
    return count > 0;
};

/**
 * 미션 도전 중인지 확인
 */
export const isMissionChallenging = async (userId, missionId) => {
    const count = await prisma.userMission.count({
        where: {
            userId: parseInt(userId),
            missionId: parseInt(missionId),
            status: 'IN_PROGRESS'
        }
    });
    return count > 0;
};

/**
 * 미션 성공 상태 업데이트
 */
export const updateMissionSuccess = async (userId, missionId) => {
    const result = await prisma.userMission.updateMany({
        where: {
            userId: parseInt(userId),
            missionId: parseInt(missionId),
            status: 'IN_PROGRESS'
        },
        data: {
            status: 'COMPLETED',
            completedAt: new Date()
        }
    });
    
    return result.count;
};