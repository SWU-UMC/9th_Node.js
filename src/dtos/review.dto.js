export const bodyToReview = (body) => ({
  score: body.score !== undefined ? Number(body.score) : null,
  body: body.body || "",
  storeId: body.storeId !== undefined ? Number(body.storeId) : null,
});

export const responseFromReview = (review) => ({
  id: review.id,
  userId: review.user_id,
  storeId: review.store_id,
  score: review.score,
  body: review.body,
  createdAt: review.created_at,
  updatedAt: review.updated_at,
});
