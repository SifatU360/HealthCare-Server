import { fileURLToPathBuffer } from "node:url";
import { Admin, PrismaClient, UserRole } from "../../../../generated/prisma";
import bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";
import { Request } from "express";
const prisma = new PrismaClient();

const createAdmin = async (req: Request): Promise<Admin> => {

  const file = req.file;

  if(file){
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file) as { secure_url: string };
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
  }
  
  const hashedPassword: string = await bcrypt.hash( req.body.password, 12);
  const userData = {
    email:  req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data:  req.body.admin,
    });

    return createdAdminData;
  });
  // const adminData = {
  //     name: data.asmin.name,
  //     email : data.admin.email
  // }
  return result;
};

export const userService = {
  createAdmin,
};
