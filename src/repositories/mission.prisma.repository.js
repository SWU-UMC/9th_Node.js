import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class MissionRepository {
  async findMissionById(missionId) {
    return prisma.mission.findUnique({
      where: { id: missionId },
    });
  }

  async findUserMission(userId, missionId) {
    return prisma.userMission.findFirst({
      where: {
        AND: [
          { userId: userId },
          { missionId: missionId }
        ]
      },
    });
  }

  async assignMissionToUser(userId, missionId) {
    try {
      return await prisma.userMission.create({
        data: {
          userId,
          missionId,
          status: 'IN_PROGRESS',
        },
        include: {
          mission: {
            include: {
              store: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('이미 할당된 미션입니다.');
      }
      throw error;
    }
  }
  async findMissionsByStoreId(storeId, cursor, limit = 10) {
    return prisma.mission.findMany({
      where: { storeId },
      include: {
        store: {
          select: {
            name: true,
          },
        },
      },
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1, // Check if there are more items
      orderBy: { id: 'asc' },
    });
  }

  async findUserMissions(userId, status, cursor, limit = 10) {
    return prisma.userMission.findMany({
      where: { 
        userId,
        ...(status && { status }),
      },
      include: {
        mission: {
          include: {
            store: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1, // Check if there are more items
      orderBy: { id: 'asc' },
    });
  }

  async updateUserMission(userId, missionId, data) {
    try {
      return await prisma.userMission.update({
        where: {
          user_mission_unique: {
            userId: userId,
            missionId: missionId
          }
        },
        data: data,
        include: {
          mission: {
            include: {
              store: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('미션을 찾을 수 없거나 이미 완료된 미션입니다.');
      }
      throw error;
    }
  }

  async findUserReviews(userId, cursor, limit = 10) {
    return prisma.storeReview.findMany({
      where: { userId },
      include: {
        store: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1, // Check if there are more items
      orderBy: { id: 'asc' },
    });
  }
}
