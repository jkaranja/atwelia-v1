"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteListing = exports.updateListing = exports.updateStatus = exports.getListings = void 0;
const Listing_1 = __importDefault(require("../models/Listing"));
const listing_1 = require("../types/listing");
const cleanFiles_1 = __importDefault(require("../utils/cleanFiles"));
const deleteFiles_1 = __importDefault(require("../utils/deleteFiles"));
const matchRegEx_1 = __importDefault(require("../utils/matchRegEx"));
/**
 * @desc - Get all listings
 * @route - GET api/listings/active
 * @access - Private
 */
const getListings = async (req, res) => {
    const { _id } = req.user;
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
            { user: _id },
            {
                listingStatus: filters.listingStatus,
            },
            { bedrooms: (0, matchRegEx_1.default)(filters.bedrooms) }, //like %_keyword%  & case insensitive//
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
    // //in case invalid page is sent or out of range page
    if (page > pages) {
        return res.status(400).json({ message: "No listings found" });
    }
    const result = await Listing_1.default.find(filter)
        .select("_id bedrooms location price updatedAt featuredImage")
        .skip(skip)
        .limit(size)
        .populate("user", "_id username phoneNumber")
        .sort({ updatedAt: -1 }) //desc//recent first
        .lean(); //return a pure js object//not mongoose document//don't convert result to mongoose document//about 5x smaller!//faster
    res.json({
        pages,
        total,
        listings: result,
    });
};
exports.getListings = getListings;
/*-----------------------------------------------------------
 * UPDATE LISTING STATUS
 ------------------------------------------------------------*/
/**
 * @desc - Update listing status
 * @route - Patch api/listings/:id
 * @access - Private
 */
const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { listingStatus } = req.body;
    //does listing exist
    const listing = await Listing_1.default.findById(id).exec();
    if (!listing) {
        return res.status(400).json({ message: "Listing not found" });
    }
    //update status
    listing.listingStatus = listingStatus;
    await listing.save();
    res.json({
        message: listingStatus === listing_1.ListingStatus.Unavailable
            ? "Listing marked as unavailable"
            : "Listing published",
    });
};
exports.updateStatus = updateStatus;
/*-----------------------------------------------------------
 * UPDATE LISTING
 ------------------------------------------------------------*/
/**
 * @desc - update listing info
 * @route - PUT api/listings/:id
 * @access - Private
 */
const updateListing = async (req, res) => {
    const { id } = req.params;
    const { files } = req; //will be [] if no files
    const newImages = files?.length ? (0, cleanFiles_1.default)(files) : [];
    const { location, bedrooms, bathrooms, price, //lease period->monthly
    amenities, overview, } = req.body;
    //parse modified uploaded files//names only
    const modifiedUploadedNames = JSON.parse(req.body.uploaded);
    //parse featured image//this can be already uploaded image or a new img(has 'name' instead of filename)
    const modifiedFeatured = JSON.parse(req.body.featured);
    try {
        if (!location || !price) {
            throw new Error("Please fill required fields");
        }
        //does listing exist
        const listing = await Listing_1.default.findById(id).exec();
        if (!listing) {
            throw new Error("Listing not found");
        }
        //filter out uploaded files to delete from original listing files
        const uploadedToRemove = listing.listingImages.filter((uploaded) => !modifiedUploadedNames.includes(uploaded.filename));
        //filter out uploaded files to keep//modifiedUploadedNames contains only names but has all the file names we should keep
        const uploadedToKeep = listing.listingImages.filter((uploaded) => modifiedUploadedNames.includes(uploaded.filename));
        //uploadedToKeep + new images
        const updatedImages = [...uploadedToKeep, ...newImages];
        //featured image could be inside uploadedToKeep or newImages = updatedImages
        //we will use it's name to
        const updateFeaturedImage = updatedImages.find((updated) => {
            //if one of the uploaded, modifiedFeatured.filename is not empty string and will be the same
            if (modifiedFeatured.filename) {
                return updated.filename === modifiedFeatured.filename;
            }
            //if a new img, modifiedFeatured.name is not empty string but it can have date appended to it when uploading(see multer)
            if (modifiedFeatured.name) {
                //can also check size + name to be sure you have the right match(can have 2 new files ending with same name)//not likely
                return updated.filename.endsWith(modifiedFeatured.name);
            }
        });
        listing.location = JSON.parse(location);
        listing.bedrooms = bedrooms;
        listing.bathrooms = bathrooms;
        listing.price = price;
        listing.amenities = JSON.parse(amenities);
        listing.overview = overview;
        //combine original files(minus removed) & the new files and update listing files field
        listing.listingImages = updatedImages;
        listing.featuredImage = updateFeaturedImage || updatedImages[0]; //in case something weird happened & no match for featured, use random
        //delete removed files
        (0, deleteFiles_1.default)(uploadedToRemove);
        await listing.save();
        return res.status(200).json({ message: "Listing updated" });
    }
    catch (error) {
        //delete instr files if update failed
        (0, deleteFiles_1.default)(newImages);
        res.status(400).json({ message: error.message });
    }
};
exports.updateListing = updateListing;
/*-----------------------------------------------------------
 * DELETE LISTING
 ------------------------------------------------------------*/
/**
 * @desc - Del listing
 * @route - DELETE api/listings/:id
 * @access - Private
 */
const deleteListing = async (req, res, next) => {
    const { id } = req.params;
    //does listing exist
    const listing = await Listing_1.default.findById(id).exec();
    if (!listing) {
        return res.status(400).json({ message: "Listing not found" });
    }
    //del
    //await listing.remove();
    //DON'T DELETE//listings/tours where listing is will return undefined when populating listing field//
    //so there will be eg favorites with no corresponding listing-> error on frontend if no optional chaining
    //eg. tour.listing.bedrooms=> type error
    //only update status
    listing.listingStatus = listing_1.ListingStatus.Removed;
    await listing.save();
    //delete listing files
    (0, deleteFiles_1.default)(listing.listingImages);
    res.json({ message: "Listing deleted" });
};
exports.deleteListing = deleteListing;
