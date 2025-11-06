import { missionService } from '../services/mission.prisma.service.js';
import { StatusCodes } from 'http-status-codes';

export const getStoreMissions = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const result = await missionService.getStoreMissions(
      parseInt(storeId),
      cursor,
      limit
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.items,
      pagination: {
        nextCursor: result.nextCursor,
        hasNextPage: result.hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserMissions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const result = await missionService.getUserMissions(
      parseInt(userId),
      status,
      cursor,
      limit
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.items,
      pagination: {
        nextCursor: result.nextCursor,
        hasNextPage: result.hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const completeUserMission = async (req, res, next) => {
  try {
    const { userId, missionId } = req.params;
    const { status = 'COMPLETED' } = req.body; // 기본값으로 'COMPLETED' 설정

    // 상태 유효성 검사
    if (!['COMPLETED', 'FAILED'].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '유효하지 않은 상태 값입니다. COMPLETED 또는 FAILED 중 하나여야 합니다.'
      });
    }

    const result = await missionService.completeUserMission(
      parseInt(userId),
      parseInt(missionId),
      status
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `미션이 성공적으로 ${status === 'COMPLETED' ? '완료' : '실패'} 처리되었습니다.`,
      data: result,
    });
  } catch (error) {
    if (error.message.includes('미션을 찾을 수 없거나')) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export const assignMissionToUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { missionId } = req.body;

    if (!missionId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '미션 ID가 필요합니다.'
      });
    }

    const userMission = await missionService.assignMissionToUser(
      parseInt(userId),
      parseInt(missionId)
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: '미션이 성공적으로 할당되었습니다.',
      data: userMission
    });
  } catch (error) {
    console.error('Error assigning mission to user:', error);
    next(error);
  }
};

export const getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const result = await missionService.getUserReviews(
      parseInt(userId),
      cursor,
      limit
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.items,
      pagination: {
        nextCursor: result.nextCursor,
        hasNextPage: result.hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};
