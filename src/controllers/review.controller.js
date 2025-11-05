//src/controllers/review.controller.js:
//가게에 리뷰 추가하기!
const express = require("express");
const axios = require("axios"); // 외부 API 호출용
const router = express.Router();
const pool = require("../services/db.config");

// 네이버 지도 API 정보 (.env에 추가할 값) -> 실제 생성하지 않아서. 컨트롤러에 올려요!



// POST /api/review  -> 기존 이미 생성을 변경! 프리즈마 맞춰서
router.post("/review", async (req, res) => {
  const { mission_id, restaurant_id, user_id, content, rating, photo, restaurant_name } = req.body;

  try {
    // Prisma를 이용한 mission_review 테이블 insert
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
 *[GET] 특정 가게(storeId)의 리뷰 목록 조회 -> 워크북 내용 실습
 * URL: /api/v1/stores/:storeId/reviews
 */
 router.get("/v1/stores/:storeId/reviews", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor =
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const reviews = await listStoreReviews(storeId, cursor);

    res.status(200).json(reviews);
  } catch (err) {
    console.error("리뷰 조회 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

module.exports = router
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

