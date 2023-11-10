import { RequestHandler } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import Chat from "../models/Chat";
import Message from "../models/Message";
import Notification from "../models/Notification";
import { MessageStatus } from "../types/chat";
import cleanFiles from "../utils/cleanFiles";
import deleteFiles from "../utils/deleteFiles";

interface SearchQuery {
  page: string;
  size: string;
}

/**
 * @desc - All messages for a certain chat
 * @route - GET api/chats/:id
 * @access - Private
 */
export const getMessages: RequestHandler<
  { id: string },
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

  const { id } = req.params; //chat id

  //does chat exist
  const chat = await Chat.findById(id).exec();

  if (!chat) {
    return res.status(400).json({ message: "No messages found" });
  }

  //filter
  const filter = {
    chat: id,
    messageStatus: MessageStatus.Available, //filter out removed messages
  };

  const total = await Message.find(filter).count(); //or Message.countDocument() ///total docs
  //if total = 0 //error
  if (!total) {
    return res.status(400).json({ message: "No messages found" });
  }

  const pages = Math.ceil(total / size);

  // //in case invalid page is sent//out of range//not from the pages sent
  if (page > pages) {
    return res.status(400).json({ message: "No messages found" });
  }

  const messages = await Message.find(filter)
    .skip(skip)
    .limit(size)
    .populate({
      path: "sender",
      select: "_id username profile",
      populate: { path: "profile", select: "_id profilePic" },
    })
    .sort({ updatedAt: -1 }) //desc//recent first
    .lean(); //return a pure js object//not mongoose document//don't convert result to mongoose document//about 5x smaller!//faster

  res.json({
    pages,
    total,
    messages,
  });
};

/*-----------------------------------------------------------
 * POST MESSAGE
 ------------------------------------------------------------*/
/**
 * @desc - Post chat
 * @route - POST api/chat/messages
 * @access - Private
 */
export const postMessage: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const { content, recipient } = req.body;

  const { files } = req;

  const messageFiles = files?.length ? cleanFiles(files) : [];

  try {
    //check if recipient is valid
    if (!isValidObjectId(recipient)) {
      throw new Error("Invalid data");
    }

    //user can't message themselves
    if (String(recipient) === String(_id)) {
      throw new Error("Forbidden! Sending message to yourself");
    }

    // create chat if it doesn't exist
    const chat = await Chat.findOneAndUpdate(
      {
        $and: [
          { participants: { $elemMatch: { $eq: _id } } },
          { participants: { $elemMatch: { $eq: recipient } } },
        ],
      },
      {
        $set: { admin: _id, participants: [_id, recipient] },
      },
      {
        new: true, //return new/modified document doc
        upsert: true, // Makes this update into an upsert
      }
    );

    //message Document
    const newMessage = new Message({
      sender: _id,
      content,
      chat: chat._id,
      files: messageFiles,
    });

    const created = await newMessage.save();

    //update last message in Chat
    await Chat.findByIdAndUpdate(chat, {
      latestMessage: created._id,
    });

    //push new notification message
    await Notification.findOneAndUpdate(
      { user: recipient },

      {
        $push: {
          inbox: {
            title: "Unread message",
            chat: chat._id,
          },
        },
      },
      {
        new: true, //return new/modified document doc
        upsert: true, // Makes this update into an upsert
      }
    );

    return res.json({
      message: await created.populate({
        path: "sender",
        select: "_id username profile",
        populate: { path: "profile", select: "_id profilePic" },
      }),
    });
  } catch (error: any) {
    //delete chat files if err
    deleteFiles(messageFiles);

    res.status(400).json({ message: error.message });
  }
};

/*-----------------------------------------------------------
 * UPDATE MESSAGE STATUS
 ------------------------------------------------------------*/

/**
 * @desc - Update unread messages->isRead-->true
 * @route - PATCH api/chats/messages/:id
 * @access - Private
 */
export const updateMessageStatus: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const { id } = req.params; //chat id

  const updated = await Message.updateMany(
    { chat: id, sender: { $neq: _id }, isRead: false },

    { $set: { isRead: true } }
  );

  if (!updated.modifiedCount) {
    throw new Error("No record found.");
  }
  res.json({ message: "Marked as read!" });
};

/*-----------------------------------------------------------
 * DELETE MESSAGE
 ------------------------------------------------------------*/
/**
 * @desc - Delete chat
 * @route - DELETE api/chat/messages/:id
 * @access - Private
 */
export const deleteMessage: RequestHandler = async (req, res) => {
  const { id } = req.params; //message id

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Chat not found" });
  }

  //does message exist
  const message = await Message.findById(id).exec();

  if (!message) {
    return res.status(400).json({ message: "Message not found" });
  }
  //del//don't delete lastMessage in chat will be null when populated and if no optional chaining in frontend-> error
  // await message.remove();
  message.messageStatus = MessageStatus.Removed;

  await message.save();

  //delete message files if any
  deleteFiles(message.files);

  res.json({ message: "Message deleted" });
};
