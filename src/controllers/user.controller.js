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
  const userId = req.user.id; 
  
  const updateData = req.body; 

  try {
    const updatedUser = await userUpdateInfo(userId, updateData); 

    res.status(StatusCodes.OK).success(updatedUser);
  } catch (error) {
    next(error);
  }
};