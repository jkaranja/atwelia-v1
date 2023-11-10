"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityType = void 0;
const mongoose_1 = require("mongoose");
var ActivityType;
(function (ActivityType) {
    ActivityType["Deposit"] = "Deposit";
    ActivityType["Withdraw"] = "Withdraw";
})(ActivityType = exports.ActivityType || (exports.ActivityType = {}));
const activitySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, default: 0 },
    activityType: { type: String, enum: ActivityType },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Activity", activitySchema);
