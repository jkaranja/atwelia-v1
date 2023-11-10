"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.updateMessageStatus = exports.postMessage = exports.getMessages = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const Notification_1 = __importDefault(require("../models/Notification"));
const chat_1 = require("../types/chat");
const cleanFiles_1 = __importDefault(require("../utils/cleanFiles"));
const deleteFiles_1 = __importDefault(require("../utils/deleteFiles"));
/**
 * @desc - All messages for a certain chat
 * @route - GET api/chats/:id
 * @access - Private
 */
const getMessages = async (req, res) => {
    const { _id } = req.user;
    /**----------------------------------
           * PAGINATION
    ------------------------------------*/
    //query string payload
    const page = parseInt(req.query.page) || 1; //current page no. / sent as string convert to number//page not sent use 1
    const size = parseInt(req.query.size) || 10; //items per page//if not sent from FE/ use default 15
    const skip = (page - 1) * size; //eg page = 5, it has already displayed 4 * 10//so skip prev items
    const { id } = req.params; //chat id
    //does chat exist
    const chat = await Chat_1.default.findById(id).exec();
    if (!chat) {
        return res.status(400).json({ message: "No messages found" });
    }
    //filter
    const filter = {
        chat: id,
        messageStatus: chat_1.MessageStatus.Available, //filter out removed messages
    };
    const total = await Message_1.default.find(filter).count(); //or Message.countDocument() ///total docs
    //if total = 0 //error
    if (!total) {
        return res.status(400).json({ message: "No messages found" });
    }
    const pages = Math.ceil(total / size);
    // //in case invalid page is sent//out of range//not from the pages sent
    if (page > pages) {
        return res.status(400).json({ message: "No messages found" });
    }
    const messages = await Message_1.default.find(filter)
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
exports.getMessages = getMessages;
/*-----------------------------------------------------------
 * POST MESSAGE
 ------------------------------------------------------------*/
/**
 * @desc - Post chat
 * @route - POST api/chat/messages
 * @access - Private
 */
const postMessage = async (req, res) => {
    const { _id } = req.user;
    const { content, recipient } = req.body;
    const { files } = req;
    const messageFiles = files?.length ? (0, cleanFiles_1.default)(files) : [];
    try {
        //check if recipient is valid
        if (!(0, mongoose_1.isValidObjectId)(recipient)) {
            throw new Error("Invalid data");
        }
        //user can't message themselves
        if (String(recipient) === String(_id)) {
            throw new Error("Forbidden! Sending message to yourself");
        }
        // create chat if it doesn't exist
        const chat = await Chat_1.default.findOneAndUpdate({
            $and: [
                { participants: { $elemMatch: { $eq: _id } } },
                { participants: { $elemMatch: { $eq: recipient } } },
            ],
        }, {
            $set: { admin: _id, participants: [_id, recipient] },
        }, {
            new: true,
            upsert: true, // Makes this update into an upsert
        });
        //message Document
        const newMessage = new Message_1.default({
            sender: _id,
            content,
            chat: chat._id,
            files: messageFiles,
        });
        const created = await newMessage.save();
        //update last message in Chat
        await Chat_1.default.findByIdAndUpdate(chat, {
            latestMessage: created._id,
        });
        //push new notification message
        await Notification_1.default.findOneAndUpdate({ user: recipient }, {
            $push: {
                inbox: {
                    title: "Unread message",
                    chat: chat._id,
                },
            },
        }, {
            new: true,
            upsert: true, // Makes this update into an upsert
        });
        return res.json({
            message: await created.populate({
                path: "sender",
                select: "_id username profile",
                populate: { path: "profile", select: "_id profilePic" },
            }),
        });
    }
    catch (error) {
        //delete chat files if err
        (0, deleteFiles_1.default)(messageFiles);
        res.status(400).json({ message: error.message });
    }
};
exports.postMessage = postMessage;
/*-----------------------------------------------------------
 * UPDATE MESSAGE STATUS
 ------------------------------------------------------------*/
/**
 * @desc - Update unread messages->isRead-->true
 * @route - PATCH api/chats/messages/:id
 * @access - Private
 */
const updateMessageStatus = async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params; //chat id
    const updated = await Message_1.default.updateMany({ chat: id, sender: { $neq: _id }, isRead: false }, { $set: { isRead: true } });
    if (!updated.modifiedCount) {
        throw new Error("No record found.");
    }
    res.json({ message: "Marked as read!" });
};
exports.updateMessageStatus = updateMessageStatus;
/*-----------------------------------------------------------
 * DELETE MESSAGE
 ------------------------------------------------------------*/
/**
 * @desc - Delete chat
 * @route - DELETE api/chat/messages/:id
 * @access - Private
 */
const deleteMessage = async (req, res) => {
    const { id } = req.params; //message id
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(400).json({ message: "Chat not found" });
    }
    //does message exist
    const message = await Message_1.default.findById(id).exec();
    if (!message) {
        return res.status(400).json({ message: "Message not found" });
    }
    //del//don't delete lastMessage in chat will be null when populated and if no optional chaining in frontend-> error
    // await message.remove();
    message.messageStatus = chat_1.MessageStatus.Removed;
    await message.save();
    //delete message files if any
    (0, deleteFiles_1.default)(message.files);
    res.json({ message: "Message deleted" });
};
exports.deleteMessage = deleteMessage;
