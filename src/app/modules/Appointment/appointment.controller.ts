import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from 'http-status'
import { AppointmentService } from "./appointment.service";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
    const result = await AppointmentService.createAppointment();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appointment created successfully",
        data: result
    })
})

export const AppointmentController = {
    createAppointment
}