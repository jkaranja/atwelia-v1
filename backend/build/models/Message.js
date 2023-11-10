"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chat_1 = require("../types/chat");
const messageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose_1.Schema.Types.ObjectId, ref: "Chat" },
    content: { type: String },
    files: { type: [] },
    isRead: { type: Boolean, default: false },
    messageStatus: {
        type: String,
        enum: chat_1.MessageStatus,
        default: chat_1.MessageStatus.Available,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Message", messageSchema);
