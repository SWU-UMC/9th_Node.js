import { prisma } from '../db.config.js';

/**
 * 특정 미션에 도전 중(in_progress)인 레코드가 있는지 확인.
 */
export const findOngoingChallenge = async (userId, missionId) => {
    const count = await prisma.userChallenge.count({
        where: {
            userId: parseInt(userId),
            missionId: parseInt(missionId),
            status: 'in_progress'
        }
    });
    return count > 0;
};

/**
 * 새로운 미션 도전을 user_challenge 테이블에 추가.
 */
export const createChallenge = async (userId, missionId) => {
    const challenge = await prisma.userChallenge.create({
        data: {
            userId: parseInt(userId),
            missionId: parseInt(missionId),
            status: 'in_progress',
            startedAt: new Date()
        }
    });
    return challenge.id;
};

/**
 * 사용자의 도전 중인 미션 목록 조회
 */
export const getUserChallenges = async (userId, status = 'in_progress') => {
    const challenges = await prisma.userChallenge.findMany({
        where: {
            userId: parseInt(userId),
            status: status
        },
        include: {
            mission: {
                include: {
                    store: true
                }
            }
        },
        orderBy: {
            startedAt: 'desc'
        }
    });
    return challenges;
};

/**
 * 미션 도전 상태 업데이트
 */
export const updateChallengeStatus = async (challengeId, status) => {
    await prisma.userChallenge.update({
        where: { id: parseInt(challengeId) },
        data: {
            status: status,
            ...(status === 'completed' && { completedAt: new Date() })
        }
    });
};







