//errors.js 파일 생성! -> 7주차 실습

//이미 있는 유저 관련 에러
export class DuplicateUserEmailError extends Error {
    errorCode = "U001"; // 에러 코드 고정 (U001: User Duplicate Email)
  
    constructor(reason, data) {
      super(reason); // Error 기본 message 설정
      this.reason = reason; // 프론트에서 바로 확인할 수 있는 메시지
      this.data = data; // 문제된 데이터(payload)도 같이 담기
    }
  }

  // 가게(레스토랑)를 찾을 수 없는 경우 -> mission 컨트롤러 관련해서
export class RestaurantNotFoundError extends Error {
    errorCode = "M001";
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  }
  
  //  미션 생성 중 서버 오류 -> mission 컨트롤러 관련해서
  export class MissionCreationError extends Error {
    errorCode = "M002";
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  }

  // 지역(Region)을 찾을 수 없는 경우 -> region 관련 에러 코드
export class RegionNotFoundError extends Error {
    errorCode = "R001";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  }
  
  // 가게 생성 중 오류 > region 관련 에러 코드
  export class RestaurantCreationError extends Error {
    errorCode = "R002";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  }

  // 리뷰 작성 실패 ->review 관련 코드
export class ReviewCreationError extends Error {
    errorCode = "RV001";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  }
  
  // 리뷰 조회 실패 또는 없음 ->review 관련 코드
  export class ReviewNotFoundError extends Error {
    errorCode = "RV002";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  }

  // user mission 관련 에러 추가
export class UserMissionStartError extends Error {
    errorCode = "UM001"; // User Mission Start 실패
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  }
  
  export class UserMissionCompleteError extends Error {
    errorCode = "UM002"; // User Mission Complete 실패
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  }
  
  
  //  필요 시 더 많은 에러를 여기에 추가 가능 -> 워크북 참고.
  export class DatabaseConnectionError extends Error {
    errorCode = "S001";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  }