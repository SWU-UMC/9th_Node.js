import bcrypt from 'bcrypt';
import { createUserWithPreferences, getUser } from '../repositories/user.repository.js';

// Error classes from centralized error handling
import { 
  DuplicateUserEmailError,
  ValidationError,
  InternalServerError,
  NotFoundError,
  ConflictError,
  BadRequestError
} from '../errors.js';

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

    // 2. 사용자 데이터 준비
    const userDataToCreate = {
      email: userData.email,
      name: userData.name,
      gender: userData.gender,
      birth: userData.birth ? new Date(userData.birth) : null,
      address: userData.address,
      detailAddress: userData.detailAddress || null,
      phoneNumber: userData.phoneNumber || null
    };

    // 3. 비밀번호가 제공된 경우에만 해싱
    if (userData.password) {
      userDataToCreate.password = await hashPassword(userData.password);
    }
    
    // 4. 선호 카테고리 ID로 변환
    const foodCategoryIds = mapPreferencesToCategoryIds(userData.preferences || []);

    // 5. 사용자 정보와 선호 카테고리 등록
    const user = await createUserWithPreferences(userDataToCreate, foodCategoryIds);

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
  // 1. 필수 필드 검증 (password는 선택사항으로 변경)
  const requiredFields = ['email', 'name', 'gender', 'birth', 'address'];
  const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0);
  
  if (missingFields.length > 0) {
    const details = {};
    missingFields.forEach((field, index) => {
      details[index] = {
        field,
        message: `${field}은(는) 필수 입력 항목입니다.`
      };
    });
    details.errors = ['필수 입력 항목이 누락되었습니다.'];
    
    const error = new ValidationError('유효성 검사에 실패했습니다.');
    error.details = details;
    throw error;
  }
  
  // 2. 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    const error = new ValidationError('유효성 검사에 실패했습니다.');
    error.details = {
      0: { field: 'email', message: '유효한 이메일 주소를 입력해주세요.' },
      errors: ['유효하지 않은 이메일 형식입니다.']
    };
    throw error;
  }
  
  // 3. 비밀번호 복잡성 검증 (비밀번호가 있는 경우에만 검증)
  if (data.password && data.password.trim() !== '') {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      const error = new ValidationError('유효성 검사에 실패했습니다.');
      error.details = {
        0: { 
          field: 'password', 
          message: '비밀번호는 영문, 숫자, 특수문자를 조합하여 8자 이상이어야 합니다.' 
        },
        errors: ['비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자를 모두 포함해야 합니다.']
      };
      throw error;
    }
  }
  
  // 4. 성별 유효성 검증
  const validGenders = ['MALE', 'FEMALE', 'OTHER', '남성', '여성', '기타'];
  if (!validGenders.includes(data.gender)) {
    const error = new ValidationError('유효성 검사에 실패했습니다.');
    error.details = {
      0: { 
        field: 'gender', 
        message: '성별은 MALE, FEMALE, OTHER, 남성, 여성, 기타 중 하나여야 합니다.' 
      },
      errors: ['유효하지 않은 성별입니다.']
    };
    throw error;
  }
  
  // 성별을 영어로 변환 (한국어인 경우)
  if (data.gender === '남성') data.gender = 'MALE';
  if (data.gender === '여성') data.gender = 'FEMALE';
  if (data.gender === '기타') data.gender = 'OTHER';
  
  // 5. 생년월일 유효성 검증
  if (data.birth) {
    const birthDate = new Date(data.birth);
    if (isNaN(birthDate.getTime())) {
      const error = new ValidationError('유효성 검사에 실패했습니다.');
      error.details = {
        0: { 
          field: 'birth', 
          message: '올바른 날짜 형식(YYYY-MM-DD)으로 입력해주세요.' 
        },
        errors: ['유효하지 않은 생년월일 형식입니다.']
      };
      throw error;
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
export const excludeSensitiveData = (user) => {
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * 사용자 정보 업데이트
 * @param {number} userId - 업데이트할 사용자 ID
 * @param {Object} updateData - 업데이트할 사용자 정보
 * @returns {Promise<Object>} 업데이트된 사용자 정보
 * @throws {NotFoundError} 사용자를 찾을 수 없을 때
 * @throws {ValidationError} 유효성 검사 실패 시
 */
export const updateUser = async (userId, updateData) => {
  try {
    // 1. 사용자 존재 여부 확인
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true
      }
    });

    if (!existingUser) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    // 2. 업데이트할 데이터 준비
    const dataToUpdate = {
      name: updateData.name,
      gender: updateData.gender,
      birth: updateData.birth ? new Date(updateData.birth) : null,
      address: updateData.address,
      detailAddress: updateData.detailAddress || null,
      phoneNumber: updateData.phoneNumber || null
    };

    // 3. 선호 카테고리 업데이트
    let foodCategoryIds = [];
    if (updateData.preferences && updateData.preferences.length > 0) {
      foodCategoryIds = mapPreferencesToCategoryIds(updateData.preferences);
    }

    // 4. 트랜잭션으로 사용자 정보와 선호 카테고리 업데이트
    const [updatedUser] = await prisma.$transaction([
      // 사용자 정보 업데이트
      prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
        include: {
          preferences: {
            include: {
              foodCategory: true
            }
          }
        }
      }),
      // 기존 선호 카테고리 삭제
      prisma.userPreference.deleteMany({
        where: { userId }
      }),
      // 새로운 선호 카테고리 추가
      ...(foodCategoryIds.length > 0 ? [
        prisma.userPreference.createMany({
          data: foodCategoryIds.map(categoryId => ({
            userId,
            foodCategoryId: categoryId
          }))
        })
      ] : [])
    ]);

    // 5. 업데이트된 사용자 정보 조회 (선호 카테고리 포함)
    const userWithPreferences = await getUser(userId);
    
    // 6. 민감 정보 제거 후 반환
    return excludeSensitiveData(userWithPreferences);
    
  } catch (error) {
    console.error('사용자 정보 업데이트 중 오류 발생:', error);
    
    if (error.code === 'P2002') {
      throw new ValidationError('이미 사용 중인 이메일입니다.');
    }
    
    throw error;
  }
};

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