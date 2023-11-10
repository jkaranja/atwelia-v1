import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { UserInToken } from "../types/user";
import { Request, RequestHandler, Response } from "express";

//jwt tokens
//access token

export const genAccessToken = (user: UserInToken) => {
  return jwt.sign(
    {
      user,
    },
    process.env.ACCESS_TOKEN_SECRET
    // { expiresIn: "7d" } //expiries in->2hr is standard//other options: 60, 15m, "2 days", "10h", "7d"
    //note: as a string without unit eg "120" is equal to "120ms", as a number, no unit: eg 120 = "120s"
  );
};

//RefreshToken
export const genRefreshToken = (_id: Types.ObjectId) => {
  return jwt.sign(
    {
      _id,
    },
    process.env.REFRESH_TOKEN_SECRET
    // { expiresIn: "31d" } //expires in 31 days
  );
};

//return access token and set cookie headers
export const setTokenAndCookie = (req: any, res: Response) => {
  const { _id, roles, accountStatus } = req.user!;

  //gen access token//web+mobile
  const accessToken = genAccessToken({
    _id: _id,
    roles: roles,
    accountStatus: accountStatus,
  });

  //gen refresh token: web
  const refreshToken = genRefreshToken(_id);

  // Create secure cookie with refresh token as value//for web
  const day = 24 * 60 * 60 * 1000;
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //can't be accessed by client script via document.cookie//only server//xss won't be able to req new access token if current is stolen
    secure: true, //allow only https//in dev, remove secure part in postman cookie manager//cors handle browser req with credentials=true
    sameSite: "none", //'none' | boolean | 'strict' | 'lax' //cross-site cookie//allow//for csrf, it won't happen since all requests needs an access token too
    // maxAge: 31 * day, //31 days//cookie expiry set to match refreshToken
  });

  return accessToken;
};

//random tokens//for pwd recovery
//will give as 20 characters//hex is 16 numbers 0-9
export const genRandomToken = () => {
  return crypto.randomBytes(10).toString("hex");
};
//hash token
export const hashRandomToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

//6 digit one time password(otp) or one-time PIN //randomNumber//or use the otp-generator package
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
