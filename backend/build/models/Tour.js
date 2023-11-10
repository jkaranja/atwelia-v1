"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tour_1 = require("../types/tour");
const tourSchema = new mongoose_1.Schema({
    renter: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    agent: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    listing: { type: mongoose_1.Schema.Types.ObjectId, ref: "Listing" },
    tourDates: { type: [Date] },
    cancelledBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    comment: String,
    tourDate: Date,
    tourStatus: {
        type: String,
        enum: tour_1.TourStatus,
        default: tour_1.TourStatus.Unconfirmed,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Tour", tourSchema);
