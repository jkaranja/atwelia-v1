"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedListings = exports.getListing = void 0;
const Listing_1 = __importDefault(require("../models/Listing"));
const mongoose_1 = require("mongoose");
const listing_1 = require("../types/listing");
/**
 * @desc - Get listing
 * @route - GET/--> api/listings/view/:id
 * @access - Public
 */
const getListing = async (req, res) => {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        return res.status(400).json({ message: "Listing not found" });
    }
    const listing = await Listing_1.default.findOne({
        _id: id,
        listingStatus: { $ne: listing_1.ListingStatus.Removed },
    })
        .populate("user", "_id username phoneNumber")
        .lean();
    // If no listing
    if (!listing) {
        return res.status(400).json({ message: "Listing not found" });
    }
    res.json(listing);
};
exports.getListing = getListing;
/*-----------------------------------------------------------
 * FETCH RELATED LISTINGS
 ------------------------------------------------------------*/
/**
 * @desc - Get other user's listings
 * @route - GET/--> api/listings/related/:id
 * @access - Public
 */
const getRelatedListings = async (req, res) => {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        return res.status(400).json({ message: "No listings found" });
    }
    const listings = await Listing_1.default.find({
        user: id,
        listingStatus: { $ne: listing_1.ListingStatus.Removed },
    })
        .select("_id bedrooms location price updatedAt featuredImage")
        .limit(9) //max of 9 items
        .sort({ updatedAt: -1 })
        .lean();
    // If no listings
    if (!listings.length) {
        return res.status(400).json({ message: "No listings found" });
    }
    res.json(listings);
};
exports.getRelatedListings = getRelatedListings;
