"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const optionalJWT = (req, res, next) => {
    const authHeader = req.headers.authorization ||
        req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return next();
    }
    //const [token, type] = req.headers.authorization.split(" ") ?? []
    const token = authHeader.split(" ")[1];
    //token exists but has expired//return 401 so req can be retried
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err)
            return next();
        const { _id, roles, accountStatus } = decoded.user;
        //user has a valid token but do they exist in db
        const user = await User_1.default.findById(_id).select("-password").lean().exec();
        if (!user) {
            return next();
        }
        //add user to the req object
        req.user = user;
        next();
    });
};
exports.default = optionalJWT;
