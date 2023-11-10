"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const walletSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    balance: { type: Number, default: 0 },
    expiresAt: { type: Date, default: Date.now() + 1 * 8.64e7 }, //expires in 24hrs
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Wallet", walletSchema);
