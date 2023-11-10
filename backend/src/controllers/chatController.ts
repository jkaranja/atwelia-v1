import { RequestHandler } from "express";
import mongoose, { Types, isValidObjectId } from "mongoose";
import Chat from "../models/Chat";
import User from "../models/User";
import cleanFiles from "../utils/cleanFiles";
import deleteFiles from "../utils/deleteFiles";
import Message from "../models/Message";
import sendPushNotification from "../utils/sendPushNotification";

interface SearchQuery {
  page: string;
  size: string;
}

/**
 * @desc - Get chats
 * @route - GET api/chats
 * @access - Private
 */
export const getChats: RequestHandler<
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

  //filter->get all chats where this user is a participant
  const filter = { participants: { $elemMatch: { $eq: _id } } };

  const total = await Chat.find(filter).count(); //or Listing.countDocument() ///total docs
  //if total = 0 //error
  if (!total) {
    return res.status(400).json({ message: "No chats found" });
  }

  const pages = Math.ceil(total / size);

  // //in case invalid page is sent//out of range//not from the pages sent
  if (page > pages) {
    return res.status(400).json({ message: "No chats found" });
  }

  const chats = await Chat.find(filter)
    .skip(skip)
    .limit(size)
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "_id username phoneNumber profile",
        populate: { path: "profile", select: "_id profilePic" },
      },
    })
    .populate({
      path: "participants",
      select: "_id username phoneNumber profile",
      populate: { path: "profile", select: "_id profilePic" },
    })
    .sort({ updatedAt: -1 }) //desc//recent first
    .lean(); //return a pure js object//not mongoose document//don't convert result to mongoose document//about 5x smaller!//faster

  res.json({
    pages,
    total,
    chats,
  });
};
