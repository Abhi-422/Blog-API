// import asyncHandler from "../utils/asyncHandler.js";
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
  const { fullname, username, email, password } = req.body;
  //validate the data

  if (!fullname || !username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  //check if user already exists

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "User with given email or username already exists");
  }

  //create user stote in DB

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
  });
  //check user created
  if (!user) {
    throw new ApiError(500, "User registration failed");
  }

  //remove password and other sencitive dara
  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User retrieval after registration failed");
  }
  //send cookie in response
  return res.status(201).json(
    new ApiResponse(201, "User registered successfully", createdUser)
  );
};

const loginUser = async (req, res) => {
  //take data from req.body
  const { username, password } = req.body;
  //validate the data
  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }
  //check if user exists
  const user = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: username }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  //verify password
  const isPasswordValid = await user.isPasswordMatch(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }
  //generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );
  //set cookie and send response
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessTocken", accessToken, options)
    .cookie("refreshTocken", refreshToken, options)
    .json(
      new ApiResponse(200, "Login successful", {
        user: {loggedInUser, accessToken, refreshToken},
      })
    );
};

const logoutUser = async (req, res) => {
  //clear cookie and send response

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: null },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessTocken", options)
    .clearCookie("refreshTocken", options)
    .json(new ApiResponse(200, "Logout successful", {}));
};

export { registerUser, loginUser, logoutUser };
