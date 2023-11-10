"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.hashRandomToken = exports.genRandomToken = exports.setTokenAndCookie = exports.genRefreshToken = exports.genAccessToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//jwt tokens
//access token
const genAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({
        user,
    }, process.env.ACCESS_TOKEN_SECRET
    // { expiresIn: "7d" } //expiries in->2hr is standard//other options: 60, 15m, "2 days", "10h", "7d"
    //note: as a string without unit eg "120" is equal to "120ms", as a number, no unit: eg 120 = "120s"
    );
};
exports.genAccessToken = genAccessToken;
//RefreshToken
const genRefreshToken = (_id) => {
    return jsonwebtoken_1.default.sign({
        _id,
    }, process.env.REFRESH_TOKEN_SECRET
    // { expiresIn: "31d" } //expires in 31 days
    );
};
exports.genRefreshToken = genRefreshToken;
//return access token and set cookie headers
const setTokenAndCookie = (req, res) => {
    const { _id, roles, accountStatus } = req.user;
    //gen access token//web+mobile
    const accessToken = (0, exports.genAccessToken)({
        _id: _id,
        roles: roles,
        accountStatus: accountStatus,
    });
    //gen refresh token: web
    const refreshToken = (0, exports.genRefreshToken)(_id);
    // Create secure cookie with refresh token as value//for web
    const day = 24 * 60 * 60 * 1000;
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none", //'none' | boolean | 'strict' | 'lax' //cross-site cookie//allow//for csrf, it won't happen since all requests needs an access token too
        // maxAge: 31 * day, //31 days//cookie expiry set to match refreshToken
    });
    return accessToken;
};
exports.setTokenAndCookie = setTokenAndCookie;
//random tokens//for pwd recovery
//will give as 20 characters//hex is 16 numbers 0-9
const genRandomToken = () => {
    return crypto_1.default.randomBytes(10).toString("hex");
};
exports.genRandomToken = genRandomToken;
//hash token
const hashRandomToken = (token) => {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
};
exports.hashRandomToken = hashRandomToken;
//6 digit one time password(otp) or one-time PIN //randomNumber//or use the otp-generator package
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
