"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllListings = void 0;
const Listing_1 = __importDefault(require("../models/Listing"));
const matchRegEx_1 = __importDefault(require("../utils/matchRegEx"));
const matchCond_1 = __importDefault(require("../utils/matchCond"));
const listing_1 = require("../types/listing");
/**
 * @desc - Get all listings
 * @route - GET api/listings
 * @access - Public
 */
const getAllListings = async (req, res) => {
    /**----------------------------------
           * PAGINATION
    ------------------------------------*/
    //query string payload
    const page = parseInt(req.query.page) || 1; //current page no. / sent as string convert to number//page not sent use 1
    const size = parseInt(req.query.size) || 10; //items per page//if not sent from FE/ use default 15
    const filters = JSON.parse(req.query.filters);
    const skip = (page - 1) * size; //eg page = 5, it has already displayed 4 * 10//so skip prev items
    //filter
    const filter = {
        $and: [
            {
                listingStatus: listing_1.ListingStatus.Available, //only available listings should be live
            },
            { bedrooms: (0, matchRegEx_1.default)(filters.bedrooms) },
            {
                bathrooms: (0, matchRegEx_1.default)(filters.bathrooms),
            },
            {
                "location.description": (0, matchRegEx_1.default)(filters.location?.description),
            },
            {
                price: {
                    $gte: parseInt(filters.priceRange?.[0]) || 100,
                    $lte: parseInt(filters.priceRange?.[1]) || 1e6,
                },
            },
            {
                "amenities.water": (0, matchCond_1.default)(filters.amenities?.water),
            },
            {
                "amenities.parking": (0, matchCond_1.default)(filters.amenities?.parking),
            },
            {
                "amenities.wifi": (0, matchCond_1.default)(filters.amenities?.wifi),
            },
            {
                "amenities.gym": (0, matchCond_1.default)(filters.amenities?.gym),
            },
            {
                "amenities.pool": (0, matchCond_1.default)(filters.amenities?.pool),
            },
            {
                "amenities.borehole": (0, matchCond_1.default)(filters.amenities?.borehole),
            },
            {
                "amenities.watchman": (0, matchCond_1.default)(filters.amenities?.watchman),
            },
            {
                "amenities.cctv": (0, matchCond_1.default)(filters.amenities?.cctv),
            },
            {
                "amenities.securityLights": (0, matchCond_1.default)(filters.amenities?.securityLights),
            },
            //   {
            //     updatedAt: {
            //       $gte: startDate,
            //       $lte: endDate,
            //     },
            //   },
        ],
    };
    const total = await Listing_1.default.find(filter).count(); //or Listing.countDocument() ///total docs
    //if total = 0 //error
    if (!total) {
        return res.status(400).json({ message: "No listings found" });
    }
    const pages = Math.ceil(total / size);
    // //in case invalid page is sent//out of range//not from the pages sent
    if (page > pages) {
        return res.status(400).json({ message: "No listings found" });
    }
    const result = await Listing_1.default.find(filter)
        .select("_id bedrooms location price updatedAt featuredImage")
        .skip(skip)
        .limit(size)
        .populate("user", "_id username profilePic")
        .sort({ updatedAt: -1 }) //desc//recent first
        .lean(); //return a pure js object//not mongoose document//don't convert result to mongoose document//about 5x smaller!//faster
    res.json({
        pages,
        total,
        listings: result,
    });
};
exports.getAllListings = getAllListings;
