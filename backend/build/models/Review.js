"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    postedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    comment: String,
    rating: Number,
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Review", reviewSchema);
