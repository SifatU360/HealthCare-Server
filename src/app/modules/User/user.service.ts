import { fileURLToPathBuffer } from "node:url";
import { PrismaClient, UserRole } from "../../../../generated/prisma";
import bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";
const prisma = new PrismaClient();

const createAdmin = async (req: any) => {

  const file = req.file;

  if(file){
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    console.log(uploadToCloudinary);
  }
  
  // const hashedPassword: string = await bcrypt.hash(data.password, 12);
  // const userData = {
  //   email: data.admin.email,
  //   password: hashedPassword,
  //   role: UserRole.ADMIN,
  // };

  // const result = await prisma.$transaction(async (transactionClient) => {
  //   const createdUserData = await transactionClient.user.create({
  //     data: userData,
  //   });

  //   const createdAdminData = await transactionClient.admin.create({
  //     data: data.admin,
  //   });

  //   return createdAdminData;
  // });
  // // const adminData = {
  // //     name: data.asmin.name,
  // //     email : data.admin.email
  // // }
  // return result;
};

export const userService = {
  createAdmin,
};
