import express from "express";
import { userController } from "./user.controller";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.createAdmin
);

export const userRoutes = router;
