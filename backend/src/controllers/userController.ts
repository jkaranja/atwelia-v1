import User from "../models/User";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { removeImage, uploadPic } from "../utils/cloudnary";
import { RequestHandler } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { Role } from "../types/user";
import {
  genAccessToken,
  genRandomToken,
  genRefreshToken,
  generateOTP,
  hashRandomToken,
  setTokenAndCookie,
} from "../utils/tokens";
import { addMinutes } from "date-fns";
import sendMessage from "../utils/sendMessage";
import cleanFiles from "../utils/cleanFiles";
import deleteFiles from "../utils/deleteFiles";
import Review from "../models/Review";
import Profile from "../models/Profile";

/*-----------------------------------------------------------
 * GET USER
 ------------------------------------------------------------*/
/**
 * @desc - Get user
 * @route - GET api/users
 * @access - Private
 *
 */
export const getUser: RequestHandler = async (req, res) => {
  // Get current user details
  const { user } = req;
  // If no users
  if (!user) {
    return res
      .status(400)
      .json({ message: "Something isn't right. Please contact support" });
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });
};

/*-----------------------------------------------------------
 * REGISTER
 ------------------------------------------------------------*/
interface SignUpBody {
  username: string;
  email?: string;
  password?: string;
  phoneNumber: string;
}

/**
 * @desc - Create new user
 * @route - POST /api/users/register
 * @access - Public
 *
 */
export const registerUser: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res) => {
  const { phoneNumber, password, username } = req.body;

  // Confirm data
  if (!phoneNumber || !password || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate phone number
  //collation strength 2 makes value case insensitive i.e it should
  //match both lowercase and uppercase to ensure no same eg email is added in diff cases
  const duplicate = await User.findOne({ phoneNumber })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({
      message: "You already have an account. Please log in",
    });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  //new user
  const newUser = new User({
    phoneNumber,
    password: hashedPwd,
    username,
  }); //or use .create(obj)

  //Save new user
  const user = await newUser.save();

  if (!user) {
    return res.status(400).json({ message: "Oops! Please try again" });
  }

  req.user = user;
  //gen access token + set cookie
  const accessToken = setTokenAndCookie(req, res);

  return res.json({ accessToken });
};

/*-----------------------------------------------------------
 * UPDATE/PATCH
 ------------------------------------------------------------*/
/**
 * @desc - Update user
 * @route - PATCH api/users
 * @access - Private
 */
export const updateUser: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const { username, email, phoneNumber, password, newPassword } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Current password required" });
  }

  const user = await User.findById(_id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Wrong password" });

  // update user
  if (username) user.username = username;
  if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
  //if phoneNumber not null and is diff phone number
  if (phoneNumber && user.phoneNumber !== phoneNumber) {
    // Check for duplicate phone//case insensitive
    const duplicate = await User.findOne({ phoneNumber })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    // Allow only updates to the original user
    if (duplicate) {
      return res.status(409).json({
        message: "Account already exists with the new phone number",
      });
    }

    user.phoneNumber = phoneNumber;
  }
  //if email not null and diff from current
  if (email && user.email !== email) {
    // Check for duplicate email//case insensitive
    const duplicate = await User.findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    // Allow only updates to the original user
    if (duplicate) {
      return res.status(409).json({
        message: "Account already exists with the new email",
      });
    }

    user.email = email;
  }

  //save changes
  await user.save();

  return res.json({ message: "Account updated!" });
};

/**
 * @desc - Delete a user
 * @route - DELETE api/users
 * @access - Private
 *
 */

//NOT USED//DEEP RELATIONS WITH LISTINGS AND TOURS
export const deleteUser: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  // Does the user exist to delete?
  const user = await User.findById(_id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  await user.deleteOne();

  //delete profile//not all users have a profile
  const profile = await Profile.findOne({ user: user._id }).exec();

  if (profile) {
    deleteFiles([profile.profilePic]);

    await profile.deleteOne();
  }

  //clear refresh token cookie
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  //204 don't have a response body
  //res.status(204).json({ message: "Account deactivated" }); //on frontend, success = clear state and redirect to home
  res.json({ message: "Account deactivated" }); //on frontend, success = clear state and redirect to home
};
