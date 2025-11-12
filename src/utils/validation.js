import { ValidationError } from "../errors.js";

export const PAGINATION_DEFAULT_TAKE = 5;
export const PAGINATION_MAX_TAKE = 50;

// 숫자 필수 검증
export const ensureNumber = (value, name) => {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new ValidationError(`${name}는 숫자여야 합니다.`, { [name]: value });
  }
  return num;
};

// 양의 정수(>0) 검증
export const ensurePositiveInt = (value, name) => {
  const num = ensureNumber(value, name);
  if (!Number.isInteger(num) || num <= 0) {
    throw new ValidationError(`${name}는 양의 정수여야 합니다.`, {
      [name]: value,
    });
  }
  return num;
};

// 문자열 필수 검증
export const ensureString = (value, name) => {
  const s = (value ?? "").toString().trim();
  if (!s) {
    throw new ValidationError(`${name}은(는) 필수입니다.`, { [name]: value });
  }
  return s;
};

// 열거형 값 검증
export const ensureEnum = (value, name, allowed) => {
  if (!allowed.includes(value)) {
    throw new ValidationError(
      `${name}는 ${allowed.join(", ")} 중 하나여야 합니다.`,
      {
        [name]: value,
        allowed,
      }
    );
  }
  return value;
};

// 날짜 문자열 검증/
export const normalizeDeadline = (deadlineRaw) => {
  let deadline = (deadlineRaw ?? "").toString().trim();
  if (!deadline) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    return `${deadline} 23:59:59`;
  }
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(deadline)) {
    return deadline;
  }
  throw new ValidationError(
    "deadline 형식이 올바르지 않습니다. (YYYY-MM-DD 또는 YYYY-MM-DD HH:MM:SS)",
    { deadline: deadlineRaw }
  );
};

// cursor/take 검증
export const ensureCursorTake = (cursor, take) => {
  const c = Number(cursor ?? 0);
  const t = Number(take ?? PAGINATION_DEFAULT_TAKE);

  if (!Number.isFinite(c) || c < 0) {
    throw new ValidationError("cursor가 유효하지 않습니다.", { cursor });
  }
  if (!Number.isFinite(t) || t <= 0) {
    throw new ValidationError("take는 양의 정수여야 합니다.", { take });
  }
  if (t > PAGINATION_MAX_TAKE) {
    throw new ValidationError(`take의 최대값은 ${PAGINATION_MAX_TAKE}입니다.`, {
      take: t,
    });
  }
  return { cursor: c, take: t };
};
