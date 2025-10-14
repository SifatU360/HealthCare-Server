import { fileURLToPathBuffer } from "node:url";
import { Admin, Doctor, Patient, PrismaClient, UserRole } from "../../../../generated/prisma";
import bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";
import { Request } from "express";
import { IFile } from "../../interfaces/file";
const prisma = new PrismaClient();

const createAdmin = async (req: Request): Promise<Admin> => {

  const file = req.file as IFile;

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
    await transactionClient.user.create({
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
const createDoctor = async (req: Request): Promise<Doctor> => {

  const file = req.file as IFile;

  if(file){
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url
  }
  
  const hashedPassword: string = await bcrypt.hash( req.body.password, 12);
  const userData = {
    email:  req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data:  req.body.doctor,
    });

    return createdDoctorData;
  });
  return result;
};
const createPatient = async (req: Request): Promise<Patient> => {

  const file = req.file as IFile;

  if(file){
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url
  }
  
  const hashedPassword: string = await bcrypt.hash( req.body.password, 12);
  const userData = {
    email:  req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdPatientData = await transactionClient.admin.create({
      data:  req.body.patient,
    });

    return createdPatientData;
  });
  return result;
};

export const userService = {
  createAdmin,
  createDoctor,
  createPatient
};
