import { Schema, Types, model, models, now } from "mongoose";
import { TourStatus } from "../types/tour";

export enum PushStatus {
  Pending = "Pending",
  Sent = "Sent",
}

interface INotificationMessage {
  title: String;
  chat?: Types.ObjectId;
  tour?: Types.ObjectId;
  createdAt: Date;
  pushStatus: "Pending" | "Sent";
}

interface INotification {
  user: Types.ObjectId;
  pushToken: string;
  tours: INotificationMessage[];
  inbox: INotificationMessage[];
  updatedAt: string
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    pushToken: String,
    tours: [
      { 
        title: String,
        tour: { type: Schema.Types.ObjectId, ref: "Tour" },
        tourStatus: {type: String, enum: TourStatus},
        pushStatus: {
          type: String,
          enum: PushStatus,
          default: PushStatus.Pending,
        },
        createdAt: { type: Date, default: now },
      },
    ],
    inbox: [
      {
        title: String,
        chat: { type: Schema.Types.ObjectId, ref: "Chat" },
        pushStatus: {
          type: String,
          enum: PushStatus,
          default: PushStatus.Pending,
        },
        createdAt: { type: Date, default: now },
      },
    ],
  },
  { timestamps: true }
);

export default model<INotification>("Notification", notificationSchema);
