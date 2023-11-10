"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionStatus = void 0;
const mongoose_1 = require("mongoose");
var CommissionStatus;
(function (CommissionStatus) {
    CommissionStatus["Pending"] = "Pending";
    CommissionStatus["Paid"] = "Paid";
})(CommissionStatus = exports.CommissionStatus || (exports.CommissionStatus = {}));
const commissionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    renter: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    tour: { type: mongoose_1.Schema.Types.ObjectId, ref: "Tour" },
    amount: { type: Number, default: 0 },
    listing: { type: mongoose_1.Schema.Types.ObjectId, ref: "Listing" },
    status: {
        type: String,
        enum: CommissionStatus,
        default: CommissionStatus.Pending,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Commission", commissionSchema);
