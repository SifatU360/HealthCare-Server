import { Prisma, PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();
const getAllFromDB = async(params: any) => {
    const andConditions: Prisma.AdminWhereInput[] = [];

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
    const adminSearchAbleFields = ['name', 'email'];
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
        where: whereConditions
    });
    return result;
}

export const AdminService = {
    getAllFromDB
}