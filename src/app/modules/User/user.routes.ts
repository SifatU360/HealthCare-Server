import express from "express";
import { userController } from "./user.controller";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";

const router = express.Router();


router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single('file'),
  userController.createAdmin
);

export const userRoutes = router;
