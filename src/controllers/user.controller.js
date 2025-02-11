import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { APIresponse } from "../utils/APIresponse.js";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new APIerror(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
const registerUser = asyncHandler(async (req, res, next) => {
  // get user details from frontend
  // Validate - not empty
  // check if user already exists (username , email should be unique)
  //check for images , check for avatar
  // upload them to cloudinary , avatar
  // create user object-- create enntry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  try {
    // console.log("Incoming Request: ", req.body, req.files);
    const { fullName, email, username, password } = req.body;
    ///                      Get user Deatails form frontend
    if (
      [fullName, email, username, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new APIerror(400, "ALL field are required");
    }
    //check if user already exists (username , email should be unique)

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
      throw new APIerror(409, "User with email or userName already exist");
    }
    // console.log(req.files);

    //  //check for images , check for avatar

    const avatarLocalPath = req.file?.path || req.files?.avatar?.[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // made a log so that i will get avatar local path
    // console.log("Avatar local Path:", avatarLocalPath);

    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    // // log to see the url of the coverimage local path
    // console.log("Avatar local Path:", coverImageLocalPath);

    // Written this to solve th error for no cover image so if the cover image is not there then what should it do
    let coverImageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
      throw new APIerror(400, "avatar file is required ");
    }

    console.log("Uploading images to cloudinary....");
    // upload from cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log("Cloudinary avatar upload result :", avatar);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }

    // console.log("Cloudinary coverImage upload result :", coverImage);

    // console.log("Cloudinary upload success", { avatar, coverImage });

    /// // create user object-- create enntry in db
    const user = await User.create({
      fullName,
      avatar: avatar.url || "",
      //edge case hai ki that if it is not there then give an empty string as it is not required
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });
    console.log("User Created: ", user);
    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new APIerror(
        500,
        "Something went wrong while registering the user"
      );
    }
    return res
      .status(201)
      .json(new APIresponse(200, createdUser, "User Registered carefully"));
  } catch (error) {
    console.error("Error in registerUSer:", error);
    next(error);
  }

  // we can check individually but instead of that we can go with a new some method
  // if (fullName === "") {
  //   throw new APIerror(400, "fullname is Required");
  // }

  // if (!avatar) {
  //   throw new APIerror(400, "Avatar files is required");
  // }
});

export { registerUser };
