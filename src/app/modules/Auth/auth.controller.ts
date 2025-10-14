import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  
    const result = await AuthService.loginUser(req.body);

    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      // maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
        statusCode : httpStatus.OK,
        success : true,
        message : "Logged in successfully",
        data : {
            accessToken : result.accessToken,
            needPasswordChange : result.needPasswordChange,
        }
    })
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  
    const result = await AuthService.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode : httpStatus.OK,
        success : true,
        message : "Access token generated successfully",
        data : result
    })
  
});

export const AuthController = {
  loginUser,
  refreshToken,
};
