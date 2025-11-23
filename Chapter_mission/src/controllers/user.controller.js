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
        schema:{
          $email: "test@example.com",
          $password: "qwer1234!",
          $name: "워니"
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
