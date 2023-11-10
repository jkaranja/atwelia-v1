"use strict";
// import bcrypt from "bcrypt";
// import { RequestHandler } from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/User";
// import sendEmail from "../utils/sendEmail";
// import {
//   genAccessToken,
//   genRandomToken,
//   genRefreshToken,
//   generateOTP,
//   hashRandomToken,
// } from "../utils/tokens";
// import { addMinutes } from "date-fns";
// import sendMessage from "../utils/sendMessage";
// /*-----------------------------------------------------------
//  * LOGIN
//  ------------------------------------------------------------*/
// interface LoginBody {
//   phoneNumber: string;
//   otp: string;
// }
// /**
//  * @desc - Login
//  * @route - POST /auth
//  * @access - Public
//  */
// export const login: RequestHandler<
//   unknown,
//   unknown,
//   LoginBody,
//   unknown
// > = async (req, res) => {
//   const { phoneNumber } = req.body;
//   if (!phoneNumber) {
//     return res.status(400).json({ message: "Verification failed" });
//   }
//   const user = await User.findOne({ phoneNumber }).exec();
//   if (!user) {
//     return res.status(400).json({ message: "Verification failed" });
//   }
//   //gen access token//web+mobile
//   const accessToken = genAccessToken({
//     _id: user._id,
//     roles: user.roles,
//     accountStatus: user.accountStatus,
//   });
//   //gen refresh token: web
//   const refreshToken = genRefreshToken(user._id);
//   // Create secure cookie with refresh token as value//for web
//   const day = 24 * 60 * 60 * 1000;
//   res.cookie("jwt", refreshToken, {
//     httpOnly: true, //can't be accessed by client script via document.cookie//only server//xss won't be able to req new access token if current is stolen
//     secure: true, //allow only https//in dev, remove secure part in postman cookie manager//cors handle browser req with credentials=true
//     sameSite: "none", //'none' | boolean | 'strict' | 'lax' //cross-site cookie//allow//for csrf, it won't happen since all requests needs an access token too
//     maxAge: 31 * day, //31 days//cookie expiry set to match refreshToken
//   });
//   return res.json({ accessToken });
// };
// /*--------------------------------------------------------
//  * SEND OTP
//  ---------------------------------------------------------*/
// /**
//  * @desc - send OTP
//  * @route - PATCH api/auth/resend/otp
//  * @access - Public
//  */
// export const sendOTP: RequestHandler = async (req, res) => {
//   const { phoneNumber } = req.body;
//   if (!phoneNumber) {
//     return res.status(400).json({ message: "Phone number required" });
//   }
//   const user = await User.findOne({ phoneNumber }).exec();
//   if (!user) {
//     return res.status(400).json({ message: "Wrong credentials" });
//   }
//   //gen random 6 digit OTP
//   const otp = generateOTP();
//   //hash otp//you can use crypto module but bcrypt gen a stronger hash
//   const hashedOTP = await bcrypt.hash(otp, 10);
//   //save otp to db
//   user.otp = hashedOTP;
//   user.otpExpiresAt = addMinutes(new Date(), 5); //otp expires in 5 min
//   // save changes
//   await user.save();
//   // Send otp as text
//   // sendMessage({
//   //   to: phoneNumber,
//   //   message: `Your Rentoz verification code is: ${otp}. Don't share this code with anyone; our employees will never ask for the code.`,
//   // });
//   //message should be <#> otp hash //hash identify the app//it's constant//see hash with the verify package//
//   // eg <#> 345553 OJo1dlXY5BP //hash is valid//working without the <#>
//   console.log(otp);
//   res.json({
//     message: "Verification code sent",
//   });
// };
// /*--------------------------------------------------------
//  * REFRESH TOKEN//GET NEW ACCESS TOKEN
//  ---------------------------------------------------------*/
// /**
//  * @desc - Refresh
//  * @route - GET /auth/refresh
//  * @access - Public
//  */
// export const refresh: RequestHandler = (req, res) => {
//   const cookies = req.cookies;
//   if (!cookies?.jwt) return res.status(403).json({ message: "Forbidden" });
//   const refreshToken: string = cookies.jwt; //cookies.jwt is of any type//must be converted to string for err & decoded types to be inferred
//   //else you must pass type: err: VerifyErrors | null,  decoded: JwtPayload | string | undefined
//   jwt.verify(
//     refreshToken,
//     process.env.REFRESH_TOKEN_SECRET,
//     async (err, decoded) => {
//       if (err) return res.status(403).json({ message: "Forbidden" });
//       const { _id } = <{ _id: string }>decoded;
//       const foundUser = await User.findById(_id).exec();
//       if (!foundUser) return res.status(403).json({ message: "Forbidden" });
//       const accessToken = genAccessToken({
//         _id: foundUser._id,
//         roles: foundUser.roles,
//         accountStatus: foundUser.accountStatus,
//       });
//       res.json({ accessToken });
//     }
//   );
// };
// /*--------------------------------------------------------
//  * LOGOUT//CLEAR REFRESH TOKEN COOKIE
//  ---------------------------------------------------------*/
// /**
//  * @desc - Logout
//  * @route - POST api/auth/logout
//  * @access - Public
//  *
//  */
// export const logout: RequestHandler = (req, res) => {
//   const cookies = req.cookies;
//   if (!cookies?.jwt) {
//     //return res.sendStatus(204); //No content// sendStatus is same as res.status(204).send('No content')
//     //204 don't have response body
//     ////sendStatus sets res http status code and sends the status code string representation as res body
//     //still send success if jwt has already cleared or has expired
//     return res.status(200).json({ message: "Logged out" });
//   }
//   res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
//   res.json({ message: "Logged out" });
// };
