import { Response } from "express";

const sendResponse = <T>(res: Response, jsonData:{
    statusCode: number,
    success: boolean,
    message: string,
    meta?:{
        page: number,
        limit: number,
        total: number
    }
    data: T | null,
}) => {
     res.status(jsonData.statusCode).json({
            success: jsonData.success,
            message: jsonData.message,
            data: jsonData.data || null || undefined,
            meta: jsonData.meta || null || undefined
        })
}

export default sendResponse;