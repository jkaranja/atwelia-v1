"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeInboxNotifications = exports.removeTourNotifications = exports.savePushToken = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
/**
 * @desc - Get notifications
 * @route - GET api/notifications
 * @access - Private
 */
const getNotifications = async (req, res) => {
    const { _id } = req.user;
    const notifications = await Notification_1.default.findOne({
        user: _id,
    }).exec();
    if (!notifications) {
        return res.status(400).json({ message: "Notifications not available" });
    }
    res.json(notifications);
};
exports.getNotifications = getNotifications;
/*-----------------------------------------------------------
 * SAVE PUSH TOKEN
 ------------------------------------------------------------*/
/**
 * @desc - Save push token ->add push token
 * @route - PUT api/notifications-->PUT creates or replaces resource-->idempotent
 * @access - Public
 */
const savePushToken = async (req, res) => {
    const { pushToken } = req.body;
    const user = req.user;
    //prevent duplicate->pushToken is unique per device
    await Notification_1.default.findOneAndUpdate({ pushToken }, {
        $set: { user: user?._id || null },
    }, {
        new: true,
        upsert: true, // Makes this update into an upsert
    });
    res.json({ message: "Token saved" });
};
exports.savePushToken = savePushToken;
/*-----------------------------------------------------------
 * CLEAR TOUR NOTIFICATIONS
 ------------------------------------------------------------*/
/**
 * @desc - Clear all tour notifications
 * @route - PATCH api/notifications
 * @access - Public
 */
const removeTourNotifications = async (req, res) => {
    const { _id } = req.user;
    const { tourStatus } = req.body;
    const tours = await Notification_1.default.findOneAndUpdate({ user: _id }, { $pull: { tours: { tourStatus } } }, //pull from tour all docs that match tour status
    { timestamps: false, new: true });
    if (!tours) {
        return res.status(400).json({ message: "Not cleared" });
    }
    res.json({ message: "Cleared!" });
};
exports.removeTourNotifications = removeTourNotifications;
/*-----------------------------------------------------------
 * CLEAR INBOX NOTIFICATIONS
 ------------------------------------------------------------*/
/**
 * @desc - Clear inbox notifications per chat
 * @route - PATCH api/notifications/:id
 * @access - Public
 */
const removeInboxNotifications = async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params;
    const inbox = await Notification_1.default.findOneAndUpdate({ user: _id }, { $pull: { inbox: { chat: id } } }, //pull from inbox all docs that has chat===id
    { timestamps: false, new: true });
    if (!inbox) {
        return res.status(400).json({ message: "Not cleared" });
    }
    res.json({ message: "Cleared!" });
};
exports.removeInboxNotifications = removeInboxNotifications;
