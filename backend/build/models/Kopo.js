"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const kopoSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    eventId: { type: String },
    mpesaCode: { type: String },
    type: { type: String },
    phoneNumber: { type: String },
    status: { type: String },
    amount: { type: Number, default: 0 },
    initTime: { type: Date },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Kopo", kopoSchema);
