import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpsStatus from "http-status";
import pick from "../../../shared/pick";
import { userFilterAbleFields } from "./user.constant";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req);
  sendResponse(res, {
    statusCode: httpsStatus.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctor(req);
  sendResponse(res, {
    statusCode: httpsStatus.OK,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatient(req);
  sendResponse(res, {
    statusCode: httpsStatus.OK,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await userService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpsStatus.OK,
      success: true,
      message: "User data retrieve successfully ..!",
      meta: result.meta,
      data: result.data,
    });
  }
);

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await userService.updateUserStatus(id, req.body);
  sendResponse(res, {
    statusCode: httpsStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  updateUserStatus
};
