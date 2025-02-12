// This middle ware will recognize where the user is there or not
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

///  Here res was not in use due to which We have written a underscofre in it

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", " ");

    if (!token) {
      throw new APIerror(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new APIerror(401, error?.message || "Invalid Access Token");
  }
});
