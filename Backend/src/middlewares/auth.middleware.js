import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler((req, res, next)=> {
    try {
        const token = req.cookies?.accessTocken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {throw new ApiError(401, "Unauthorized: No token provided");}

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next()
    } catch (error) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }
});

