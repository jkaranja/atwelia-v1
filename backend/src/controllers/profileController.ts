import User from "../models/User";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { removeImage, uploadPic } from "../utils/cloudnary";
import { RequestHandler } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { AccountStatus, Role } from "../types/user";
import {
  genAccessToken,
  genRandomToken,
  genRefreshToken,
  generateOTP,
  hashRandomToken,
} from "../utils/tokens";
import { addMinutes } from "date-fns";
import sendMessage from "../utils/sendMessage";
import cleanFiles from "../utils/cleanFiles";
import deleteFiles from "../utils/deleteFiles";
import Review from "../models/Review";
import Profile from "../models/Profile";

/*-----------------------------------------------------------
 * GET USER PROFILE
 ------------------------------------------------------------*/
/**
 * @desc - Get user
 * @route - GET api/users/profile/:id
 * @access - Public
 */
export const getProfile: RequestHandler = async (req, res) => {
  const { id } = req.params; //user ID

  //check if id is valid
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Profile not found" });
  }

  const user = await User.findById(id)
    .select("_id username phoneNumber createdAt")
    .lean()
    .exec();

  // If no user
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const profile = await Profile.findOne({ user: user._id }).lean();

  const reviews = await Review.find({ user: user._id })
    .populate({
      path: "postedBy",
      select: "_id username phoneNumber profile",
      populate: { path: "profile", select: "_id profilePic" },
    })
    .lean();

  if (!profile) {
    return res.json({
      user,
    });
  }

  return res.json({
    ...profile,
    user,
    reviewCount: reviews.length,
    rating:
      reviews.reduce((acc, value) => acc + value.rating, 0) / reviews.length,
    reviews: reviews.slice(0, 9), //Max of 9 reviews
  });
};

/*-----------------------------------------------------------
 * CREATE PROFILE
 ------------------------------------------------------------*/
/**
 * @desc - Update/Create profile
 * @route - PUT api/users/profile
 * @access - Private
 */
export const createProfile: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const { tourFee, bio } = req.body;

  const phoneNumbers = JSON.parse(req.body.phoneNumbers);

  const { file } = req;

  const profilePics = file ? cleanFiles([file]) : [];

  try {
    if (!tourFee || !bio || !phoneNumbers.length) {
      throw new Error("All fields are required");
    }

    const user = await User.findById(_id).exec();

    if (!user) {
      throw new Error("User not found");
    }

    const profile = await Profile.create({
      user: _id,
      profilePic: profilePics[0],
      tourFee,
      bio,
      phoneNumbers,
    });

    //insert profile into user: n-n relation + add agent role
    user.profile = profile._id;
    user.roles.push(Role.Agent); //add agent role

    await user.save();

    return res.json({ message: "Profile created!" });
  } catch (error: any) {
    //delete files if update failed
    deleteFiles(profilePics);

    res.status(400).json({ message: error.message });
  }
};

/*-----------------------------------------------------------
 * UPDATE PROFILE
 ------------------------------------------------------------*/
/**
 * @desc - Update profile
 * @route - PUT api/users/profile
 * @access - Private
 */
export const updateProfile: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const { tourFee, bio } = req.body;

  const phoneNumbers = JSON.parse(req.body.phoneNumbers);

  const { file } = req;

  const profilePics = file ? cleanFiles([file]) : [];

  try {
    if (!tourFee || !bio || !phoneNumbers.length) {
      throw new Error("All fields are required");
    }

    //does profile exist
    const profile = await Profile.findOne({ user: _id }).exec();

    if (!profile) {
      throw new Error("Profile doesn't not exist");
    }
    //if new profile image
    if (profilePics[0]) {
      //del prev profile pic if exist
      deleteFiles([profile.profilePic]);

      profile.profilePic = profilePics[0];
    }

    profile.tourFee = tourFee;
    profile.bio = bio;
    profile.phoneNumbers = phoneNumbers;

    await profile.save();

    return res.json({ message: "Profile updated!" });
  } catch (error: any) {
    //delete files if update failed
    deleteFiles(profilePics);

    res.status(400).json({ message: error.message });
  }
};
