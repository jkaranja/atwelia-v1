//to delete file
import { RequestHandler } from "express";
import Listing from "../models/Listing";
import cleanFiles from "../utils/cleanFiles";
import deleteFiles from "../utils/deleteFiles";
import { ListingStatus } from "../types/listing";

/**
 * @desc - List listing
 * @route - POST api/listings/new
 * @access - Private
 */
export const listNew: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const { files } = req; //will be [] if no files

  const listingImages = files?.length ? cleanFiles(files) : [];

  //get the rest
  const {
    location,
    bedrooms,
    bathrooms,
    price, //lease period->monthly->custom
    amenities,
    overview,
    listingStatus,
  } = req.body;

  try {
    //check if required fields are valid
    if (!listingStatus || !location || !price || !bedrooms) {
      throw new Error("Please fill required fields");
    }

    //then add listing
    const listing = await Listing.create({
      user: _id,
      location: JSON.parse(location),
      bedrooms,
      bathrooms,
      listingImages,
      featuredImage: listingImages[0],
      price, //lease period->monthly
      amenities: JSON.parse(amenities),
      listingStatus,
      overview,
    });

    if (!listing) {
      throw new Error("Something went wrong! Please try again.");
    }

    return res.status(200).json({
      message:
        listingStatus === ListingStatus.Draft
          ? "Draft saved"
          : "Listing posted!",
    });
  } catch (error: any) {
    //delete  files if err was thrown
    deleteFiles(listingImages);

    res.status(400).json({ message: error.message });
  }
};
