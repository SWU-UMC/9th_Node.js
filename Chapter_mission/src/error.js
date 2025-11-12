// 이메일 중복
export class DuplicateUserEmailError extends Error {
    errorCode = "U001";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 비밀번호 규칙 위반
export class PasswordRuleError extends Error {
    errorCode = "U002";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 이미 도전 중인 미션
export class MissionAlreadyInProgressError extends Error {
    errorCode = "U003";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 미션 정보 찾을 수 없음
export class MissionNotFoundError extends Error {
    errorCode = "U004";
    
    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 이미 완료된 미션
export class MissionAlreadyCompletedError extends Error {
    errorCode = "U005";
    
    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 존재하지 않는 가게
export class StoreNotFoundError extends Error {
    errorCode = "U006";
    
    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 존재하지 않는 지역
export class RegionNotFoundError extends Error {
    errorCode = "U007";
    
    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 가게 중복
export class DuplicateStoreError extends Error {
    errorCode = "U008";
    
    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}