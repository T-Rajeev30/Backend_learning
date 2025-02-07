import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { APIresponse } from "../utils/APIresponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // Validate - not empty
  // check if user already exists (username , email should be unique)
  //check for images , check for avatar
  // upload them to cloudinary , avatar
  // create user object-- create enntry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  ///                      Get user Deatails form frontend

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new APIerror(400, "ALL field are required");
  }

  // we can check individually but instead of that we can go with a new some method
  // if (fullName === "") {
  //   throw new APIerror(400, "fullname is Required");
  // }

  //check if user already exists (username , email should be unique)

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new APIerror(409, "User with email or userName already exist");
  }

  //  //check for images , check for avatar

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new APIerror(400, "Avatar files is required");
  }

  // upload from cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new APIerror(400, "Avatar files is required");
  }

  /// // create user object-- create enntry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,

    //edge case hai ki that if it is not there then give an empty string as it is not required
    coverImage: coverImage?.url || "",
    email,
    username: userName.toLowerCase(),
  });

  // remove password and refresh token field from response

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new APIerror(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new APIresponse(200, createdUser, "User Registered carefully"));
});

export { registerUser };
