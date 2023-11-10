"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.registerUser = exports.getUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const tokens_1 = require("../utils/tokens");
const deleteFiles_1 = __importDefault(require("../utils/deleteFiles"));
const Profile_1 = __importDefault(require("../models/Profile"));
/*-----------------------------------------------------------
 * GET USER
 ------------------------------------------------------------*/
/**
 * @desc - Get user
 * @route - GET api/users
 * @access - Private
 *
 */
const getUser = async (req, res) => {
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
exports.getUser = getUser;
/**
 * @desc - Create new user
 * @route - POST /api/users/register
 * @access - Public
 *
 */
const registerUser = async (req, res) => {
    const { phoneNumber, password, username } = req.body;
    // Confirm data
    if (!phoneNumber || !password || !username) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Check for duplicate phone number
    //collation strength 2 makes value case insensitive i.e it should
    //match both lowercase and uppercase to ensure no same eg email is added in diff cases
    const duplicate = await User_1.default.findOne({ phoneNumber })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    if (duplicate) {
        return res.status(409).json({
            message: "You already have an account. Please log in",
        });
    }
    // Hash password
    const hashedPwd = await bcrypt_1.default.hash(password, 10); // salt rounds
    //new user
    const newUser = new User_1.default({
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
    const accessToken = (0, tokens_1.setTokenAndCookie)(req, res);
    return res.json({ accessToken });
};
exports.registerUser = registerUser;
/*-----------------------------------------------------------
 * UPDATE/PATCH
 ------------------------------------------------------------*/
/**
 * @desc - Update user
 * @route - PATCH api/users
 * @access - Private
 */
const updateUser = async (req, res) => {
    const { _id } = req.user;
    const { username, email, phoneNumber, password, newPassword } = req.body;
    if (!password) {
        return res.status(400).json({ message: "Current password required" });
    }
    const user = await User_1.default.findById(_id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match)
        return res.status(400).json({ message: "Wrong password" });
    // update user
    if (username)
        user.username = username;
    if (newPassword)
        user.password = await bcrypt_1.default.hash(newPassword, 10);
    //if phoneNumber not null and is diff phone number
    if (phoneNumber && user.phoneNumber !== phoneNumber) {
        // Check for duplicate phone//case insensitive
        const duplicate = await User_1.default.findOne({ phoneNumber })
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
        const duplicate = await User_1.default.findOne({ email })
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
exports.updateUser = updateUser;
/**
 * @desc - Delete a user
 * @route - DELETE api/users
 * @access - Private
 *
 */
//NOT USED//DEEP RELATIONS WITH LISTINGS AND TOURS
const deleteUser = async (req, res) => {
    const { _id } = req.user;
    // Does the user exist to delete?
    const user = await User_1.default.findById(_id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    await user.deleteOne();
    //delete profile//not all users have a profile
    const profile = await Profile_1.default.findOne({ user: user._id }).exec();
    if (profile) {
        (0, deleteFiles_1.default)([profile.profilePic]);
        await profile.deleteOne();
    }
    //clear refresh token cookie
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    //204 don't have a response body
    //res.status(204).json({ message: "Account deactivated" }); //on frontend, success = clear state and redirect to home
    res.json({ message: "Account deactivated" }); //on frontend, success = clear state and redirect to home
};
exports.deleteUser = deleteUser;
