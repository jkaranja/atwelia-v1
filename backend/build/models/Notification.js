"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushStatus = void 0;
const mongoose_1 = require("mongoose");
const tour_1 = require("../types/tour");
var PushStatus;
(function (PushStatus) {
    PushStatus["Pending"] = "Pending";
    PushStatus["Sent"] = "Sent";
})(PushStatus = exports.PushStatus || (exports.PushStatus = {}));
const notificationSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    pushToken: String,
    tours: [
        {
            title: String,
            tour: { type: mongoose_1.Schema.Types.ObjectId, ref: "Tour" },
            tourStatus: { type: String, enum: tour_1.TourStatus },
            pushStatus: {
                type: String,
                enum: PushStatus,
                default: PushStatus.Pending,
            },
            createdAt: { type: Date, default: mongoose_1.now },
        },
    ],
    inbox: [
        {
            title: String,
            chat: { type: mongoose_1.Schema.Types.ObjectId, ref: "Chat" },
            pushStatus: {
                type: String,
                enum: PushStatus,
                default: PushStatus.Pending,
            },
            createdAt: { type: Date, default: mongoose_1.now },
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Notification", notificationSchema);
