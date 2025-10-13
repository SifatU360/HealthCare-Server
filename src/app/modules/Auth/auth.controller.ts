import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const result = await AuthService.loginUser(req.body);
        
        const {refreshToken} = result;

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            // maxAge: 7 * 24 * 60 * 60 * 1000, 
        })
        
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                accessToken: result.accessToken,
                needPasswordChange: result.needPasswordChange
            }
        })
        
    } catch (err:any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }
}

const refreshToken = async (req: Request, res: Response) => {
    
    const { refreshToken } = req.cookies;
    
    try {
        const result = await AuthService.refreshToken(refreshToken);
        
        res.status(200).json({
            success: true,
            message: "Refresh Token get successfully",
            data: null
        })
        
    } catch (err:any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }
}

export const AuthController = {
    loginUser,
    refreshToken
}