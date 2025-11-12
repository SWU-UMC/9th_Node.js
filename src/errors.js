export class AppError extends Error {
  constructor(
    reason = "Error",
    { statusCode = 500, errorCode = "unknown", data = null } = {}
  ) {
    super(reason);
    this.reason = reason;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.data = data;
  }
}

export class ValidationError extends AppError {
  constructor(
    reason = "유효하지 않은 요청입니다.",
    data = null,
    errorCode = "V001"
  ) {
    super(reason, { statusCode: 400, errorCode, data });
  }
}

export class UnauthorizedError extends AppError {
  constructor(reason = "인증이 필요합니다.", data = null, errorCode = "A001") {
    super(reason, { statusCode: 401, errorCode, data });
  }
}

export class ForbiddenError extends AppError {
  constructor(reason = "권한이 없습니다.", data = null, errorCode = "A002") {
    super(reason, { statusCode: 403, errorCode, data });
  }
}

// 404
export class NotFoundError extends AppError {
  constructor(
    reason = "리소스를 찾을 수 없습니다.",
    data = null,
    errorCode = "N000"
  ) {
    super(reason, { statusCode: 404, errorCode, data });
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor(userId, reason = "사용자를 찾을 수 없습니다.") {
    super(reason, { userId }, "U002");
  }
}

export class StoreNotFoundError extends NotFoundError {
  constructor(storeId, reason = "가게를 찾을 수 없습니다.") {
    super(reason, { storeId }, "S001");
  }
}

export class MissionNotFoundError extends NotFoundError {
  constructor(missionId, reason = "미션을 찾을 수 없습니다.") {
    super(reason, { missionId }, "M001");
  }
}

export class ReviewNotFoundError extends NotFoundError {
  constructor(reviewId, reason = "리뷰를 찾을 수 없습니다.") {
    super(reason, { reviewId }, "R001");
  }
}

// 409
export class ConflictError extends AppError {
  constructor(
    reason = "요청이 현재 리소스 상태와 충돌합니다.",
    data = null,
    errorCode = "C000"
  ) {
    super(reason, { statusCode: 409, errorCode, data });
  }
}

export class DuplicateUserEmailError extends ConflictError {
  constructor(reason = "이미 존재하는 이메일입니다.", data) {
    super(reason, data, "U001");
  }
}

export class AlreadyChallengedMissionError extends ConflictError {
  constructor(missionId, userId, reason = "이미 도전 중인 미션입니다.") {
    super(reason, { missionId, userId }, "M002");
  }
}

export class AlreadyCompletedMissionError extends ConflictError {
  constructor(missionId, userId, reason = "이미 완료한 미션입니다.") {
    super(reason, { missionId, userId }, "M003");
  }
}

// 500
export class InternalServerError extends AppError {
  constructor(
    reason = "서버 오류가 발생했습니다.",
    data = null,
    errorCode = "S000"
  ) {
    super(reason, { statusCode: 500, errorCode, data });
  }
}
