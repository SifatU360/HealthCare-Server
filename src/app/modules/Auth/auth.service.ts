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
    config.jwt.expires_in as string
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
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
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
    <div
      style="
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #667eea, #764ba2, #e06479, #035f9c);
        padding: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      "
    >
      <div
        style="
          background-color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          padding: 40px;
          max-width: 500px;
          text-align: left;
          color: #2d3748;
        "
      >
        <h2
          style="
            color: #1a202c;
            font-weight: 600;
            margin-bottom: 20px;
            font-size: 24px;
          "
        >
          Password Reset Request
        </h2>

        <p
          style="
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 16px;
            line-height: 1.6;
          "
        >
          We received a request to reset your password. To proceed with the
          password reset, please click the button below.
        </p>

        <a
          href="${resetPassLink}"
          style="text-decoration: none; display: inline-block; margin: 25px 0"
        >
          <button
            style="
              background-color: #2563eb;
              border: none;
              color: white;
              padding: 12px 32px;
              font-size: 16px;
              font-weight: 500;
              border-radius: 6px;
              cursor: pointer;
              transition: background-color 0.2s ease;
            "
            onmouseover="this.style.backgroundColor='#1d4ed8';"
            onmouseout="this.style.backgroundColor='#2563eb';"
          >
            Reset Password
          </button>
        </a>

        <p style="font-size: 14px; color: #64748b; margin-top: 20px">
          This link will expire in <strong>5 minutes</strong>.
        </p>

        <hr
          style="margin: 25px 0; border: none; border-top: 1px solid #e2e8f0"
        />

        <p style="font-size: 14px; color: #64748b; line-height: 1.6">
          If you didn't request this password reset, please disregard this
          email.
          <br />Your account security is important to us.
        </p>

        <div style="margin-top: 30px; font-size: 14px; color: #64748b">
          Best regards,<br />
          Health Care Service
        </div>
      </div>
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
