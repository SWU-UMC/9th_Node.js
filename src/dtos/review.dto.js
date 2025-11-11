export const bodyToReview = (body) => ({
  score: body.score !== undefined ? Number(body.score) : null,
  body: body.body || "",
  storeId: body.storeId !== undefined ? Number(body.storeId) : null,
});

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
