"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavorite = exports.addFavorite = exports.getFavorites = void 0;
const Favorite_1 = __importDefault(require("../models/Favorite"));
const tokens_1 = require("../utils/tokens");
/**
 * @desc - Get all listings
 * @route - GET api/listings/favorites
 * @access - Private
 */
const getFavorites = async (req, res) => {
    const { _id } = req.user;
    /**----------------------------------
           * PAGINATION
    ------------------------------------*/
    //query string payload
    const page = parseInt(req.query.page) || 1; //current page no. / sent as string convert to number//page not sent use 1
    const size = parseInt(req.query.size) || 10; //items per page//if not sent from FE/ use default 15
    const skip = (page - 1) * size; //eg page = 5, it has already displayed 4 * 10//so skip prev items
    //filter
    const filter = {
        $and: [{ user: _id }],
    };
    const total = await Favorite_1.default.find(filter).count(); //or Listing.countDocument() ///total docs
    //if total = 0 //error
    if (!total) {
        return res.status(400).json({ message: "No listings found" });
    }
    const pages = Math.ceil(total / size);
    // //in case invalid page is sent//out of range//not from the pages sent
    if (page > pages) {
        return res.status(400).json({ message: "No listings found" });
    }
    const result = await Favorite_1.default.find(filter)
        .skip(skip)
        .limit(size)
        .populate("listing", "_id bedrooms price updatedAt location featuredImage ")
        .sort({ updatedAt: -1 }) //desc//recent first
        .lean(); //return a pure js object//not mongoose document//don't convert result to mongoose document//about 5x smaller!//faster
    res.json({
        pages,
        total,
        favorites: result,
    });
};
exports.getFavorites = getFavorites;
/*-----------------------------------------------------------
 * ADD TO FAVORITES
 ------------------------------------------------------------*/
/**
 * @desc - Add to Favorites
 * @route - Patch api/listings/favorites/add/:id
 * @access - Private
 */
const addFavorite = async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params;
    //does listing exist
    const favorite = new Favorite_1.default({ user: _id, listing: id });
    await favorite.save();
    const accessToken = (0, tokens_1.setTokenAndCookie)(req, res);
    res.json({ accessToken });
};
exports.addFavorite = addFavorite;
/*-----------------------------------------------------------
 * REMOVE FROM FAVORITES
 ------------------------------------------------------------*/
/**
 * @desc - Add to Favorite
 * @route - Patch api/listings/favorites/remove/:id
 * @access - Private
 */
const removeFavorite = async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params; //favorite id
    //does favorite exist
    const favorite = await Favorite_1.default.findById(id).exec();
    if (!favorite) {
        return res.status(400).json({ message: "Favorite not found" });
    }
    //del
    await favorite.remove();
    res.json({ message: "Removed from favorites" });
};
exports.removeFavorite = removeFavorite;
