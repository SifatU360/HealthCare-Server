import {
  Admin,
  Prisma,
  PrismaClient,
  UserStatus,
} from "../../../../generated/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { adminSearchAbleFields } from "./admin.constant";
import { IAdminFilterRequest } from "./admin.interface";

const getAllFromDB = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const andConditions: Prisma.AdminWhereInput[] = [];
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  // [
  //             {
  //                 name: {
  //                     contains: params.searchTerm,
  //                     mode: 'insensitive'
  //                 }
  //             },
  //             {
  //                 email: {
  //                     contains: params.searchTerm,
  //                     mode: 'insensitive'
  //                 }
  //             }
  // ]
  const { searchTerm, ...filterData } = params;
  // const adminSearchAbleFields = ['name', 'email'];
  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (id: string, data: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

const deleteFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });
  return result;
};

const softDeleteFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });
  return result;
};

export const AdminService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
