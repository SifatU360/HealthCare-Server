import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";
import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync";

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.inserIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties insert successfully",
    data: result,
  });
});

export const SpecialtiesController = {
 inserIntoDB
}