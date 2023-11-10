"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Commission_1 = __importDefault(require("../models/Commission"));
/**
 * @desc - Payment guard -> if commissions unpaid balance >= 2000, decline req
 * @route - Tours + Listings
 * @access - Private
 */
const paymentGuard = async (req, res, next) => {
    const { _id } = req.user;
    const commissions = await Commission_1.default.find({ user: _id }).lean().exec();
    const balance = commissions.reduce((acc, current) => {
        return acc + current.amount;
    }, 0);
    if (balance >= 2000) {
        return res
            .status(403)
            .json({ message: "Forbidden. Please  clear outstanding balance" });
    }
    next();
};
exports.default = paymentGuard;
