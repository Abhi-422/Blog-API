import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found for token generation");
    }
    const refreshToken = user.generateRefreshToken();
    if (!refreshToken) {
      throw new ApiError(500, "Refresh token generation failed");
    }
    const accessToken = user.generateAccessToken();
    if (!accessToken) {
      throw new ApiError(500, "Access token generation failed");
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};

const registerUser = async (req, res) => {
    //take data from req.body
    
    console.log(req.body);
    const {fullname, username, email, password} = req.body;
    console.log(fullname, username, email, password);
    
    //validate the data
    
    if(!fullname || !username || !email || !password){
        throw new ApiError(400, "All fields are required");
    }
    
    //check if user already exists
    
    const existingUser = await User.findOne({$or: [{email}, {username}]});
    if (existingUser) {
        throw new ApiError(409, "User with given email or username already exists");
    }
    
    //create user stote in DB
    
    const user = await User.create(
      {
        fullname, 
        username:username.toLowerCase(), 
        email, 
        password
      });
    //check user created
    if (!user) {
        throw new ApiError(500, "User registration failed");
    }

    //remove password and other sencitive dara
    const createdUser = await User.findById(user._id).select("-password -refreshtoken");

    if (!createdUser) {
        throw new ApiError(500, "User retrieval after registration failed");
    }

    console.log("User created Successfully: ", createdUser);
    //send cookie in response
    res.status(201).json(new ApiResponse(201, "User registered successfully", createdUser));
};

const loginUser = async (req, res) => {
    //take data from req.body
    const{username, password} = req.body;
    //validate the data
    if(!username || !password){
        throw new ApiError(400, "Username and password are required");
    }
    //check if user exists
    const user = await User.findOne({$or:[{username: username.toLowerCase()}, {email: username}]});
    if(!user){
        throw new ApiError(404, "User not found");
    }
    //verify password
    const isPasswordValid = await user.isPasswordMatch(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password");
    }
    //generate tokens
    const tokens = await generateAccessAndRefreshTokens(user._id);

    //set cookie and send response
    console.log("Login successful for user: ", user.username);
    res.status(200).json(new ApiResponse(200, "Login successful", {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          _id: user._id,
          fullname: user.fullname,
      }}
    )
  );
  };

const logoutUser = async (req, res) => {
    //clear cookie and send response
    const { userId } = req.body;
    if (!userId) {
        throw new ApiError(400, "User ID is required for logout");
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    console.log("Logout successful for user: ", user.username);
    res.status(200).json(new ApiResponse(200, "Logout successful"));
    
};

export { registerUser, loginUser, logoutUser };
