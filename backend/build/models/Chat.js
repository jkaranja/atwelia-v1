"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    latestMessage: { type: mongoose_1.Schema.Types.ObjectId, ref: "Message", },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Chat", chatSchema);
