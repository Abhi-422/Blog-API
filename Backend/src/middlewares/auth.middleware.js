import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
// import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, _, next)=> {
    try {
        const token = req.cookies?.accessTocken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {throw new ApiError(401, "Unauthorized: No token provided");}
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Unauthorized: User not found");
        }
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized: No token provided");
    }
};
