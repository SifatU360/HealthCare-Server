import { Prisma, PrismaClient } from "../../../../generated/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { adminSearchAbleFields } from "./admin.constant";

const getAllFromDB = async(params: any, options: any) => {
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
    const {searchTerm, ...filterData} = params;
    // const adminSearchAbleFields = ['name', 'email'];
    if(params.searchTerm){
        andConditions.push({
            OR: adminSearchAbleFields.map(field =>( {
                [field]:{
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if(Object.keys(filterData).length>0){
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key] :{
                    equals: filterData[key]
                }
            }))
        })
    }
   
    const whereConditions: Prisma.AdminWhereInput = {AND: andConditions};
    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    return result;
}

export const AdminService = {
    getAllFromDB
}