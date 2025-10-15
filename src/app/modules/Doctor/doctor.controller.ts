import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.updateIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctor data updated successfully ..!",
    success: true,
    data: result,
  });
});
export const DoctorController = {
  updateIntoDB,
};
