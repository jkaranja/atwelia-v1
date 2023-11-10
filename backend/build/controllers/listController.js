"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNew = void 0;
const Listing_1 = __importDefault(require("../models/Listing"));
const cleanFiles_1 = __importDefault(require("../utils/cleanFiles"));
const deleteFiles_1 = __importDefault(require("../utils/deleteFiles"));
const listing_1 = require("../types/listing");
/**
 * @desc - List listing
 * @route - POST api/listings/new
 * @access - Private
 */
const listNew = async (req, res) => {
    const { _id } = req.user;
    const { files } = req; //will be [] if no files
    const listingImages = files?.length ? (0, cleanFiles_1.default)(files) : [];
    //get the rest
    const { location, bedrooms, bathrooms, price, //lease period->monthly->custom
    amenities, overview, listingStatus, } = req.body;
    try {
        //check if required fields are valid
        if (!listingStatus || !location || !price || !bedrooms) {
            throw new Error("Please fill required fields");
        }
        //then add listing
        const listing = await Listing_1.default.create({
            user: _id,
            location: JSON.parse(location),
            bedrooms,
            bathrooms,
            listingImages,
            featuredImage: listingImages[0],
            price,
            amenities: JSON.parse(amenities),
            listingStatus,
            overview,
        });
        if (!listing) {
            throw new Error("Something went wrong! Please try again.");
        }
        return res.status(200).json({
            message: listingStatus === listing_1.ListingStatus.Draft
                ? "Draft saved"
                : "Listing posted!",
        });
    }
    catch (error) {
        //delete  files if err was thrown
        (0, deleteFiles_1.default)(listingImages);
        res.status(400).json({ message: error.message });
    }
};
exports.listNew = listNew;
