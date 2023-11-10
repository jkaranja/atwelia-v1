import { Request, RequestHandler, Response } from "express";
import Listing from "../models/Listing";

import Commission from "../models/Commission";
import Notification from "../models/Notification";
import Review from "../models/Review";
import Tour from "../models/Tour";
import { TourStatus } from "../types/tour";
import { IListing } from "../types/listing";

//fetch all in review

interface SearchQuery {
  page: string;
  size: string;
  filters: string;
}

/*-----------------------------------------------------------
 * GET RENTER TOURS
 ------------------------------------------------------------*/
/**
 * @desc - Get all tours
 * @route - GET api/tours/renters
 * @access - Private
 */
export const getRenterTours: RequestHandler<
  unknown,
  unknown,
  unknown,
  SearchQuery
> = async (req, res) => {
  const { _id } = req.user!;

  /**----------------------------------
         * PAGINATION
  ------------------------------------*/
  //query string payload
  const page = parseInt(req.query.page) || 1; //current page no. / sent as string convert to number//page not sent use 1
  const size = parseInt(req.query.size) || 10; //items per page//if not sent from FE/ use default 15
  const skip = (page - 1) * size; //eg page = 5, it has already displayed 4 * 10//so skip prev items
  const filters = JSON.parse(req.query.filters);

  //filter
  const filter = {
    $and: [{ renter: _id }, { tourStatus: filters.status }],
  };

  const total = await Tour.find(filter).count(); //or Tour.countDocument() ///total docs
  //if total = 0 //error
  if (!total) {
    return res.status(400).json({ message: "No tours found" });
  }

  const pages = Math.ceil(total / size);

  // //in case invalid page is sent//out of range//not from the pages sent
  if (page > pages) {
    return res.status(400).json({ message: "No tours found" });
  }

  const result = await Tour.find(filter)
    .skip(skip)
    .limit(size)
    .populate({
      path: "listing",
      select: "_id bedrooms",
    })
    .populate({
      path: "agent",
      select: "_id username phoneNumber profile",
      populate: { path: "profile", select: "_id profilePic tourFee" },
    }) //agent
    .populate({
      path: "renter",
      select: "_id username phoneNumber profile",
      populate: { path: "profile", select: "_id profilePic" },
    }) //renter
    .sort({ updatedAt: -1 }) //desc//recent first
    .lean(); //return a pure js object//not mongoose document//don't convert result to mongoose document//about 5x smaller!//faster

  res.json({
    pages,
    total,
    tours: result,
  });
};

/*-----------------------------------------------------------
 * GET AGENT TOURS
 ------------------------------------------------------------*/
/**
 * @desc - Get all tours
 * @route - GET api/tours/agents
 * @access - Private
 */
export const getAgentTours: RequestHandler<
  unknown,
  unknown,
  unknown,
  SearchQuery
> = async (req, res) => {
  const { _id } = req.user!;

  /**----------------------------------
         * PAGINATION
  ------------------------------------*/
  //query string payload
  const page = parseInt(req.query.page) || 1; //current page no. / sent as string convert to number//page not sent use 1
  const size = parseInt(req.query.size) || 10; //items per page//if not sent from FE/ use default 15
  const skip = (page - 1) * size; //eg page = 5, it has already displayed 4 * 10//so skip prev items
  const filters = JSON.parse(req.query.filters);

  //filter
  const filter = {
    $and: [{ agent: _id }, { tourStatus: filters.status }],
  };

  const total = await Tour.find(filter).count(); //or Tour.countDocument() ///total docs
  //if total = 0 //error
  if (!total) {
    return res.status(400).json({ message: "No tours found" });
  }

  const pages = Math.ceil(total / size);

  // //in case invalid page is sent//out of range//not from the pages sent
  if (page > pages) {
    return res.status(400).json({ message: "No tours found" });
  }

  const result = await Tour.find(filter)
    .skip(skip)
    .limit(size)
    .populate({
      path: "listing",
      select: "_id bedrooms",
    })
    .populate({
      path: "agent",
      select: "_id username phoneNumber profile",
      populate: { path: "profile", select: "_id profilePic tourFee" },
    }) //agent
    .populate({
      path: "renter",
      select: "_id username phoneNumber profile",
      populate: { path: "profile", select: "_id profilePic" },
    }) //renter
    .sort({ updatedAt: -1 }) //desc//recent first
    .lean(); //return a pure js object//not mongoose document//don't convert result to mongoose document//about 5x smaller!//faster

  res.json({
    pages,
    total,
    tours: result,
  });
};

