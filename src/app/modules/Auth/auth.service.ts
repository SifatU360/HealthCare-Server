import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


    
const loginUser = async(payload:{
    email: string,
    password: string
}) =>{
    const userData = await prisma.user.findUnique({
        where: {
            email: payload.email
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
    try {
        const decodedData = jwt.verify(token, "abcdefghlloer3425");

    } catch (error) {
        throw new Error("You are not authorized user");
    }    
}

export const AuthService = {
    loginUser,
    refreshToken
}