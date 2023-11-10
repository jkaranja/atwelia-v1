import { RequestHandler } from "express";
import Listing from "../models/Listing";

import { endOfDay, startOfDay } from "date-fns";
import matchRegEx from "../utils/matchRegEx";
import matchCond from "../utils/matchCond";
import { ListingStatus } from "../types/listing";

//fetch all in review

interface SearchQuery {
  page: string;
  size: string;
  filters: string;
}

/**
 * @desc - Get all listings
 * @route - GET api/listings
 * @access - Public
 */
export const getAllListings: RequestHandler<
  unknown,
  unknown,
  unknown,
  SearchQuery
> = async (req, res) => {
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
        listingStatus: ListingStatus.Available, //only available listings should be live
      },

      { bedrooms: matchRegEx(filters.bedrooms) }, //like %_keyword%  & case insensitive//
      {
        bathrooms: matchRegEx(filters.bathrooms),
      },

      {
        "location.description": matchRegEx(filters.location?.description),
      },

      {
        price: {
          $gte: parseInt(filters.priceRange?.[0]) || 100,
          $lte: parseInt(filters.priceRange?.[1]) || 1e6,
        },
      },

      {
        "amenities.water": matchCond(filters.amenities?.water),
      },

      {
        "amenities.parking": matchCond(filters.amenities?.parking),
      },
      {
        "amenities.wifi": matchCond(filters.amenities?.wifi),
      },
      {
        "amenities.gym": matchCond(filters.amenities?.gym),
      },
      {
        "amenities.pool": matchCond(filters.amenities?.pool),
      },
      {
        "amenities.borehole": matchCond(filters.amenities?.borehole),
      },
      {
        "amenities.watchman": matchCond(filters.amenities?.watchman),
      },
      {
        "amenities.cctv": matchCond(filters.amenities?.cctv),
      },
      {
        "amenities.securityLights": matchCond(
          filters.amenities?.securityLights
        ),
      },

      //   {
      //     updatedAt: {
      //       $gte: startDate,
      //       $lte: endDate,
      //     },
      //   },
    ],
  };

  const total = await Listing.find(filter).count(); //or Listing.countDocument() ///total docs
  //if total = 0 //error
  if (!total) {
    return res.status(400).json({ message: "No listings found" });
  }

  const pages = Math.ceil(total / size);

  // //in case invalid page is sent//out of range//not from the pages sent
  if (page > pages) {
    return res.status(400).json({ message: "No listings found" });
  }

  const result = await Listing.find(filter)
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
