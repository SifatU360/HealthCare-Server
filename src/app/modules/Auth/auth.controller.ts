import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const result = await AuthService.loginUser(req.body);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: result
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
    loginUser
}