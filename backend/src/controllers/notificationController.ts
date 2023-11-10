import { RequestHandler } from "express";
import Notification from "../models/Notification";

/**
 * @desc - Get notifications
 * @route - GET api/notifications
 * @access - Private
 */
export const getNotifications: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const notifications = await Notification.findOne({
    user: _id,
  }).exec();

  if (!notifications) {
    return res.status(400).json({ message: "Notifications not available" });
  }

  res.json(notifications);
};

/*-----------------------------------------------------------
 * SAVE PUSH TOKEN
 ------------------------------------------------------------*/

/**
 * @desc - Save push token ->add push token
 * @route - PUT api/notifications-->PUT creates or replaces resource-->idempotent
 * @access - Public
 */
export const savePushToken: RequestHandler = async (req, res) => {
  const { pushToken } = req.body;

  const user = req.user;

  //prevent duplicate->pushToken is unique per device
  await Notification.findOneAndUpdate(
    { pushToken },
    {
      $set: { user: user?._id || null },
    },
    {
      new: true,
      upsert: true, // Makes this update into an upsert
    }
  );

  res.json({ message: "Token saved" });
};

/*-----------------------------------------------------------
 * CLEAR TOUR NOTIFICATIONS
 ------------------------------------------------------------*/
/**
 * @desc - Clear all tour notifications
 * @route - PATCH api/notifications
 * @access - Public
 */
export const removeTourNotifications: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const { tourStatus } = req.body;

  const tours = await Notification.findOneAndUpdate(
    { user: _id },
    { $pull: { tours: { tourStatus } } }, //pull from tour all docs that match tour status
    { timestamps: false, new: true }
  );

  if (!tours) {
    return res.status(400).json({ message: "Not cleared" });
  }

  res.json({ message: "Cleared!" });
};

/*-----------------------------------------------------------
 * CLEAR INBOX NOTIFICATIONS
 ------------------------------------------------------------*/
/**
 * @desc - Clear inbox notifications per chat
 * @route - PATCH api/notifications/:id
 * @access - Public
 */
export const removeInboxNotifications: RequestHandler = async (req, res) => {
  const { _id } = req.user!;

  const { id } = req.params;

  const inbox = await Notification.findOneAndUpdate(
    { user: _id },
    { $pull: { inbox: { chat: id } } }, //pull from inbox all docs that has chat===id
    { timestamps: false, new: true }
  );

  if (!inbox) {
    return res.status(400).json({ message: "Not cleared" });
  }

  res.json({ message: "Cleared!" });
};
