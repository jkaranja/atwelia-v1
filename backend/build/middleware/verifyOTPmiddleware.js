"use strict";
// import { RequestHandler } from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/User";
// import { UserInToken } from "../types/user";
// import bcrypt from "bcrypt";
// export const verifyOTP: RequestHandler = async (req, res, next) => {
//   const { phoneNumber, otp } = req.body;
//   if (!phoneNumber || !otp) {
//     return res.status(400).json({ message: "Verification failed" });
//   }
//   const user = await User.findOne({ phoneNumber }).exec();
//   if (!user || !user.otp || !user.otpExpiresAt) {
//     return res.status(400).json({ message: "Verification failed" });
//   }
//   //compare otp//note->gen a hash with same otp won't produce same hash as a random salt is added to make each hash unique. Must use compare
//   const match = await bcrypt.compare(otp, user.otp);
//   if (!match) {
//     return res.status(400).json({ message: "Verification code is invalid" });
//   }
//   //check expiry
//   const isValid = new Date(user.otpExpiresAt).getTime() >= Date.now();
//   if (!isValid) {
//     return res.status(400).json({
//       message: "Verification code has expired",
//     });
//   }
//   //valid->clear otp
//   user.otp = null;
//   user.otpExpiresAt = null;
//   await user.save();
//   next();
// };
