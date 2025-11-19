import bcrypt from 'bcrypt';
import { createUserWithPreferences, getUser } from '../repositories/user.repository.js';

// Error handling with standard Error and status codes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Custom error classes for specific error types
class DuplicateUserEmailError extends AppError {
  constructor(message = '이미 사용 중인 이메일입니다.') {
    super(message, 409);
  }
}

class ValidationError extends AppError {
  constructor(message = '유효성 검사에 실패했습니다.', errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

class InternalServerError extends AppError {
  constructor(message = '서버 내부 오류가 발생했습니다.') {
    super(message, 500);
  }
}

class NotFoundError extends AppError {
  constructor(message = '요청하신 리소스를 찾을 수 없습니다.') {
    super(message, 404);
  }
}

// 비밀번호 해시 함수
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// 비밀번호 비교 함수
const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * 음식 카테고리 매핑
 * @type {Object.<string, number>}
 */
const FOOD_CATEGORIES = {
  '한식': 1,
  '일식': 2,
  '중식': 3,
  '양식': 4,
  '치킨': 5,
  '분식': 6,
  '고기/구이': 7,
  '도시락': 8,
  '야식': 9,
  '패스트푸드': 10,
  '디저트': 11,
  '아시안푸드': 12
};

/**
 * 사용자 회원가입 서비스
 * @param {Object} userData - 사용자 가입 정보
 * @param {string} userData.email - 이메일
 * @param {string} userData.password - 비밀번호
 * @param {string} userData.name - 이름
 * @param {'MALE'|'FEMALE'|'OTHER'} userData.gender - 성별
 * @param {string|Date} userData.birth - 생년월일
 * @param {string} userData.address - 주소
 * @param {string} [userData.detailAddress] - 상세주소
 * @param {string} [userData.phoneNumber] - 전화번호
 * @param {string[]} [userData.preferences] - 선호 음식 카테고리 목록
 * @returns {Promise<Object>} 생성된 사용자 정보
 * @throws {ValidationError} 유효성 검사 실패 시
 * @throws {DuplicateUserEmailError} 이메일 중복 시
 * @throws {InternalServerError} 서버 오류 시
 */

export const userSignUp = async (userData) => {
  try {
    // 1. 입력 데이터 유효성 검사
    validateUserInput(userData);

    // 2. 비밀번호 해싱
    const hashedPassword = await hashPassword(userData.password);
    
    // 3. 선호 카테고리 ID로 변환
    const foodCategoryIds = mapPreferencesToCategoryIds(userData.preferences);

    // 4. 사용자 정보와 선호 카테고리 등록
    const user = await createUserWithPreferences({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      gender: userData.gender,
      birth: userData.birth ? new Date(userData.birth) : null,
      address: userData.address,
      detailAddress: userData.detailAddress,
      phoneNumber: userData.phoneNumber
    }, foodCategoryIds);

    // 5. 등록된 사용자 정보 조회 (선호 카테고리 포함)
    const userWithPreferences = await getUser(user.id);
    
    // 6. 민감 정보 제거 후 반환
    return excludeSensitiveData(userWithPreferences);
    
  } catch (error) {
    console.error('회원가입 처리 중 오류 발생:', error);
    
    // Prisma 에러 처리
    if (error.code === 'P2002') {
      throw new DuplicateUserEmailError();
    }
    
    // 이미 처리된 에러는 그대로 전달
    if (error instanceof ValidationError || 
        error instanceof DuplicateUserEmailError) {
      throw error;
    }
    
    // 기타 예상치 못한 에러
    throw new InternalServerError('회원가입 처리 중 오류가 발생했습니다.');
  }
};

/**
 * 사용자 입력 데이터 유효성 검사
 * @param {Object} data - 검사할 사용자 데이터
 * @throws {ValidationError} 유효성 검사 실패 시
 */
function validateUserInput(data) {
  // 1. 필수 필드 검증
  const requiredFields = ['email', 'password', 'name', 'gender', 'birth', 'address'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new ValidationError(
      '필수 입력 항목이 누락되었습니다.',
      missingFields.map(field => ({
        field,
        message: `${field}은(는) 필수 입력 항목입니다.`
      }))
    );
  }
  
  // 2. 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new ValidationError('유효하지 않은 이메일 형식입니다.', [
      { field: 'email', message: '유효한 이메일 주소를 입력해주세요.' }
    ]);
  }
  
  // 3. 비밀번호 복잡성 검증
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(data.password)) {
    throw new ValidationError('비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자를 모두 포함해야 합니다.', [
      { 
        field: 'password', 
        message: '비밀번호는 영문, 숫자, 특수문자를 조합하여 8자 이상이어야 합니다.' 
      }
    ]);
  }
  
  // 4. 성별 유효성 검증
  const validGenders = ['MALE', 'FEMALE', 'OTHER'];
  if (!validGenders.includes(data.gender)) {
    throw new ValidationError('유효하지 않은 성별입니다.', [
      { 
        field: 'gender', 
        message: '성별은 MALE, FEMALE, OTHER 중 하나여야 합니다.' 
      }
    ]);
  }
  
  // 5. 생년월일 유효성 검증
  if (data.birth) {
    const birthDate = new Date(data.birth);
    if (isNaN(birthDate.getTime())) {
      throw new ValidationError('유효하지 않은 생년월일 형식입니다.', [
        { 
          field: 'birth', 
          message: '올바른 날짜 형식(YYYY-MM-DD)으로 입력해주세요.' 
        }
      ]);
    }
  }
}

/**
 * 선호 음식 카테고리 이름을 ID로 매핑
 * @param {string[]} [preferences] - 선호 카테고리 이름 배열
 * @returns {number[]} 카테고리 ID 배열
 */
function mapPreferencesToCategoryIds(preferences = []) {
  if (!Array.isArray(preferences)) {
    return [];
  }
  
  return preferences
    .map(pref => FOOD_CATEGORIES[pref])
    .filter(Boolean);
}

/**
 * 민감한 사용자 정보를 제거합니다.
 * @param {Object} user - 사용자 객체
 * @returns {Object} 민감 정보가 제거된 사용자 객체
 */
function excludeSensitiveData(user) {
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * 이메일로 사용자 조회
 * @param {string} email - 조회할 사용자 이메일
 * @returns {Promise<Object|null>} 사용자 정보 또는 null
 */
export const getUserByEmail = async (email) => {
  try {
    const user = await getUser(email);
    
    return user ? excludeSensitiveData(user) : null;
  } catch (error) {
    console.error('사용자 조회 중 오류 발생:', error);
    throw new InternalServerError('사용자 정보를 가져오는 중 오류가 발생했습니다.');
  }
};

/**
 * 사용자 인증
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {Promise<Object>} 인증된 사용자 정보
 * @throws {NotFoundError} 사용자를 찾을 수 없을 때
 * @throws {ValidationError} 비밀번호가 일치하지 않을 때
 */
export const authenticateUser = async (email, password) => {
  const user = await getUserByEmail(email);
  
  if (!user) {
    throw new NotFoundError('가입되지 않은 이메일입니다.');
  }
  
  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw new ValidationError('비밀번호가 일치하지 않습니다.', [
      { field: 'password', message: '잘못된 비밀번호입니다.' }
    ]);
  }
  
  return excludeSensitiveData(user);
};