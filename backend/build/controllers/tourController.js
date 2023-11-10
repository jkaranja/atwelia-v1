"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTour = exports.endTour = exports.cancelTour = exports.declineTour = exports.rescheduleTour = exports.confirmTour = exports.requestTour = exports.getAgentTours = exports.getRenterTours = void 0;
const Listing_1 = __importDefault(require("../models/Listing"));
const Commission_1 = __importDefault(require("../models/Commission"));
const Notification_1 = __importDefault(require("../models/Notification"));
const Review_1 = __importDefault(require("../models/Review"));
const Tour_1 = __importDefault(require("../models/Tour"));
const tour_1 = require("../types/tour");
/*-----------------------------------------------------------
 * GET RENTER TOURS
 ------------------------------------------------------------*/
/**
 * @desc - Get all tours
 * @route - GET api/tours/renters
 * @access - Private
 */
const getRenterTours = async (req, res) => {
    const { _id } = req.user;
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
    const total = await Tour_1.default.find(filter).count(); //or Tour.countDocument() ///total docs
    //if total = 0 //error
    if (!total) {
        return res.status(400).json({ message: "No tours found" });
    }
    const pages = Math.ceil(total / size);
    // //in case invalid page is sent//out of range//not from the pages sent
    if (page > pages) {
        return res.status(400).json({ message: "No tours found" });
    }
    const result = await Tour_1.default.find(filter)
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
exports.getRenterTours = getRenterTours;
/*-----------------------------------------------------------
 * GET AGENT TOURS
 ------------------------------------------------------------*/
/**
 * @desc - Get all tours
 * @route - GET api/tours/agents
 * @access - Private
 */
const getAgentTours = async (req, res) => {
    const { _id } = req.user;
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
    const total = await Tour_1.default.find(filter).count(); //or Tour.countDocument() ///total docs
    //if total = 0 //error
    if (!total) {
        return res.status(400).json({ message: "No tours found" });
    }
    const pages = Math.ceil(total / size);
    // //in case invalid page is sent//out of range//not from the pages sent
    if (page > pages) {
        return res.status(400).json({ message: "No tours found" });
    }
    const result = await Tour_1.default.find(filter)
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
exports.getAgentTours = getAgentTours;
/*-----------------------------------------------------------
 * RENTER REQUESTS A TOUR
 ------------------------------------------------------------*/
/**
 * @desc - Request a tour->made by renter
 * @route - Patch api/tours
 * @access - Private
 */
const requestTour = async (req, res) => {
    const { _id } = req.user;
    const { tourDates, listing } = req.body;
    if (!tourDates.length || !listing) {
        return res.status(400).json({ message: "All fields are required" });
    }
    //listing is valid
    const currentListing = await Listing_1.default.findById(listing).lean().exec();
    if (!currentListing) {
        return res.status(400).json({ message: "Listing not found" });
    }
    //check duplicate requests
    const duplicate = await Tour_1.default.findOne({
        renter: _id,
        listing,
        tourStatus: tour_1.TourStatus.Unconfirmed, //and req is unconfirmed
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
    const tour = await Tour_1.default.create({
        renter: _id,
        agent: currentListing.user,
        listing,
        tourDates,
    });
    //push tour request notification
    await Notification_1.default.findOneAndUpdate({ user: currentListing.user }, //agent
    {
        $push: {
            tours: {
                title: "New tour request",
                tour: tour._id,
                tourStatus: tour_1.TourStatus.Unconfirmed,
            },
        },
    }, {
        new: true,
        upsert: true, // Makes this update into an upsert
    });
    res.json({ message: "Request sent" });
};
exports.requestTour = requestTour;
/*-----------------------------------------------------------
 * CONFIRM TOUR/BOTH
 ------------------------------------------------------------*/
/**
 * @desc - Confirm tour
 * @route - Patch api/tours/:id
 * @access - Private
 */
const confirmTour = async (req, res) => {
    const { id } = req.params;
    const { tourDate } = req.body;
    //does tour exist
    const tour = await Tour_1.default.findOne({
        $and: [
            { _id: id },
            {
                $or: [
                    { tourStatus: tour_1.TourStatus.Unconfirmed },
                    { tourStatus: tour_1.TourStatus.Rescheduled },
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
    tour.tourStatus = tour_1.TourStatus.Upcoming;
    tour.tourDate = tourDate;
    await tour.save();
    //push tour request notification
    await Notification_1.default.findOneAndUpdate({ user: tour.renter._id }, //renter
    {
        $push: {
            tours: {
                title: "Tour request confirmed",
                tour: tour._id,
                tourStatus: tour_1.TourStatus.Upcoming,
            },
        },
    }, {
        new: true,
        upsert: true, // Makes this update into an upsert
    });
    res.json({ message: "Tour confirmed!" });
};
exports.confirmTour = confirmTour;
/*-----------------------------------------------------------
 * RESCHEDULE TOUR
 ------------------------------------------------------------*/
/**
 * @desc - Confirm tour
 * @route - Patch api/tours/reschedule/:id
 * @access - Private
 */
const rescheduleTour = async (req, res) => {
    const { id } = req.params;
    const { tourDates } = req.body;
    //does tour exist
    const tour = await Tour_1.default.findOne({
        $and: [
            { _id: id },
            {
                $or: [{ tourStatus: tour_1.TourStatus.Upcoming }],
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
    tour.tourStatus = tour_1.TourStatus.Rescheduled;
    tour.tourDates = tourDates;
    await tour.save();
    //push tour request notification
    await Notification_1.default.findOneAndUpdate({ user: tour.agent._id }, //agent
    {
        $push: {
            tours: {
                title: "Tour rescheduled",
                tour: tour._id,
                tourStatus: tour_1.TourStatus.Rescheduled,
            },
        },
    }, {
        new: true,
        upsert: true, // Makes this update into an upsert
    });
    res.json({ message: "Tour rescheduled!" });
};
exports.rescheduleTour = rescheduleTour;
/*-----------------------------------------------------------
 * DECLINE TOUR
 ------------------------------------------------------------*/
/**
 * @desc - Decline tour
 * @route - Patch api/tours/:id
 * @access - Private
 */
const declineTour = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).json({ message: "All fields are required" });
    }
    //does tour exist
    const tour = await Tour_1.default.findOne({
        $and: [
            { _id: id },
            {
                $or: [{ tourStatus: tour_1.TourStatus.Unconfirmed }],
            },
        ],
    }).exec();
    if (!tour) {
        return res.status(400).json({ message: "Tour not found" });
    }
    //update status
    tour.tourStatus = tour_1.TourStatus.Declined;
    tour.comment = comment;
    await tour.save();
    res.json({ message: "Tour declined!" });
};
exports.declineTour = declineTour;
/*-----------------------------------------------------------
 * CANCEL TOUR
 ------------------------------------------------------------*/
/**
 * @desc - Cancel tour
 * @route - Patch api/tours/cancel/:id
 * @access - Private
 */
const cancelTour = async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params;
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).json({ message: "All fields are required" });
    }
    //does tour exist
    const tour = await Tour_1.default.findOne({
        $and: [
            { _id: id },
            {
                tourStatus: { $ne: tour_1.TourStatus.Cancelled },
            },
        ],
    }).exec();
    if (!tour) {
        return res.status(400).json({ message: "Tour not found" });
    }
    //update status
    tour.tourStatus = tour_1.TourStatus.Cancelled;
    tour.comment = comment;
    tour.cancelledBy = _id;
    await tour.save();
    res.json({ message: "Tour cancelled!" });
};
exports.cancelTour = cancelTour;
/*-----------------------------------------------------------
 * END TOUR/Both
 ------------------------------------------------------------*/
/**
 * @desc - End tour
 * @route - Patch api/tours/end/:id
 * @access - Private
 */
const endTour = async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params;
    const { rating, comment } = req.body;
    //does tour exist
    const tour = await Tour_1.default.findOne({
        $and: [
            { _id: id },
            {
                $or: [{ tourStatus: tour_1.TourStatus.Upcoming }],
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
    tour.tourStatus = tour_1.TourStatus.Completed;
    await tour.save();
    //insert commission
    await Commission_1.default.create({
        user: tour.agent._id,
        renter: tour.renter._id,
        tour: id,
        amount: 100,
        listing: tour.listing._id,
    });
    //if rating is true, insert review
    if (rating) {
        //create a review
        const review = new Review_1.default({
            postedBy: tour.renter._id,
            user: tour.agent._id,
            comment,
            rating,
        });
        await review.save();
    }
    res.json({ message: "Tour ended!" });
};
exports.endTour = endTour;
/*-----------------------------------------------------------
 * REMOVE FROM TOUR
 ------------------------------------------------------------*/
/**
 * @desc - Add to Tour
 * @route - Patch api/listings/tour/remove/:id
 * @access - Private
 */
const removeTour = async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params;
    //does tour exist
    const tour = await Tour_1.default.findOne({ user: _id, listing: id }).exec();
    if (!tour) {
        return res.status(400).json({ message: "Tour not found" });
    }
    tour.tourStatus = tour_1.TourStatus.Removed;
    await tour.save();
    //del//don't delete//populating tour id will return null. If no optional chaining used-> type error
    // await tour.remove();
    res.json({ message: "Removed from tour" });
};
exports.removeTour = removeTour;
