import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { APIresponse } from "../utils/APIresponse.js";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";
import mongoose from "mongoose";

/// Access and request token for generating Access and refresh token
// it will find the user and will generate access token and refresh token for it
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // console.log("Generating tokens for user:", userId); // Add this log

    const user = await User.findById(userId);

    if (!user) {
      throw new APIerror(404, "User not found while generating tokens");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // console.log("Tokens generated successfully", { accessToken, refreshToken }); // Add this log

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //ValidateBefore save is amn operation
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error while generating tokens:", error);

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

    // console.log(req.body);

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
      throw new APIerror(400, "Avatar file is required");
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

const loginUser = asyncHandler(async (req, res) => {
  // (Actual todos)
  // password check
  // access and refresh token
  // send cookies
  // send a message to frontend for the  verification

  // req.body => data
  const { email, username, password } = req.body;

  // username  or email or fullname
  if (!username && !email) {
    throw new APIerror(400, "username or email is required");
  }
  // console.log(`Got user with this ${username} or ${email}`);

  // here is an alternative  of th eabovve code based on logic discussion
  // if( !username || email) {
  //  throw new APIERROR (400 , "username or email is required ")
  // }

  // find the user  /// here the User is used form moongose it not the registered user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  // console.log("User found", user);
  if (!user) {
    // console.log("USer not found");
    throw new APIerror(404, "User does not exist");
  }

  // console.log("Checking password...");

  const isPasswordValid = await user.isPasswordCorrect(password); // here we are Validating the password from the user which we have created

  // console.log("Is password Valif", isPasswordValid);

  if (!isPasswordValid) {
    // console.log("invalid password");

    throw new APIerror(401, "Invalid User Credentials");
  }

  // console.log("Generating Access and Refresh Tokens...");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  // console.log(`Tokens generated successfully `);

  const loggedInUser = await User.findById(user._id).select(
    "-password  -refreshToken"
  );

  // Sending cookies and also
  // Cookies can by default be chnanged by forntend
  const options = {
    httpOnly: true,
    // but doing these step will make the cokkies more secure which can only be seen and modified at the server side
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new APIresponse(
        200,
        {
          //user wants to save accesstoken and refreshtoken by itself in it's local storag
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in SuccessFully"
      )
    );

  //{(Written by tiwari )
  //validation from backend that either esername , email , full name exist
  // if exist then match it with access token
  // give access to the logged in user }
});

// If we directly take the email from user and wants to log out that user so anyone can logout anyones account
// We are using middlewAre for logout user

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    // but doing these step will make the cokkies more secure which can only be seen and modified at the server side
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new APIresponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, logoutUser };
