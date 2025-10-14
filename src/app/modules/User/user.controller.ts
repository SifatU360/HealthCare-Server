import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpsStatus from "http-status";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req);
  sendResponse(res, {
    statusCode: httpsStatus.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
};