/*-----------------------------------------------------------
 * RENTER REQUESTS A TOUR
 ------------------------------------------------------------*/
/**
 * @desc - Request a tour->made by renter
 * @route - Patch api/tours
 * @access - Private
 */
export const requestTour = async (req: Request, res: Response) => {
  const { _id } = req.user!;

  const { tourDates, listing } = req.body;

  if (!tourDates.length || !listing) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //listing is valid
  const currentListing = await Listing.findById(listing).lean().exec();

  if (!currentListing) {
    return res.status(400).json({ message: "Listing not found" });
  }
  //check duplicate requests
  const duplicate = await Tour.findOne({
    renter: _id, //same user
    listing, //for same listing
    tourStatus: TourStatus.Unconfirmed, //and req is unconfirmed
  }).exec();

  if (duplicate) {
    return res.status(409).json({
      message: "Tour request already sent",
    });
  }

  //user can't send themselves tour req
  if (String(currentListing.user) === String(_id)) {
    return res
      .status(400)
      .json({ message: "Forbidden! Sending request to yourself" });
  }

  const tour = await Tour.create({
    renter: _id,
    agent: currentListing.user,
    listing,
    tourDates,
  });

  //push tour request notification
  await Notification.findOneAndUpdate(
    { user: currentListing.user }, //agent
    {
      $push: {
        tours: {
          title: "New tour request",
          tour: tour._id,
          tourStatus: TourStatus.Unconfirmed,
        },
      },
    },
    {
      new: true, //return new/modified document doc
      upsert: true, // Makes this update into an upsert
    }
  );

  res.json({ message: "Request sent" });
};

/*-----------------------------------------------------------
 * CONFIRM TOUR/BOTH
 ------------------------------------------------------------*/
/**
 * @desc - Confirm tour
 * @route - Patch api/tours/:id
 * @access - Private
 */
export const confirmTour: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const { tourDate } = req.body;

  //does tour exist
  const tour = await Tour.findOne({
    $and: [
      { _id: id },
      {
        $or: [
          { tourStatus: TourStatus.Unconfirmed },
          { tourStatus: TourStatus.Rescheduled },
        ],
      },
    ],
  })
    .populate({
      path: "renter",
      select: "_id ",
    })
    .exec();

  if (!tour) {
    return res.status(400).json({ message: "Tour not found" });
  }

  //update status
  tour.tourStatus = TourStatus.Upcoming;
  tour.tourDate = tourDate;

  await tour.save();

  //push tour request notification
  await Notification.findOneAndUpdate(
    { user: tour.renter._id }, //renter
    {
      $push: {
        tours: {
          title: "Tour request confirmed",
          tour: tour._id,
          tourStatus: TourStatus.Upcoming,
        },
      },
    },
    {
      new: true, //return new/modified document doc
      upsert: true, // Makes this update into an upsert
    }
  );

  res.json({ message: "Tour confirmed!" });
};

/*-----------------------------------------------------------
 * RESCHEDULE TOUR
 ------------------------------------------------------------*/
/**
 * @desc - Confirm tour
 * @route - Patch api/tours/reschedule/:id
 * @access - Private
 */
