import { UserStatus } from "../../../../generated/prisma";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { JwtPayload, Secret } from "jsonwebtoken";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData?.password as string
  );

  if (!isCorrectPassword) {
    throw new Error("Password is incorrect");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.jwt_secret as Secret,
    "15m"
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.refresh_token_secret as Secret,
    "30d"
  );
  // console.log(accessToken);

  return {
    accessToken,
    needPasswordChange: userData?.needPasswordChange,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
  } catch (error) {
    throw new Error("You are not authorized user");
  }
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      // email: (decodedData as any).email
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: isUserExist?.email,
      role: isUserExist?.role,
    },
    config.jwt.jwt_secret as Secret,
    "15m"
  );
  return {
    accessToken,
    needPasswordChange: isUserExist?.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Old Password is incorrect");
  }
  const newHashPassword: string = await bcrypt.hash(payload.newPassword, 10);
  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: newHashPassword,
      needPasswordChange: false,
    },
  });

  return { message: "Password changed successfully" };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_secret as Secret,
    "5m"
  );
  console.log("Reset Pass Token", resetPassToken);

  const resetPassLink = `${config.reset_pass_link}?userId=${userData.id}&token=${resetPassToken}`;

  console.log("Reset Pass Link", resetPassLink);
  await emailSender(
    userData.email,
    `
    <div>
      <h4>Dear User,</h4>
      <p
        style="font-size: 14px; color: #333;"
      >You have requested to reset your password.</p>
      <p
        style="font-size: 14px; color: #333;"
      >Click the following link to reset your password:</p>
      <a href="${resetPassLink}">
        <button
          style="
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 8px;
          "
        >
          Reset Password
        </button>
      </a>
      <p
        style="font-size: 12px; color: gray; margin-top: 10px;"
      >This link will expire in 5 minutes.</p>
    </div>
    `
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  ) as JwtPayload;
  if (!isValidToken) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Invalid/Expired reset password link"
    );
  }
  const newHashPassword: string = await bcrypt.hash(payload.password, 10);
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: newHashPassword,
    },
  });
};
export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
