// 이메일 중복
export class DuplicateUserEmailError extends Error {
  errorCode = "U001";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 존재하지 않는 가게
export class RestaurantNotFoundError extends Error {
  errorCode = "R001";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 존재하지 않는 미션
export class MissionNotFoundError extends Error {
  errorCode = "M001";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 존재하지 않는 유저 미션
export class MissionUserNotFoundError extends Error {
  errorCode = "M002";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }


}

// 존재하지 않는 유저
export class UserNotFoundError extends Error {
  errorCode = "U002";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// DB 오류
export class InternalServerError extends Error {
  errorCode = "E500"; 
  statusCode = 500; 

  constructor(reason, data) {
    super(reason || "서버 내부 오류가 발생했습니다.");
    this.reason = reason || "서버 내부 오류가 발생했습니다.";
    this.data = data;
  }
}


// 이미 도전중인 미션
export class MissionAlreadyChallengedError extends Error {
  errorCode = "M003";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 이미 완료한 미션
export class MissionAlreadyCompletedError extends Error {
  errorCode = "M004";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
