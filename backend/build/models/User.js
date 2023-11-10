"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_1 = require("../types/user");
const userSchema = new mongoose_1.Schema({
    email: { type: String },
    password: { type: String },
    username: { type: String },
    profile: { type: mongoose_1.Schema.Types.ObjectId, ref: "Profile" },
    phoneNumber: { type: String },
    roles: { type: [String], enum: user_1.Role, default: [user_1.Role.Renter] },
    accountStatus: {
        type: String,
        enum: user_1.AccountStatus,
        default: user_1.AccountStatus.Approved,
    },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpiresAt: { type: Number },
    // otp: { type: String },
    // otpExpiresAt: { type: Date },
}, { timestamps: true });
//type User = InferSchemaType<typeof userSchema>;
exports.default = (0, mongoose_1.model)("User", userSchema);
