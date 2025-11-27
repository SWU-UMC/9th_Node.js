import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  /*
  #swagger.summary = '회원 가입 API';
  #swagger.tags = ['User'];
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["email", "name", "gender", "birth", "password"],
          properties: {
            email: { type: "string", example: "test@example.com" },
            name: { type: "string", example: "이름" },
            gender: { type: "string", example: "여성" },
            birth: { type: "string", format: "date", example: "2000-01-01" },
            address: { type: "string", example: "서울시" },
            detailAddress: { type: "string", example: "OO구 OO동" },
            phoneNumber: { 
              type: "string",
              example: "010-1234-5678",
              description: "현재 서버에서는 사용하지 않는 선택 필드"
            },
            password: { type: "string", example: "password123" },
            preferences: {
              type: "array",
              items: { type: "number" },
              example: [1, 2]
            }
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
                email: { type: "string", example: "test@example.com" },
                name: { type: "string", example: "이름" },
                preferCategory: {
                  type: "array",
                  items: { type: "string" },
                  example: ["한식", "일식"]
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "요청 값이 유효하지 않은 경우",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "V001" },
                reason: {
                  type: "string",
                  example: "유효하지 않은 요청입니다."
                },
                data: {
                  type: "object",
                  example: { field: "email", value: "not-an-email" }
                }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[409] = {
    description: "이미 존재하는 이메일인 경우",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U001" },
                reason: { type: "string", example: "이미 존재하는 이메일입니다." },
                data: { type: "object" }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body);
    console.log("REQ BODY preferences:", req.body?.preferences);

    const dto = bodyToUser(req.body);
    console.log("DTO preferences:", dto.preferences);

    const user = await userSignUp(dto);
    res.status(StatusCodes.OK).success(user);
  } catch (err) {
    next(err);
  }
};
