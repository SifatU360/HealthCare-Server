import { UserStatus } from "../../../../generated/prisma";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma"
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';


    
const loginUser = async(payload:{
    email: string,
    password: string
}) =>{
    const userData = await prisma.user.findUnique({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword = await bcrypt.compare(payload.password, userData?.password as string);
    
    if(!isCorrectPassword){
        throw new Error("Password is incorrect");
    }
    const accessToken = jwtHelpers.generateToken({
        email: userData?.email,
        role: userData?.role
    },
    "abcdefghl1046",
    "15m"
    );
    
    const refreshToken = jwtHelpers.generateToken({
        email: userData?.email,
        role: userData?.role
    },
    "abcdefghlloer3425",
    "30d"
    );
    console.log(accessToken);

    return {
        accessToken,
        needPasswordChange: userData?.needPasswordChange,
        refreshToken
    };
}

const refreshToken = async(token: string) =>{
    let decodedData;
    try {
      decodedData = jwtHelpers.verifyToken(token, "abcdefghlloer3425");

    } catch (error) {
        throw new Error("You are not authorized user");
    }
    const isUserExist = await prisma.user.findUniqueOrThrow({
        where: {
            // email: (decodedData as any).email
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email: isUserExist?.email,
        role: isUserExist?.role
    },
    "abcdefghl1046",
    "15m"
    );
    return {
        accessToken,
        needPasswordChange: isUserExist?.needPasswordChange,
    }; 
}

export const AuthService = {
    loginUser,
    refreshToken
}