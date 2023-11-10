"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.createProfile = exports.getProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = require("mongoose");
const user_1 = require("../types/user");
const cleanFiles_1 = __importDefault(require("../utils/cleanFiles"));
const deleteFiles_1 = __importDefault(require("../utils/deleteFiles"));
const Review_1 = __importDefault(require("../models/Review"));
const Profile_1 = __importDefault(require("../models/Profile"));
/*-----------------------------------------------------------
 * GET USER PROFILE
 ------------------------------------------------------------*/
/**
 * @desc - Get user
 * @route - GET api/users/profile/:id
 * @access - Public
 */
const getProfile = async (req, res) => {
    const { id } = req.params; //user ID
    //check if id is valid
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        return res.status(400).json({ message: "Profile not found" });
    }
    const user = await User_1.default.findById(id)
        .select("_id username phoneNumber createdAt")
        .lean()
        .exec();
    // If no user
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const profile = await Profile_1.default.findOne({ user: user._id }).lean();
    const reviews = await Review_1.default.find({ user: user._id })
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
        rating: reviews.reduce((acc, value) => acc + value.rating, 0) / reviews.length,
        reviews: reviews.slice(0, 9), //Max of 9 reviews
    });
};
exports.getProfile = getProfile;
/*-----------------------------------------------------------
 * CREATE PROFILE
 ------------------------------------------------------------*/
/**
 * @desc - Update/Create profile
 * @route - PUT api/users/profile
 * @access - Private
 */
const createProfile = async (req, res) => {
    const { _id } = req.user;
    const { tourFee, bio } = req.body;
    const phoneNumbers = JSON.parse(req.body.phoneNumbers);
    const { file } = req;
    const profilePics = file ? (0, cleanFiles_1.default)([file]) : [];
    try {
        if (!tourFee || !bio || !phoneNumbers.length) {
            throw new Error("All fields are required");
        }
        const user = await User_1.default.findById(_id).exec();
        if (!user) {
            throw new Error("User not found");
        }
        const profile = await Profile_1.default.create({
            user: _id,
            profilePic: profilePics[0],
            tourFee,
            bio,
            phoneNumbers,
        });
        //insert profile into user: n-n relation + add agent role
        user.profile = profile._id;
        user.roles.push(user_1.Role.Agent); //add agent role
        await user.save();
        return res.json({ message: "Profile created!" });
    }
    catch (error) {
        //delete files if update failed
        (0, deleteFiles_1.default)(profilePics);
        res.status(400).json({ message: error.message });
    }
};
exports.createProfile = createProfile;
/*-----------------------------------------------------------
 * UPDATE PROFILE
 ------------------------------------------------------------*/
/**
 * @desc - Update profile
 * @route - PUT api/users/profile
 * @access - Private
 */
const updateProfile = async (req, res) => {
    const { _id } = req.user;
    const { tourFee, bio } = req.body;
    const phoneNumbers = JSON.parse(req.body.phoneNumbers);
    const { file } = req;
    const profilePics = file ? (0, cleanFiles_1.default)([file]) : [];
    try {
        if (!tourFee || !bio || !phoneNumbers.length) {
            throw new Error("All fields are required");
        }
        //does profile exist
        const profile = await Profile_1.default.findOne({ user: _id }).exec();
        if (!profile) {
            throw new Error("Profile doesn't not exist");
        }
        //if new profile image
        if (profilePics[0]) {
            //del prev profile pic if exist
            (0, deleteFiles_1.default)([profile.profilePic]);
            profile.profilePic = profilePics[0];
        }
        profile.tourFee = tourFee;
        profile.bio = bio;
        profile.phoneNumbers = phoneNumbers;
        await profile.save();
        return res.json({ message: "Profile updated!" });
    }
    catch (error) {
        //delete files if update failed
        (0, deleteFiles_1.default)(profilePics);
        res.status(400).json({ message: error.message });
    }
};
exports.updateProfile = updateProfile;
