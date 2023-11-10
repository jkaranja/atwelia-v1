"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    profilePic: { type: Object },
    //location: Number,
    //reviews
    bio: String,
    tourFee: Number,
    phoneNumbers: [String],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Profile", profileSchema);
