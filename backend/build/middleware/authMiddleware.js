"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const user_1 = require("../types/user");
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization ||
        req.headers.Authorization;
    //retry only for expired tokens i.e has 'Bearer xxx' but token is expired
    //won't retry for 403 or any other status code
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Forbidden" });
    }
    //const [token, type] = req.headers.authorization.split(" ") ?? []
    const token = authHeader.split(" ")[1];
    //token exists but has expired//return 401 so req can be retried
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err)
            return res.status(401).json({ message: "Unauthorized" });
        const { _id, roles, accountStatus } = decoded.user;
        //user has a valid token but do they exist in db
        const user = await User_1.default.findById(_id).select("-password").lean().exec();
        //user exists and account not suspended/approved
        if (!user || user.accountStatus !== user_1.AccountStatus.Approved) {
            return res.status(403).json({
                message: "Forbidden. Please contact support",
            });
        }
        //add user to the req object
        req.user = user;
        next();
    });
};
exports.default = verifyJWT;