export const rescheduleTour: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const { tourDates } = req.body;

  //does tour exist
  const tour = await Tour.findOne({
    $and: [
      { _id: id },
      {
        $or: [{ tourStatus: TourStatus.Upcoming }],
      },
    ],
  })
    .populate({
      path: "agent",
      select: "_id ",
    })
    .exec();

  if (!tour) {
    return res.status(400).json({ message: "Tour not found" });
  }

  //update status
  tour.tourStatus = TourStatus.Rescheduled;
  tour.tourDates = tourDates;
  await tour.save();

  //push tour request notification
  await Notification.findOneAndUpdate(
    { user: tour.agent._id }, //agent
    {
      $push: {
        tours: {
          title: "Tour rescheduled",
          tour: tour._id,
          tourStatus: TourStatus.Rescheduled,
        },
      },
    },
    {
      new: true, //return new/modified document doc
      upsert: true, // Makes this update into an upsert
    }
  );

  res.json({ message: "Tour rescheduled!" });
};

/*-----------------------------------------------------------
 * DECLINE TOUR
 ------------------------------------------------------------*/
/**
 * @desc - Decline tour
 * @route - Patch api/tours/:id
 * @access - Private
 */
export const declineTour: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //does tour exist
  const tour = await Tour.findOne({
    $and: [
      { _id: id },
      {
        $or: [{ tourStatus: TourStatus.Unconfirmed }],
      },
    ],
  }).exec();

  if (!tour) {
    return res.status(400).json({ message: "Tour not found" });
  }

  //update status
  tour.tourStatus = TourStatus.Declined;
  tour.comment = comment;

  await tour.save();

  res.json({ message: "Tour declined!" });
};

/*-----------------------------------------------------------
 * CANCEL TOUR
 ------------------------------------------------------------*/
/**
 * @desc - Cancel tour
 * @route - Patch api/tours/cancel/:id
 * @access - Private
 */
export const cancelTour: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const { id } = req.params;

  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //does tour exist
  const tour = await Tour.findOne({
    $and: [
      { _id: id },
      {
        tourStatus: { $ne: TourStatus.Cancelled },
      },
    ],
  }).exec();

  if (!tour) {
    return res.status(400).json({ message: "Tour not found" });
  }

  //update status
  tour.tourStatus = TourStatus.Cancelled;
  tour.comment = comment;
  tour.cancelledBy = _id;

  await tour.save();

  res.json({ message: "Tour cancelled!" });
};

/*-----------------------------------------------------------
 * END TOUR/Both
 ------------------------------------------------------------*/
/**
 * @desc - End tour
 * @route - Patch api/tours/end/:id
 * @access - Private
 */
export const endTour: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const { id } = req.params;

  const { rating, comment } = req.body;

  //does tour exist
  const tour = await Tour.findOne({
    $and: [
      { _id: id },
      {
        $or: [{ tourStatus: TourStatus.Upcoming }],
      },
    ],
  })
    .populate({
      path: "agent",
      select: "_id ",
    })
    .populate({
      path: "renter",
      select: "_id ",
    })
    .populate({
      path: "listing",
      select: "_id bedrooms location",
    })
    .exec();

  if (!tour) {
    return res.status(400).json({ message: "Tour not found" });
  }

  //update status
  tour.tourStatus = TourStatus.Completed;
  await tour.save();

  //insert commission
  await Commission.create({
    user: tour.agent._id,
    renter: tour.renter._id,
    tour: id,
    amount: 100,
    listing: tour.listing._id,
  });

  //if rating is true, insert review
  if (rating) {
    //create a review
    const review = new Review({
      postedBy: tour.renter._id,//must be renter
      user: tour.agent._id,
      comment,
      rating,
    });
    await review.save();
  }

  res.json({ message: "Tour ended!" });
};

/*-----------------------------------------------------------
 * REMOVE FROM TOUR
 ------------------------------------------------------------*/
/**
 * @desc - Add to Tour
 * @route - Patch api/listings/tour/remove/:id
 * @access - Private
 */
export const removeTour: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const { id } = req.params;

  //does tour exist
  const tour = await Tour.findOne({ user: _id, listing: id }).exec();

  if (!tour) {
    return res.status(400).json({ message: "Tour not found" });
  }

  tour.tourStatus = TourStatus.Removed;

  await tour.save();
  //del//don't delete//populating tour id will return null. If no optional chaining used-> type error
 // await tour.remove();

  res.json({ message: "Removed from tour" });
};
