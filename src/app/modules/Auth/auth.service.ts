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
    const accessToken = jwt.sign(
        {
            email: userData?.email,
            role: userData?.role
        },
        "abcdefg33",
        {
            algorithm: 'HS256',
            expiresIn: '15m'
        }
    )
    console.log(accessToken);

    return {
        accessToken,
        needPasswordChange: userData?.needPasswordChange
    };
}

export const AuthService = {
    loginUser
}