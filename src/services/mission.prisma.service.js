import { MissionRepository } from '../repositories/mission.prisma.repository.js';

const missionRepository = new MissionRepository();

export class MissionService {
  async getStoreMissions(storeId, cursor, limit = 10) {
    const missions = await missionRepository.findMissionsByStoreId(storeId, cursor, limit);
    
    const hasNextPage = missions.length > limit;
    const items = missions.slice(0, limit);
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return {
      items: items.map(mission => ({
        id: mission.id,
        storeId: mission.storeId,
        storeName: mission.store.name,
        content: mission.content,
        reward: mission.reward,
        deadline: mission.deadline,
        status: mission.status,
        createdAt: mission.createdAt,
        updatedAt: mission.updatedAt,
      })),
      nextCursor,
      hasNextPage,
    };
  }

  async getUserMissions(userId, status, cursor, limit = 10) {
    const userMissions = await missionRepository.findUserMissions(userId, status, cursor, limit);
    
    const hasNextPage = userMissions.length > limit;
    const items = userMissions.slice(0, limit);
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return {
      items: items.map(um => ({
        id: um.id,
        missionId: um.missionId,
        storeName: um.mission.store.name,
        content: um.mission.content,
        reward: um.mission.reward,
        status: um.status,
        completedAt: um.completedAt,
        createdAt: um.createdAt,
      })),
      nextCursor,
      hasNextPage,
    };
  }

  async completeUserMission(userId, missionId, status = 'COMPLETED') {
    try {
      // 상태에 따라 업데이트할 데이터 설정
      const updateData = {
        status,
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      };

      const userMission = await missionRepository.updateUserMission(
        userId,
        missionId,
        updateData
      );

      return {
        id: userMission.id,
        missionId: userMission.missionId,
        storeName: userMission.mission.store.name,
        content: userMission.mission.content,
        reward: userMission.mission.reward,
        status: userMission.status,
        completedAt: userMission.completedAt,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('미션을 찾을 수 없거나 이미 완료되었습니다.');
      }
      throw error;
    }
  }

  async getUserReviews(userId, cursor, limit = 10) {
    const reviews = await missionRepository.findUserReviews(userId, cursor, limit);
    
    const hasNextPage = reviews.length > limit;
    const items = reviews.slice(0, limit);
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return {
      items: items.map(review => ({
        id: review.id,
        storeId: review.storeId,
        storeName: review.store.name,
        userName: review.user.name,
        content: review.content,
        rating: review.rating,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      })),
      nextCursor,
      hasNextPage,
    };
  }

  async assignMissionToUser(userId, missionId) {
    // Check if mission exists
    const mission = await missionRepository.findMissionById(missionId);
    if (!mission) {
      throw new Error('미션을 찾을 수 없습니다.');
    }

    // Assign mission to user
    return await missionRepository.assignMissionToUser(userId, missionId);
  }
}

export const missionService = new MissionService();
