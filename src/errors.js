/**
 * 기본 에러 클래스
 * 모든 커스텀 에러의 부모 클래스
 */
class BaseError extends Error {
  /**
   * @param {string} message - 에러 메시지
   * @param {number} statusCode - HTTP 상태 코드
   * @param {string} errorCode - 애플리케이션 내부 에러 코드
   * @param {object} details - 추가 에러 상세 정보
   */
  constructor(message, statusCode, errorCode, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.errorCode = errorCode || 'INTERNAL_ERROR';
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    // 스택 트레이스 캡처 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 에러 응답 객체로 변환
   * @returns {object} 클라이언트에 반환할 에러 객체
   */
  toResponse() {
    return {
      success: false,
      error: {
        code: this.errorCode,
        message: this.message,
        ...(Object.keys(this.details).length > 0 && { details: this.details }),
        ...(process.env.NODE_ENV === 'development' && {
          stack: this.stack,
          name: this.name
        })
      },
      timestamp: this.timestamp
    };
  }
}

// 400 Bad Request - 잘못된 요청
class BadRequestError extends BaseError {
  constructor(message = '잘못된 요청입니다.', details = {}) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

// 401 Unauthorized - 인증 실패
class UnauthorizedError extends BaseError {
  constructor(message = '인증이 필요합니다.', details = {}) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

// 403 Forbidden - 권한 없음
class ForbiddenError extends BaseError {
  constructor(message = '접근 권한이 없습니다.', details = {}) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

// 404 Not Found - 리소스를 찾을 수 없음
class NotFoundError extends BaseError {
  constructor(resource, details = {}) {
    const message = resource 
      ? `'${resource}'을(를) 찾을 수 없습니다.`
      : '요청하신 리소스를 찾을 수 없습니다.';
    super(message, 404, 'NOT_FOUND', details);
  }
}

// 409 Conflict - 리소스 충돌 (중복 등)
class ConflictError extends BaseError {
  constructor(resource, details = {}) {
    const message = resource 
      ? `이미 존재하는 ${resource}입니다.`
      : '이미 존재하는 리소스입니다.';
    super(message, 409, 'CONFLICT', details);
  }
}

// 422 Unprocessable Entity - 유효성 검사 실패
class ValidationError extends BaseError {
  /**
   * @param {Array|string} errors - 유효성 검사 오류 배열 또는 메시지
   * @param {object} details - 추가 상세 정보
   */
  constructor(errors = [], details = {}) {
    const message = '유효성 검사에 실패했습니다.';
    super(message, 422, 'VALIDATION_ERROR', {
      ...details,
      errors: Array.isArray(errors) ? errors : [errors]
    });
  }
}

// 429 Too Many Requests - 요청 한도 초과
class RateLimitError extends BaseError {
  constructor(message = '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.', details = {}) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', details);
  }
}

// 500 Internal Server Error - 서버 내부 오류
class InternalServerError extends BaseError {
  constructor(message = '서버 오류가 발생했습니다.', details = {}) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}

// 503 Service Unavailable - 서비스 이용 불가
class ServiceUnavailableError extends BaseError {
  constructor(message = '서비스를 일시적으로 이용할 수 없습니다.', details = {}) {
    super(message, 503, 'SERVICE_UNAVAILABLE', details);
  }
}

// 기존 호환성을 위한 에러 클래스
class DuplicateUserEmailError extends ConflictError {
  constructor(email) {
    super('이메일', { email, errorCode: 'U001' });
  }
}

// Prisma 관련 에러 매핑
const prismaErrorMapping = {
  P2002: (meta) => {
    const target = meta?.target?.[0] || '알 수 없는 필드';
    return new ConflictError(target, { field: target });
  },
  P2025: (meta) => {
    const model = meta?.modelName || '리소스';
    return new NotFoundError(model, meta);
  },
  P2003: (meta) => {
    const field = meta?.field_name || '외래 키';
    return new BadRequestError(`유효하지 않은 ${field}입니다.`, meta);
  }
};

/**
 * Prisma 에러를 적절한 커스텀 에러로 변환
 * @param {Error} error - Prisma 에러 객체
 * @returns {BaseError} 변환된 커스텀 에러
 */
function handlePrismaError(error) {
  // 이미 커스텀 에러인 경우 그대로 반환
  if (error instanceof BaseError) {
    return error;
  }

  // Prisma 에러인 경우 매핑된 에러 반환
  if (error.code && prismaErrorMapping[error.code]) {
    return prismaErrorMapping[error.code](error.meta);
  }

  // 그 외의 경우 내부 서버 에러로 반환
  return new InternalServerError(error.message, {
    originalError: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      ...(error.code && { code: error.code }),
      ...(error.meta && { meta: error.meta })
    }
  });
}

/**
 * 에러 핸들링 미들웨어
 * @param {Error} error - 에러 객체
 * @param {Request} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 * @param {NextFunction} next - Express 다음 미들웨어 함수
 */
function errorHandler(error, req, res, next) {
  // 에러 로깅
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.error('Error:', error);

  // Prisma 에러인 경우 변환
  const customError = error.code ? handlePrismaError(error) : error;
  
  // 기본 에러 응답
  if (!(customError instanceof BaseError)) {
    customError = new InternalServerError(customError.message);
  }

  // 클라이언트에 에러 응답 전송
  res.status(customError.statusCode).json(customError.toResponse());
}

export {
  // Base
  BaseError,
  
  // 4xx Errors
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  
  // 5xx Errors
  InternalServerError,
  ServiceUnavailableError,
  
  // Legacy
  DuplicateUserEmailError,
  
  // Functions
  handlePrismaError,
  errorHandler
};