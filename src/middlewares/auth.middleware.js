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
      req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      console.error("❌ No token found in request");
      throw new APIerror(401, "Unauthorized Request");
    }

    console.log("🔑 Received Token:", token);

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      console.error("JWT Verification Failed:", error);
      if (error.name === "TokenExpiredError") {
        throw new APIerror(401, "Token has expired. Please log in again.");
      }
      throw new APIerror(401, "Invalid Access Token");
    }

    console.log("✅ Decoded Token:", decodedToken);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      console.error("❌ No user found for token");
      throw new APIerror(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Error in verifyJWT:", error);
    throw new APIerror(500, error?.message || "Internal Server Error");
  }
});
