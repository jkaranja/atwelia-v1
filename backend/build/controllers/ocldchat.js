"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChats = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
const User_1 = __importDefault(require("../models/User"));
const Message_1 = __importDefault(require("../models/Message"));
/**
 * @desc - Get chats
 * @route - GET api/chat
 * @access - Private
 */
const getChats = async (req, res) => {
    const { _id } = req.user;
    /**----------------------------------
           * PAGINATION
    ------------------------------------*/
    //query string payload
    const page = parseInt(req.query.page) || 1; //current page no. / sent as string convert to number//page not sent use 1
    const size = parseInt(req.query.size) || 10; //items per page//if not sent from FE/ use default 15
    const skip = (page - 1) * size; //eg page = 5, it has already displayed 4 * 10//so skip prev items
    //get all chats where this user is a participant
    const chats = await Chat_1.default.find({ participants: { $elemMatch: { $eq: _id } } })
        // .sort({ updatedAt: -1 }) //desc//most recent
        .lean();
    // If no chats
    if (!chats.length) {
        return res.status(400).json({ message: "No chats found" });
    }
    //filter->messages that belong to any of the chats for this user
    const filter = {
        $and: [{ chat: { $in: chats.map((chat) => chat._id) } }],
    };
    const chatsTotal = await Message_1.default.aggregate([
        { $match: filter },
        {
            $group: {
                _id: "$chat",
            },
        },
    ]);
    const total = chatsTotal.length;
    //if total = 0 //error
    if (!total) {
        return res.status(400).json({ message: "No chats found" });
    }
    const pages = Math.ceil(total / size);
    // //in case invalid page is sent//out of range//not from the pages sent
    if (page > pages) {
        return res.status(400).json({ message: "No chats found" });
    }
    const allChats = await Message_1.default.aggregate([
        { $match: filter },
        {
            $group: {
                _id: "$chat",
                content: { $last: "$content" },
                sender: { $last: "$sender" },
                unreadCount: {
                    $sum: {
                        $cond: [{ $eq: ["$isRead", false] }, 1, 0],
                    },
                },
                createdAt: { $last: "$createdAt" },
            },
        },
        {
            $project: {
                chatId: "$_id",
                content: 1,
                sender: 1,
                createdAt: 1,
                _id: 0,
                unreadCount: 1,
            },
        },
        { $sort: { unreadCount: -1 } },
        { $limit: size },
        { $skip: skip },
    ]);
    // If no chats
    if (!allChats.length) {
        return res.status(400).json({ message: "No chats found" });
    }
    const results = await Promise.all(allChats.map(async (chat) => {
        //populate sender
        const result = await User_1.default.populate(chat, {
            path: "sender",
            select: "_id profilePic username",
        });
        const chatInfo = await Chat_1.default.findById(chat.chatId);
        const recipient = chatInfo?.participants.find((p) => String(p._id) !== String(_id) //must convert ObjectIds to string first as they are compared by reference
        );
        const recipientInfo = await User_1.default.findById(recipient, "_id profilePic username");
        return {
            ...result,
            recipient: recipientInfo,
        };
    }));
    res.json({
        pages,
        total,
        chats: results,
    });
};
exports.getChats = getChats;
