import { RequestHandler } from "express";
import Listing from "../models/Listing";
import mongoose, { isValidObjectId } from "mongoose";
import Review from "../models/Review";
import { ListingStatus } from "../types/listing";

/**
 * @desc - Get listing
 * @route - GET/--> api/listings/view/:id
 * @access - Public
 */
export const getListing: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Listing not found" });
  }

  const listing = await Listing.findOne({
    _id: id,
    listingStatus: { $ne: ListingStatus.Removed },
  })
    .populate("user", "_id username phoneNumber")
    .lean();

  // If no listing
  if (!listing) {
    return res.status(400).json({ message: "Listing not found" });
  }

  res.json(listing);
};

/*-----------------------------------------------------------
 * FETCH RELATED LISTINGS
 ------------------------------------------------------------*/

/**
 * @desc - Get other user's listings
 * @route - GET/--> api/listings/related/:id
 * @access - Public
 */
export const getRelatedListings: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "No listings found" });
  }

  const listings = await Listing.find({
    user: id,
    listingStatus: { $ne: ListingStatus.Removed },
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
