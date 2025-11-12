//errors.js 파일 생성! -> 7주차 실습

// 중복 이메일 에러
export class DuplicateUserEmailError extends Error {
    errorCode = "U001"; // 에러 코드 고정 (U001: User Duplicate Email)
  
    constructor(reason, data) {
      super(reason); // Error 기본 message 설정
      this.reason = reason; // 프론트에서 바로 확인할 수 있는 메시지
      this.data = data; // 문제된 데이터(payload)도 같이 담기
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