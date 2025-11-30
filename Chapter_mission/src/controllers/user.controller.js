// src/controllers/user.controller.js
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import bcrypt from "bcrypt";

export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.summary = '회원가입'
    #swagger.description = '이메일, 비밀번호, 닉네임으로 회원을 등록합니다.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              password: { type: "string" },
              name: { type: "string" }
            },
            required: ["email", "password", "name"],
            example: {
              email: "test@example.com",
              password: "qwer1234!",
              name: "워니"
            }
          }
        }
      }
    }
    
    #swagger.responses[201] = {
      description: '회원가입 성공',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/SuccessResponse'
          },
          example: {
            resultType: "SUCCESS",
            error: null,
            success: {
              id: 1,
              email: "test@example.com",
              nickname: "워니"
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: '비밀번호 규칙 위반 등 잘못된 요청',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ErrorResponse'
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "U002",
              reason: "비밀번호 규칙 위반",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: '이메일 중복',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ErrorResponse'
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "U001",
              reason: "이미 사용 중인 이메일입니다.",
              data: { email: "test@example.com" }
            },
            success: null
          }
        }
      }
    }
  */

  console.log("회원가입 요청이 들어왔습니다!");
  console.log("body:", req.body);

  try {
    // 요청 Body 정제
    const userData = bodyToUser(req.body);

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // 서비스 레이어 호출
    const user = await userSignUp(userData);

    res.status(StatusCodes.CREATED).success(user); // 성공 응답
  } catch (error) {
    next(error); // 실패 응답 전역 에러 핸들러
  }
};

// 내 정보 수정
export const handleUpdateMe = async (req, res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.summary = '내 정보 수정'
    #swagger.description = '로그인된 사용자의 프로필 정보를 수정합니다. (이름, 닉네임, 전화번호, 생일 등)'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            description: "사용자 프로필에서 수정할 필드만 전송하면 됩니다.",
            properties: {
              name: { type: "string", description: "실명" },
              nickname: { type: "string", description: "닉네임" },
              phoneNumber: { type: "string", description: "전화번호" },
              birth: { 
                type: "string", 
                format: "date", 
                description: "생년월일 (YYYY-MM-DD)" 
              }
            }
          },
          example: {
            name: "김예원",
            nickname: "워니",
            phoneNumber: "010-1234-5678",
            birth: "2000-01-01"
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: '내 정보 수정 성공',
      content: {
        "application/json": {
          schema: { 
            $ref: "#/components/schemas/SuccessResponse"
          },
          example: {
            resultType: "SUCCESS",
            error: null,
            success: {
              id: 1,
              email: "test@example.com",
              name: "김예원",
              nickname: "워니",
              phoneNumber: "010-1234-5678",
              birth: "2000-01-01"
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: '잘못된 요청 (수정할 필드 없음, birth 형식 오류 등)',
      content: {
        "application/json": {
          schema: { 
            $ref: "#/components/schemas/ErrorResponse"
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "unknown",
              reason: "수정할 정보가 없습니다. 최소 한 개 이상의 필드를 보내야 합니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[401] = {
      description: '인증되지 않은 사용자 (로그인 필요)',
      content: {
        "application/json": {
          schema: { 
            $ref: "#/components/schemas/ErrorResponse"
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "AUTH001",
              reason: "인증이 필요한 요청입니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[500] = {
      description: '서버 내부 오류',
      content: {
        "application/json": {
          schema: { 
            $ref: "#/components/schemas/ErrorResponse"
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "unknown",
              reason: "서버 내부 오류가 발생했습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */

  try {
    // authMiddleware에서 세팅 req.user = { id, email, ... }
    if (!req.user || !req.user.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        resultType: "FAIL",
        error: {
          errorCode: "AUTH001",
          reason: "인증이 필요한 요청입니다.",
          data: null,
        },
        success: null,
      });
    }

    const userId = req.user.id;

    const updateData = bodyToUserUpdate(req.body);

    if (Object.keys(updateData).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        resultType: "FAIL",
        error: {
          errorCode: "unknown",
          reason: "수정할 정보가 없습니다. 최소 한 개 이상의 필드를 보내야 합니다.",
          data: null,
        },
        success: null,
      });
    }

    const updatedUser = await updateUserProfile(userId, updateData);

    const response = responseFromUser(updatedUser);

    res.status(StatusCodes.OK).success(response);
  } catch (error) {
    next(error);
  }
};