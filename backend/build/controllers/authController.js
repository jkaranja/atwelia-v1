"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.resetPassword = exports.forgotPassword = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const tokens_1 = require("../utils/tokens");
/**
 * @desc - Login
 * @route - POST /auth
 * @access - Public
 */
const login = async (req, res) => {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
        return res.status(403).json({ message: "All fields are required" });
    }
    const user = await User_1.default.findOne({ phoneNumber }).exec();
    if (!user) {
        return res.status(400).json({ message: "Wrong credentials" });
    }
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match)
        return res.status(400).json({ message: "Wrong credentials" });
    req.user = user;
    const accessToken = (0, tokens_1.setTokenAndCookie)(req, res);
    return res.json({ accessToken });
};
exports.login = login;
/*--------------------------------------------------------
 * FORGOT PASSWORD
 ---------------------------------------------------------*/
/**
 * @desc - forgot password
 * @route - PATCH api/auth/forgot
 * @access - Public
 */
const forgotPassword = async (req, res) => {
    const { email, phoneNumber } = req.body;
    if (!email || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User_1.default.findOne({ phoneNumber }).exec();
    if (!user) {
        return res.status(400).json({ message: "Email could not be sent" });
    }
    //will give as 20 characters//will send this token to email
    const resetToken = (0, tokens_1.genRandomToken)();
    //hash token to store in db
    const resetPasswordToken = (0, tokens_1.hashRandomToken)(resetToken);
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; //expire in 24 hrs
    //send email//
    const emailOptions = {
        subject: "Reset your password",
        to: email,
        body: `
                <p>Hi ${user.username}, </p>
                <p>A request to reset your password has been made. If you did not make this request, ignore this email. If you did make the request, please click the button below to reset your password:</p>
                <a href ='${process.env.RESET_PWD_URL}/${resetToken}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 15px 0px; padding: 5px 15px; text-transform: capitalize; border-color: #3498db;'>Reset password
                </a>  
                <p><small>This link will expire in 24 hours</small> </p>              
                `,
    };
    //don't wait
    (0, sendEmail_1.default)(emailOptions);
    await user.save();
    res
        .status(200)
        .json({ message: "We've sent a password recovery link to your email" });
};
exports.forgotPassword = forgotPassword;
/*--------------------------------------------------------
 * RESET PASSWORD
 ---------------------------------------------------------*/
/**
 * @desc - Reset
 * @route - PATCH /auth/reset/:resetToken
 * @access - Public
 */
const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;
    if (!password) {
        return res.status(400).json({ message: "Password required" });
    }
    const token = (0, tokens_1.hashRandomToken)(resetToken);
    const user = await User_1.default.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpiresAt: { $gte: Date.now() },
    });
    if (!user) {
        return res.status(400).json({ message: "Password could not be reset" });
    }
    user.resetPasswordToken = null;
    user.password = await bcrypt_1.default.hash(password, 10);
    await user.save();
    return res.json({
        message: "Password reset successfully. Please log in",
    });
};
exports.resetPassword = resetPassword;
/*--------------------------------------------------------
 * REFRESH TOKEN//GET NEW ACCESS TOKEN
 ---------------------------------------------------------*/
/**
 * @desc - Refresh
 * @route - GET /auth/refresh
 * @access - Public
 */
const refresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.status(403).json({ message: "Forbidden" });
    const refreshToken = cookies.jwt; //cookies.jwt is of any type//must be converted to string for err & decoded types to be inferred
    //else you must pass type: err: VerifyErrors | null,  decoded: JwtPayload | string | undefined
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err)
            return res.status(403).json({ message: "Forbidden" });
        const { _id } = decoded;
        const foundUser = await User_1.default.findById(_id).exec();
        if (!foundUser)
            return res.status(403).json({ message: "Forbidden" });
        const accessToken = (0, tokens_1.genAccessToken)({
            _id: foundUser._id,
            roles: foundUser.roles,
            accountStatus: foundUser.accountStatus,
        });
        res.json({ accessToken });
    });
};
exports.refresh = refresh;
/*--------------------------------------------------------
 * LOGOUT//CLEAR REFRESH TOKEN COOKIE
 ---------------------------------------------------------*/
/**
 * @desc - Logout
 * @route - POST api/auth/logout
 * @access - Public
 *
 */
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        //return res.sendStatus(204); //No content// sendStatus is same as res.status(204).send('No content')
        //204 don't have response body
        ////sendStatus sets res http status code and sends the status code string representation as res body
        //still send success if jwt has already cleared or has expired
        return res.status(200).json({ message: "Logged out" });
    }
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.json({ message: "Logged out" });
};
exports.logout = logout;
