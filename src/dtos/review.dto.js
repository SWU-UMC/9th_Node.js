export const bodyToReview = (body) => {
  const score =
    body.score !== undefined && body.score !== null ? Number(body.score) : null;
  const storeId =
    body.storeId !== undefined && body.storeId !== null
      ? Number(body.storeId)
      : null;
  const content = (body.body ?? "").toString().trim();

  if (!Number.isFinite(storeId) || storeId <= 0) {
    throw new ValidationError("storeId는 양의 정수여야 합니다.", {
      storeId: body.storeId,
    });
  }
  if (!Number.isFinite(score)) {
    throw new ValidationError("score는 숫자여야 합니다.", {
      score: body.score,
    });
  }
  if (score < 1 || score > 5) {
    throw new ValidationError("score는 1~5 사이의 숫자여야 합니다.", { score });
  }
  if (!content) {
    throw new ValidationError("리뷰 본문(body)은 필수입니다.", {
      body: body.body,
    });
  }
  if (content.length > 1000) {
    throw new ValidationError("리뷰 본문은 최대 1000자까지 가능합니다.", {
      length: content.length,
    });
  }

  return { score, body: content, storeId };
};

export const responseFromReview = (r) => ({
  id: r.id,
  userId: r.userId,
  storeId: r.storeId,
  score: r.score,
  body: r.body,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});

export const toPlainReview = (r) => ({
  id: Number(r.id),
  userId: Number(r.userId),
  storeId: Number(r.storeId),
  score: r.score,
  body: r.body ?? "",
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
  store: r.store ? { id: Number(r.store.id), name: r.store.name } : undefined,
});

export const responseFromReviews = (reviews) => ({
  data: reviews,
  pagination: {
    cursor: reviews.length ? reviews[reviews.length - 1].id : null,
  },
});
