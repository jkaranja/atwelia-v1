"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const viewSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    listing: { type: mongoose_1.Schema.Types.ObjectId, ref: "Listing" },
    count: Number,
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("View", viewSchema);
