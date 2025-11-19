// mission.dto.js
export const missionListSchema = {
  validate: (input) => {
    const errors = {};
    if (input.status && !['IN_PROGRESS', 'COMPLETED'].includes(input.status)) {
      errors.status = 'Status must be either IN_PROGRESS or COMPLETED';
    }
    if (input.cursor && (isNaN(Number(input.cursor)) || Number(input.cursor) <= 0)) {
      errors.cursor = 'Cursor must be a positive number';
    }
    if (input.limit && (isNaN(Number(input.limit)) || Number(input.limit) <= 0)) {
      errors.limit = 'Limit must be a positive number';
    }
    return {
      error: Object.keys(errors).length ? errors : null,
      value: {
        status: input.status,
        cursor: input.cursor ? Number(input.cursor) : undefined,
        limit: input.limit ? Number(input.limit) : 10
      }
    };
  }
};

// 응답 스키마 객체 추가
export const missionResponseSchema = {
  id: Number,
  storeId: Number,
  storeName: String,
  content: String,
  reward: Number,
  deadline: Date,
  status: String,
  userMissionStatus: String,
  createdAt: Date,
  updatedAt: Date
};

export const userMissionResponseSchema = {
  id: Number,
  missionId: Number,
  storeName: String,
  content: String,
  reward: Number,
  status: String,
  completedAt: Date,
  createdAt: Date
};

export const storeReviewResponseSchema = {
  id: Number,
  storeId: Number,
  storeName: String,
  userName: String,
  content: String,
  rating: Number,
  reviewImages: [String],
  reply: {
    content: String,
    createdAt: Date
  },
  createdAt: Date,
  updatedAt: Date
};