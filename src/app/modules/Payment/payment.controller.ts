import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentServices } from "./payment.service";
import  httpStatus  from "http-status";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  const result = await PaymentServices.initPayment(appointmentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payment Initiate successfully ..!",
    success: true,
    data: result,
  });
});

export const PaymentController = {
    initPayment
}