import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp, userUpdateInfo } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  /*
  #swagger.summary = '회원 가입 API';
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: { type: "string" },
            name: { type: "string" },
            gender: { type: "string" },
            birth: { type: "string", format: "date" },
            address: { type: "string" },
            detailAddress: { type: "string" },
            phoneNumber: { type: "string" },
            preferences: { type: "array", items: { type: "number" } }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: "회원 가입 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                email: { type: "string" },
                name: { type: "string" },
                preferCategory: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[400] = {
    description: "잘못된 요청 데이터"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "INVALID_INPUT" },
                reason: { type: "string", example: "요청 본문이 유효하지 않습니다." } 
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[401] = {
    description: "인증 실패"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "UNAUTHORIZED" },
                reason: { type: "string", example: "접근 권한이 없거나 토큰이 유효하지 않습니다." }
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[404] = {
    description: "리소스를 찾을 수 없음"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "NOT_FOUND" },
                reason: { type: "string", example: "리소스를 찾을 수 없습니다. " }
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[500] = {
    description: "서버 내부 오류"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "INTERNAL_SERVER_ERROR" },
                reason: { type: "string", example: "회원가입 중에 예기치 않은 오류가 발생했습니다. " }
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }
  */
  console.log("회원가입을 요청했습니다!");

  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

	
  try {
    const user = await userSignUp(bodyToUser(req.body));
    
    res.status(StatusCodes.CREATED).success(user);
  } catch (error) {
    next(error);
  }
};

export const handleUserUpdateInfo = async (req, res, next) => {
  /*
  #swagger.summary = '사용자 정보 수정 API'
  #swagger.description = '인증된 사용자(토큰 기반)의 정보를 수정합니다. (닉네임, 프로필 사진 등)'

  #swagger.security = [{
    "bearerAuth": []
  }]

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string", example: "새닉네임", description: "변경할 닉네임" },
            gender: { type: "string", example: "남자", description: "변경할 성별" },
            birth: { type: "string", example: "2004-04-21", description: "변경할 생년월일" },
            address: { type: "string", example: "서울특별시 노원구", description: "변경할 주소" },
            detailAddress: { type: "string", example: "화랑로 621", description: "변경할 세부주소" },
            phoneNumber: { type: "string", example: "010-1234-1234", description: "변경할 전화번호" },
            preferences: { 
              type: "array", 
              items: { type: "number" },
              description: "사용자 선호 음식 카테고리" 
              example: [1, 2, 5]
            }
          }
        },
        example: {
          name: "새닉네임",
          gender: "남자",
          birth: "2004-04-21",
          address: "서울특별시 노원구",
          detailAddress: "화랑로 621",
          phoneNumber: "010-1234-1234",
          preferences: [1, 2, 5]
        }
      }
    }
  }

  // --- 성공 응답 ---
  #swagger.responses[200] = {
    description: "사용자 정보 수정 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              description: "수정된 사용자 데이터",
              properties: {
                id: { type: "number", example: 12 },
                email: { type: "string", example: "user@example.com" },
                name: { type: "string", example: "새닉네임" },
                gender: { type: "string", example: "남자" },
                birth: { type: "string", example: "2004-04-21" },
                address: { type: "string", example: "서울특별시 노원구" },
                detailAddress: { type: "string", example: "화랑로 621" },
                phoneNumber: { type: "string", example: "010-1234-1234" },
                preferences: { type: "array", itmes: { type: "number"}, example: [1, 2, 5]},
                updated_at: { type: "string", example: "2025-01-23T10:00:00.000Z" }
              }
            }
          }
        }
      }
    }
  }

  // --- 에러 응답 ---
  #swagger.responses[400] = {
    description: "잘못된 요청 데이터"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "INVALID_INPUT" },
                reason: { type: "string", example: "요청 본문이 유효하지 않습니다." } 
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[401] = {
    description: "인증 실패"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "UNAUTHORIZED" },
                reason: { type: "string", example: "접근 권한이 없거나 토큰이 유효하지 않습니다." }
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[404] = {
    description: "사용자 리소스를 찾을 수 없음"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "NOT_FOUND" },
                reason: { type: "string", example: "토큰에 해당하는 사용자 정보를 찾을 수 없습니다." }
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[500] = {
    description: "서버 내부 오류"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "INTERNAL_SERVER_ERROR" },
                reason: { type: "string", example: "사용자 정보 수정 중에 예기치 않은 오류가 발생했습니다. " }
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }
*/
  const userId = req.user.id; 
  
  const updateData = req.body; 

  try {
    const updatedUser = await userUpdateInfo(userId, updateData); 

    res.status(StatusCodes.OK).success(updatedUser);
  } catch (error) {
    next(error);
  }
};