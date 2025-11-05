// src/controllers/review.controller.js
import express from "express";
import axios from "axios"; // 외부 API (현재 미사용)
import { prisma } from "../db.config.js"; 
import { findReviewsByUserId, listStoreReviews } from "../repositories/review.repository.js"; // ✅ Repository import

const router = express.Router();



/**
 * [POST] 리뷰 추가하기
 * URL: /api/review
 */
router.post("/review", async (req, res) => {
  const { mission_id, restaurant_id, user_id, content, rating, photo, restaurant_name } = req.body;

  try {
    const newReview = await prisma.mission_review.create({
      data: {
        mission_id: Number(mission_id),
        restaurant_id: Number(restaurant_id),
        user_id: Number(user_id),
        content,
        rating: Number(rating),
        photo,
      },
    });

    res.status(201).json({
      success: true,
      review_id: newReview.review_id,
      verified_store: restaurant_name,
    });
  } catch (err) {
    console.error("❌ 리뷰 등록 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

/**
 * [GET] 특정 가게의 리뷰 목록 조회
 * URL: /api/v1/stores/:storeId/reviews
 */
router.get("/v1/stores/:storeId/reviews", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor =
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const reviews = await listStoreReviews(storeId, cursor);
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error("리뷰 조회 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

/**
 * [GET] 내가 작성한 리뷰 목록 조회
 * URL: /api/users/:userId/reviews
 */
router.get("/users/:userId/reviews", async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await findReviewsByUserId(userId);

    if (!reviews.length) {
      return res.status(404).json({ success: false, message: "작성한 리뷰가 없습니다." });
    }

    const formatted = reviews.map((r) => ({
      review_id: r.review_id,
      restaurant_name: r.restaurant?.restaurant_name,
      rating: r.rating,
      content: r.content,
      photo: r.photo,
      owner_reply: r.owner_reply,
      created_at: r.created_at,
      user_nickname: r.user?.nickname,
      user_profile_image: r.user?.profile_image,
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    console.error("리뷰 조회 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});
export default router;

    //이전 프리즈마 이전 코드들은 모두 주석처리함.
    // 네이버 지도에서 가게 존재 여부 확인
    // const query = encodeURIComponent(restaurant_name);
    // const naverUrl = `https://openapi.naver.com/v1/search/local.json?query=${query}&display=1`;

    // const naverRes = await axios.get(naverUrl, {
    //   headers: {
    //     "X-Naver-Client-Id": NAVER_CLIENT_ID,
    //     "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
    //   },
    // });

    // 검색 결과가 없으면 실제 존재하지 않는 가게라고 판단 -> 네이버가 가장 빠르게 정보 반영을 하기에 이런 방법으로 생각했습니다!
    // if (!naverRes.data.items || naverRes.data.items.length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "실제 지도에서 해당 가게를 찾을 수 없습니다.",
    //   });
    // }

    // 존재하면 DB에 리뷰 등록
//     const [result] = await pool.query(
//       `INSERT INTO mission_review (mission_id, restaurant_id, user_id, content, rating, photo)
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [mission_id, restaurant_id, user_id, content, rating, photo]
//     );

//     res.status(201).json({
//         success: true,
//         review_id: result.insertId,
//         verified_store: restaurant_name, 
//       });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "서버 오류" });
//   }
// });

