import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";

import validateRequest from "../../middlewares/validateRequest";
// import { DoctorScheduleValidation } from './doctorSchedule.validation';
import { UserRole } from "../../../../generated/prisma";

const router = express.Router();

/**
 * API ENDPOINT: /doctor-schedule/
 *
 * Get all doctor schedule with filtering
 */
// router.get(
//     '/',
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
//     DoctorScheduleController.getAllFromDB
// );

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getMySchedule
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  // validateRequest(DoctorScheduleValidation.create),
  DoctorScheduleController.insertIntoDB
);

router.delete(
  "/:id", // Doctor Schedule -> Get My Schedule -> scheduleId
  auth(UserRole.DOCTOR),
  DoctorScheduleController.deleteFromDB
);

export const DoctorScheduleRoutes = router;
