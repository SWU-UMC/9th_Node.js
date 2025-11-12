// 이메일 중복
export class DuplicateUserEmailError extends Error {
  errorCode = "U001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 존재하지 않는 가게
export class RestaurantNotFoundError extends Error {
  errorCode = "R001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 존재하지 않는 미션
export class MissionNotFoundError extends Error {
  errorCode = "M002";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}


// 존재하지 않는 유저
export class UserNotFoundError extends Error {
  errorCode = "U002";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}


// 이미 도전중인 미션
export class MissionAlreadyChallengedError extends Error {
  errorCode = "M004";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}